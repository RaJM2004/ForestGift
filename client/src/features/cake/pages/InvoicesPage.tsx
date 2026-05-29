import { useCallback, useEffect, useState } from 'react';
import { FileText, Download, Printer, Mail, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Badge } from '../../../shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/components/ui/select';
import { CakePageHeader } from '../components/CakePageHeader';
import { CakeLoadingState, CakeErrorState } from '../components/LoadingState';
import { useCakeUser } from '../CakeUserContext';
import { useCakeData } from '../CakeDataContext';
import {
  fetchCakeInvoices,
  updateInvoicePayment,
  formatInr,
  type CakeInvoice,
} from '../api/finance';
import { downloadInvoicePdf } from '../utils/invoicePdf';
import { exportInvoicesToExcel } from '../utils/excelExport';

function paymentBadgeClass(status: CakeInvoice['paymentStatus']) {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-100 text-emerald-800';
    case 'Partial':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

export function InvoicesPage() {
  const { id: vendorId } = useCakeUser();
  const { vendor } = useCakeData();
  const [invoices, setInvoices] = useState<CakeInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = useCallback(async () => {
    if (!vendorId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCakeInvoices(vendorId);
      setInvoices(res.invoices);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.orderId.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const vendorInfo = {
    name: vendor?.name || 'ForestGift Partner',
    email: vendor?.email,
    phone: vendor?.phone,
    area: vendor?.area,
    contact: vendor?.contact,
  };

  const handleDownload = (inv: CakeInvoice) => {
    downloadInvoicePdf(inv, vendorInfo);
    toast.success('PDF downloaded');
  };

  const handlePrint = (inv: CakeInvoice) => {
    downloadInvoicePdf(inv, vendorInfo);
    toast.info('Open the downloaded PDF to print');
  };

  const handleEmailReady = (inv: CakeInvoice) => {
    const subject = encodeURIComponent(`Invoice ${inv.invoiceNumber} — ${vendorInfo.name}`);
    const body = encodeURIComponent(
      `Dear ${inv.customerName},\n\nPlease find your ForestGift cake order invoice.\n\nInvoice: ${inv.invoiceNumber}\nOrder: ${inv.orderId}\nTotal: ₹${inv.totalAmount}\nPayment status: ${inv.paymentStatus}\n\nThank you,\n${vendorInfo.name}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handlePaymentChange = async (inv: CakeInvoice, status: CakeInvoice['paymentStatus']) => {
    if (!vendorId) return;
    try {
      await updateInvoicePayment(vendorId, inv._id, status);
      toast.success('Payment status updated');
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Update failed');
    }
  };

  if (loading) return <CakeLoadingState rows={3} />;
  if (error) return <CakeErrorState message={error} onRetry={() => void load()} />;

  return (
    <div className="space-y-8 text-[#1F2937]">
      <CakePageHeader
        title="Invoices"
        description="PDF invoices are created automatically for each cake order."
        icon={FileText}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="border-[#FBCFE8]"
            onClick={() => {
              exportInvoicesToExcel(filtered);
              toast.success('Invoices exported to Excel');
            }}
          >
            <Download className="w-4 h-4 mr-1" />
            Export Excel
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search invoice, customer, order…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-[#FBCFE8]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] border-[#FBCFE8]">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Partial">Partial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
            No invoices yet. Invoices are generated when orders are assigned and updated on status changes.
          </div>
        ) : (
          filtered.map((inv) => (
            <article
              key={inv._id}
              className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{inv.invoiceNumber}</h3>
                    <Badge className={paymentBadgeClass(inv.paymentStatus)}>{inv.paymentStatus}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {inv.customerName} · {inv.orderId} · {inv.invoiceDate}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {inv.cakeFlavor} — {inv.cakeSize} · Delivery {inv.deliveryDate}
                  </p>
                  <p className="text-xl font-bold text-[#EC4899] mt-2">{formatInr(inv.totalAmount)}</p>
                  <p className="text-xs text-gray-400">
                    Subtotal {formatInr(inv.subtotal)} + GST ({inv.taxRate}%) {formatInr(inv.taxAmount)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select
                    value={inv.paymentStatus}
                    onValueChange={(v) =>
                      void handlePaymentChange(inv, v as CakeInvoice['paymentStatus'])
                    }
                  >
                    <SelectTrigger className="w-[120px] h-9 text-xs border-[#FBCFE8]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#FBCFE8]"
                    onClick={() => handleDownload(inv)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#FBCFE8]"
                    onClick={() => handlePrint(inv)}
                  >
                    <Printer className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#FBCFE8]"
                    onClick={() => handleEmailReady(inv)}
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
