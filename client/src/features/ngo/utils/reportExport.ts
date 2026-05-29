import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

const CO2_KG_PER_TREE_PER_YEAR = 21;

export type NgoReportMetrics = {
  total_trees_planted: number;
  avg_submission_time: number;
  on_time_rate: number;
  survival_rate: number;
};

export type NgoReportChartData = {
  trees_over_time: { month: string; trees: number }[];
  regional_breakdown: { region: string; count: number }[];
};

export type NgoReportContext = {
  ngoData?: Record<string, unknown> | null;
  submissions: Record<string, unknown>[];
  orders: Record<string, unknown>[];
  bulkEntries: Record<string, unknown>[];
  metrics: NgoReportMetrics;
  chartData: NgoReportChartData;
};

function ngoName(data?: Record<string, unknown> | null): string {
  return String(data?.name ?? data?.ngo_name ?? 'NGO Partner');
}

function ngoArea(data?: Record<string, unknown> | null): string {
  return String(data?.area ?? data?.region ?? '—');
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

function isInReportMonth(date: Date | null, year: number, month: number): boolean {
  if (!date) return false;
  return date.getFullYear() === year && date.getMonth() === month;
}

function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

function orderNameById(orders: Record<string, unknown>[]): Map<string, string> {
  const map = new Map<string, string>();
  orders.forEach((o) => {
    const id = String(o.id ?? '');
    const name = String(o.name ?? '');
    if (id && name) map.set(id, name);
  });
  return map;
}

function buildPlantationRows(ctx: NgoReportContext, year: number, month: number) {
  const names = orderNameById(ctx.orders);
  const rows: Record<string, string | number>[] = [];

  (ctx.submissions || []).forEach((s) => {
    const created = parseDate(s.createdAt);
    if (!isInReportMonth(created, year, month)) return;
    const orderId = String(s.orderId ?? s.order ?? '');
    rows.push({
      Date: created!.toLocaleDateString('en-IN'),
      Type: 'Plantation Submission',
      'Beneficiary / Order': names.get(orderId) || orderId || '—',
      Location: String(s.location ?? '—'),
      Species: String(s.species ?? 'Mixed native'),
      Trees: Number(s.count ?? 0),
      Latitude: Number(s.lat ?? 0),
      Longitude: Number(s.lng ?? 0),
      Notes: String(s.note ?? ''),
    });
  });

  (ctx.bulkEntries || []).forEach((b) => {
    const created = parseDate(b.createdAt);
    if (!isInReportMonth(created, year, month)) return;
    const orderId = String(b.orderId ?? '');
    rows.push({
      Date: created!.toLocaleDateString('en-IN'),
      Type: 'Bulk Tree Entry',
      'Beneficiary / Order': names.get(orderId) || orderId || 'Community bulk',
      Location: String(b.location ?? '—'),
      Species: String(b.species ?? 'Mixed native'),
      Trees: Number(b.count ?? 0),
      Latitude: Number(b.lat ?? 0),
      Longitude: Number(b.lng ?? 0),
      Notes: String(b.note ?? ''),
    });
  });

  return rows;
}

function buildOrderRows(ctx: NgoReportContext) {
  return (ctx.orders || []).map((o) => ({
    'Order ID': String(o.id ?? ''),
    Customer: String(o.name ?? '—'),
    Status: String(o.status ?? 'new'),
    'Tree Count': Number(o.tree_count ?? 0),
    Location: String(o.location ?? o.region ?? '—'),
    Region: String(o.region ?? '—'),
    Deadline: o.deadline ? String(o.deadline) : '—',
  }));
}

function orderStats(ctx: NgoReportContext) {
  const orders = ctx.orders || [];
  const assigned = orders.length;
  const completed = orders.filter((o) => String(o.status ?? '').toLowerCase() === 'planted').length;
  const pending = orders.filter((o) => String(o.status ?? '').toLowerCase() === 'new').length;
  const inProgress = assigned - completed - pending;
  const orderTrees = orders.reduce((sum, o) => sum + Number(o.tree_count ?? 0), 0);
  const bulkTrees = (ctx.bulkEntries || []).reduce((sum, b) => sum + Number(b.count ?? 0), 0);
  const submissionTrees = (ctx.submissions || []).reduce((sum, s) => sum + Number(s.count ?? 0), 0);
  const totalTrees = orderTrees + bulkTrees;
  const co2KgYear = totalTrees * CO2_KG_PER_TREE_PER_YEAR;

  return { assigned, completed, pending, inProgress, orderTrees, bulkTrees, submissionTrees, totalTrees, co2KgYear };
}

function safeFilenamePart(s: string): string {
  return s.replace(/[^\w\-]+/g, '_').slice(0, 40);
}

export function downloadNgoReportCsv(ctx: NgoReportContext): void {
  const now = new Date();
  const stats = orderStats(ctx);
  const summaryRows = [
    { Field: 'NGO Name', Value: ngoName(ctx.ngoData) },
    { Field: 'Zone / Area', Value: ngoArea(ctx.ngoData) },
    { Field: 'Report Generated', Value: now.toLocaleString('en-IN') },
    { Field: 'Total Trees (orders + bulk)', Value: stats.totalTrees },
    { Field: 'Trees from Submissions', Value: stats.submissionTrees },
    { Field: 'Trees from Bulk Entries', Value: stats.bulkTrees },
    { Field: 'Orders Assigned', Value: stats.assigned },
    { Field: 'Orders Completed (planted)', Value: stats.completed },
    { Field: 'Orders In Progress', Value: stats.inProgress },
    { Field: 'Orders Pending', Value: stats.pending },
    { Field: 'CO2 Absorption Estimate (kg/year)', Value: stats.co2KgYear },
    { Field: 'On-Time Rate (%)', Value: ctx.metrics.on_time_rate },
    { Field: 'Survival Rate (%)', Value: ctx.metrics.survival_rate },
  ];

  const plantationAll = [
    ...(ctx.submissions || []).map((s) => {
      const orderId = String(s.orderId ?? s.order ?? '');
      const names = orderNameById(ctx.orders);
      const created = parseDate(s.createdAt);
      return {
        Date: created ? created.toLocaleDateString('en-IN') : '—',
        Type: 'Plantation Submission',
        'Beneficiary / Order': names.get(orderId) || orderId || '—',
        Location: String(s.location ?? '—'),
        Species: String(s.species ?? 'Mixed native'),
        Trees: Number(s.count ?? 0),
        Latitude: Number(s.lat ?? 0),
        Longitude: Number(s.lng ?? 0),
      };
    }),
    ...(ctx.bulkEntries || []).map((b) => {
      const orderId = String(b.orderId ?? '');
      const names = orderNameById(ctx.orders);
      const created = parseDate(b.createdAt);
      return {
        Date: created ? created.toLocaleDateString('en-IN') : '—',
        Type: 'Bulk Tree Entry',
        'Beneficiary / Order': names.get(orderId) || orderId || 'Community bulk',
        Location: String(b.location ?? '—'),
        Species: String(b.species ?? 'Mixed native'),
        Trees: Number(b.count ?? 0),
        Latitude: Number(b.lat ?? 0),
        Longitude: Number(b.lng ?? 0),
      };
    }),
  ];

  const orderRows = buildOrderRows(ctx);
  const regionalRows = ctx.chartData.regional_breakdown.length
    ? ctx.chartData.regional_breakdown
    : [{ region: '—', count: 0 }];

  const fileBase = `ngo-report-${safeFilenamePart(ngoName(ctx.ngoData))}-${now.toISOString().slice(0, 10)}`;

  const detailRows = [
    ...summaryRows.map((r) => ({ Record: 'Summary', ...r })),
    ...orderRows.map((r) => ({ Record: 'Order', ...r })),
    ...(plantationAll.length ? plantationAll : [{ Record: 'Plantation', Message: 'No records' }]).map((r) => ({
      Record: 'Plantation',
      ...r,
    })),
    ...regionalRows.map((r) => ({ Record: 'Regional', Region: r.region, Trees: r.count })),
  ];

  const ws = XLSX.utils.json_to_sheet(detailRows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileBase}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadNgoMonthlyPdf(ctx: NgoReportContext): void {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const label = monthLabel(year, month);
  const stats = orderStats(ctx);
  const monthRows = buildPlantationRows(ctx, year, month);
  const monthTrees = monthRows.reduce((sum, r) => sum + Number(r.Trees ?? 0), 0);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  let y = margin;

  const green: [number, number, number] = [90, 158, 148];
  const mint: [number, number, number] = [178, 216, 208];
  const dark: [number, number, number] = [31, 41, 55];
  const gray: [number, number, number] = [107, 114, 128];

  doc.setFillColor(...mint);
  doc.rect(0, 0, pageW, 32, 'F');
  doc.setTextColor(...dark);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ForestGift — NGO Impact Report', margin, 14);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(ngoName(ctx.ngoData), margin, 22);
  doc.text(`${ngoArea(ctx.ngoData)} · ${label}`, margin, 28);

  y = 42;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Monthly summary', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  const summaryLines = [
    `Report period: ${label}`,
    `Generated: ${now.toLocaleString('en-IN')}`,
    `Trees planted this month: ${monthTrees}`,
    `Total trees (all time): ${stats.totalTrees}`,
    `Submission records: ${stats.submissionTrees} trees`,
    `Bulk entries: ${stats.bulkTrees} trees`,
    `Orders: ${stats.assigned} assigned · ${stats.completed} completed · ${stats.pending} pending`,
    `CO2 absorption estimate: ${stats.co2KgYear} kg/year`,
    `On-time rate: ${ctx.metrics.on_time_rate}% · Survival rate: ${ctx.metrics.survival_rate}%`,
  ];
  summaryLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 5.5;
  });

  y += 6;
  doc.setDrawColor(...mint);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Plantation activity — ${label}`, margin, y);
  y += 7;

  if (monthRows.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...gray);
    doc.text('No plantation or bulk entries recorded for this month.', margin, y);
    y += 8;
  } else {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...green);
    doc.text('Date', margin, y);
    doc.text('Type', margin + 28, y);
    doc.text('Location', margin + 62, y);
    doc.text('Trees', pageW - margin - 12, y, { align: 'right' });
    y += 5;
    doc.setDrawColor(...mint);
    doc.line(margin, y, pageW - margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    const maxRows = 18;
    monthRows.slice(0, maxRows).forEach((row) => {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }
      doc.text(String(row.Date), margin, y);
      doc.text(String(row.Type).slice(0, 18), margin + 28, y);
      doc.text(String(row.Location).slice(0, 32), margin + 62, y);
      doc.text(String(row.Trees), pageW - margin - 12, y, { align: 'right' });
      y += 5;
    });
    if (monthRows.length > maxRows) {
      y += 2;
      doc.text(`… and ${monthRows.length - maxRows} more records (see CSV export for full list).`, margin, y);
      y += 6;
    }
  }

  y += 4;
  if (ctx.chartData.regional_breakdown.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...dark);
    doc.text('Regional breakdown (all submissions)', margin, y);
    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    ctx.chartData.regional_breakdown.slice(0, 8).forEach((r) => {
      doc.text(`${r.region}: ${r.count} trees`, margin, y);
      y += 5;
    });
  }

  const footerY = doc.internal.pageSize.getHeight() - 12;
  doc.setFontSize(8);
  doc.setTextColor(...gray);
  doc.text('ForestGift NGO Partner Report — confidential', margin, footerY);

  const fileBase = `ngo-monthly-${safeFilenamePart(ngoName(ctx.ngoData))}-${now.getFullYear()}-${String(month + 1).padStart(2, '0')}`;
  doc.save(`${fileBase}.pdf`);
}
