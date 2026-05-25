import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { downloadNgoMonthlyPdf, downloadNgoReportCsv, type NgoReportChartData, type NgoReportMetrics } from '../utils/reportExport';

export type ReportsPageProps = {
  ngoData?: Record<string, unknown> | null;
  submissions?: Record<string, unknown>[];
  orders?: Record<string, unknown>[];
  bulkEntries?: Record<string, unknown>[];
};

export const ReportsPage = ({ ngoData, submissions = [], orders = [], bulkEntries = [] }: ReportsPageProps) => {
  const [metrics, setMetrics] = useState<NgoReportMetrics | null>(null);
  const [chartData, setChartData] = useState<NgoReportChartData>({ trees_over_time: [], regional_breakdown: [] });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<'pdf' | 'csv' | null>(null);

  useEffect(() => {
    const computeMetrics = () => {
      const all = submissions || [];
      const totalTrees = all.reduce((sum, s) => sum + (s.count ?? 0), 0);
      const plantedTrees = all.reduce((sum, s) => sum + (s.count ?? 0), 0);

      const onTimeRate = totalTrees ? Math.round((plantedTrees / Math.max(1, totalTrees)) * 100) : 0;
      const avgSubmissionTime = all.length
        ? Math.round(
            all.reduce((sum, s) => {
              const time = s.createdAt ? new Date(s.createdAt).getTime() : Date.now();
              return sum + (Date.now() - time);
            }, 0) /
              all.length /
              3600000
          )
        : 0;

      const treesOverTime: Record<string, number> = {};
      const regionalBreakdown: Record<string, number> = {};

      all.forEach((s) => {
        const dateKey = s.createdAt
          ? new Date(s.createdAt).toLocaleString('default', { month: 'short' })
          : 'Unknown';
        treesOverTime[dateKey] = (treesOverTime[dateKey] || 0) + (s.count ?? 0);

        const region = s.location || 'Unknown';
        regionalBreakdown[region] = (regionalBreakdown[region] || 0) + (s.count ?? 0);
      });

      return {
        metrics: {
          total_trees_planted: totalTrees,
          avg_submission_time: avgSubmissionTime,
          on_time_rate: onTimeRate,
          survival_rate: totalTrees ? Math.round((plantedTrees / totalTrees) * 100) : 0,
        },
        chartData: {
          trees_over_time: Object.entries(treesOverTime).map(([month, trees]) => ({ month, trees })),
          regional_breakdown: Object.entries(regionalBreakdown).map(([region, count]) => ({ region, count })),
        },
      };
    };

    const { metrics: newMetrics, chartData: newChartData } = computeMetrics();
    setMetrics(newMetrics);
    setChartData(newChartData);
    setLoading(false);
  }, [submissions]);

  const reportContext = useMemo(
    () =>
      metrics
        ? {
            ngoData,
            submissions,
            orders,
            bulkEntries,
            metrics,
            chartData,
          }
        : null,
    [ngoData, submissions, orders, bulkEntries, metrics, chartData],
  );

  const handleDownloadPdf = useCallback(() => {
    if (!reportContext) return;
    setExporting('pdf');
    try {
      downloadNgoMonthlyPdf(reportContext);
      toast.success('Monthly PDF downloaded');
    } catch {
      toast.error('Could not generate PDF');
    } finally {
      setExporting(null);
    }
  }, [reportContext]);

  const handleDownloadCsv = useCallback(() => {
    if (!reportContext) return;
    setExporting('csv');
    try {
      downloadNgoReportCsv(reportContext);
      toast.success('Report spreadsheet downloaded');
    } catch {
      toast.error('Could not export report');
    } finally {
      setExporting(null);
    }
  }, [reportContext]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Total Trees Planted</div>
          <div className="text-2xl font-black text-gray-900 mt-2">{metrics.total_trees_planted}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Avg Submission Time</div>
          <div className="text-2xl font-black text-gray-900 mt-2">{metrics.avg_submission_time} days</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">On-Time Rate</div>
          <div className="text-2xl font-black text-gray-900 mt-2">{metrics.on_time_rate}%</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Survival Rate</div>
          <div className="text-2xl font-black text-gray-900 mt-2">{metrics.survival_rate}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tree Plantation Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.trees_over_time}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="trees" stroke="#16A34A" strokeWidth={2} dot={{ fill: '#16A34A' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.regional_breakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="region" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#16A34A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#b2d8d0]/50 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Reports</h3>
        <p className="text-sm text-gray-500 mb-4">
          PDF covers this month&apos;s plantation activity. Spreadsheet includes summary, orders, and all plantation records from your dashboard data.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            disabled={!reportContext || exporting !== null}
            onClick={handleDownloadPdf}
            className="py-3 px-4 rounded-xl bg-[#5a9e94] text-white font-bold hover:bg-[#4a8e84] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting === 'pdf' ? 'Generating PDF…' : 'Download Monthly PDF'}
          </button>
          <button
            type="button"
            disabled={!reportContext || exporting !== null}
            onClick={handleDownloadCsv}
            className="py-3 px-4 rounded-xl bg-[#eef8f6] text-[#2d6a62] font-bold border border-[#b2d8d0] hover:bg-[#b2d8d0]/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting === 'csv' ? 'Exporting…' : 'Download CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};
