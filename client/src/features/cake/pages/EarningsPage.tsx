import { useCallback, useEffect, useState } from 'react';
import { TrendingUp, Download, IndianRupee, CalendarCheck } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';
import { Button } from '../../../shared/components/ui/button';
import { MetricCard } from '../components/MetricCard';
import { CakePageHeader } from '../components/CakePageHeader';
import { DateRangeFilter } from '../components/DateRangeFilter';
import { CakeLoadingState, CakeErrorState } from '../components/LoadingState';
import { useCakeUser } from '../CakeUserContext';
import { fetchVendorEarnings, formatInr, type VendorEarnings } from '../api/finance';
import { exportEarningsRecordsToExcel } from '../utils/excelExport';

export function EarningsPage() {
  const { id: vendorId } = useCakeUser();
  const [earnings, setEarnings] = useState<VendorEarnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const load = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVendorEarnings(vendorId, {
        start: start || undefined,
        end: end || undefined,
      });
      setEarnings(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load earnings');
    } finally {
      setLoading(false);
    }
  }, [vendorId, start, end]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !earnings) return <CakeLoadingState />;
  if (error) return <CakeErrorState message={error} onRetry={() => void load()} />;
  if (!earnings) return null;

  return (
    <div className="space-y-8 text-[#1F2937]">
      <CakePageHeader
        title="Earnings"
        description="Only OTP-verified deliveries appear here."
        icon={TrendingUp}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="border-[#FBCFE8]"
            onClick={() => {
              exportEarningsRecordsToExcel(earnings.records);
              toast.success('Excel exported');
            }}
          >
            <Download className="w-4 h-4 mr-1" />
            Export Excel
          </Button>
        }
      />

      <DateRangeFilter start={start} end={end} onStartChange={setStart} onEndChange={setEnd} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={IndianRupee} title="Total revenue" value={formatInr(earnings.totalRevenue)} gradient="from-[#10B981] to-[#34D399]" />
        <MetricCard icon={CalendarCheck} title="Delivered orders" value={earnings.deliveredCount} gradient="from-[#EC4899] to-[#FBCFE8]" />
        <MetricCard icon={TrendingUp} title="Weekly" value={formatInr(earnings.weeklyRevenue)} gradient="from-[#8B5CF6] to-[#C4B5FD]" />
        <MetricCard icon={TrendingUp} title="Monthly" value={formatInr(earnings.monthlyRevenue)} gradient="from-[#F59E0B] to-[#FCD34D]" />
      </div>

      {earnings.revenueTrend.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Revenue trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={earnings.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => formatInr(v)} />
              <Bar dataKey="revenue" fill="#EC4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-[#FDF2F8]/50">
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Cake</th>
                <th className="text-left p-4">Units</th>
                <th className="text-right p-4">Per unit</th>
                <th className="text-right p-4">Total</th>
                <th className="text-left p-4">Delivered</th>
              </tr>
            </thead>
            <tbody>
              {earnings.records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No verified deliveries yet. Complete OTP on an order first.
                  </td>
                </tr>
              ) : (
                earnings.records.map((r) => (
                  <tr key={r._id} className="border-b border-gray-50 hover:bg-[#FDF2F8]/30">
                    <td className="p-4 font-mono text-[#EC4899]">{r.orderId}</td>
                    <td className="p-4 font-medium">{r.customerName}</td>
                    <td className="p-4">
                      {r.cakeName} · {r.cakeSize}
                    </td>
                    <td className="p-4">{r.quantity}</td>
                    <td className="p-4 text-right">{formatInr(r.pricePerUnit)}</td>
                    <td className="p-4 text-right font-semibold">{formatInr(r.totalPrice)}</td>
                    <td className="p-4">
                      {new Date(r.deliveredAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
