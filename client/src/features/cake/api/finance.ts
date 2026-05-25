const RAW_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:5000';
const API_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL}/api`;

export type WorkflowAction =
  | 'accept'
  | 'reject'
  | 'preparing'
  | 'out_for_delivery'
  | 'complete_delivery';

export type CakeInvoiceLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type CakeInvoice = {
  _id: string;
  invoiceNumber: string;
  vendorId: string;
  userId: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  cakeSize: string;
  cakeFlavor: string;
  treeCount: number;
  lineItems: CakeInvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  invoiceDate: string;
  deliveryDate: string;
};

export type CakeEarningRecord = {
  _id: string;
  vendorId: string;
  userId: string;
  orderId: string;
  customerName: string;
  cakeName: string;
  cakeSize: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  deliveryDate: string;
  deliveryStatus: string;
  deliveredAt: string;
};

export type VendorEarnings = {
  totalRevenue: number;
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  deliveredCount: number;
  topSellingCakes: { size: string; count: number }[];
  revenueTrend: { date: string; revenue: number }[];
  orderStats: {
    total: number;
    pending: number;
    preparing: number;
    outForDelivery: number;
    delivered: number;
    rejected: number;
  };
  records: CakeEarningRecord[];
  pricePerUnit: number;
};

type DateFilters = { start?: string; end?: string };

async function parseError(res: Response): Promise<string> {
  const body = await res.json().catch(() => ({}));
  return (body as { message?: string }).message || res.statusText || 'Request failed';
}

export async function postCakeDeliveryWorkflow(
  vendorId: string,
  userId: string,
  action: WorkflowAction,
  otp?: string,
) {
  const res = await fetch(`${API_URL}/cake/vendor/delivery/workflow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vendorId, userId, action, otp }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchCakeInvoices(vendorId: string): Promise<{ invoices: CakeInvoice[] }> {
  const res = await fetch(`${API_URL}/cake/vendor/${encodeURIComponent(vendorId)}/invoices`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function updateInvoicePayment(
  vendorId: string,
  invoiceId: string,
  paymentStatus: CakeInvoice['paymentStatus'],
): Promise<{ invoice: CakeInvoice }> {
  const res = await fetch(
    `${API_URL}/cake/vendor/${encodeURIComponent(vendorId)}/invoices/${encodeURIComponent(invoiceId)}/payment`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentStatus }),
    },
  );
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function fetchVendorEarnings(
  vendorId: string,
  filters?: DateFilters,
): Promise<VendorEarnings> {
  const params = new URLSearchParams();
  if (filters?.start) params.set('start', filters.start);
  if (filters?.end) params.set('end', filters.end);
  const q = params.toString() ? `?${params}` : '';
  const res = await fetch(`${API_URL}/cake/vendor/${encodeURIComponent(vendorId)}/earnings${q}`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
