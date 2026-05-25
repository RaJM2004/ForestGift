import { jsPDF } from 'jspdf';
import type { CakeInvoice } from '../api/finance';

export type InvoicePdfVendor = {
  name: string;
  email?: string;
  phone?: string;
  area?: string;
  contact?: string;
};

export function downloadInvoicePdf(invoice: CakeInvoice, vendor: InvoicePdfVendor): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = margin;

  const pink: [number, number, number] = [236, 72, 153];
  const dark: [number, number, number] = [31, 41, 55];
  const gray: [number, number, number] = [107, 114, 128];

  doc.setFillColor(...pink);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ForestGift', margin, 14);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(vendor.name || 'Cake Partner', margin, 22);

  y = 38;
  doc.setTextColor(...dark);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', margin, y);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageW - margin, y, { align: 'right' });
  y += 6;
  doc.text(`Date: ${invoice.invoiceDate}`, pageW - margin, y, { align: 'right' });
  y += 6;
  doc.text(`Order ID: ${invoice.orderId}`, pageW - margin, y, { align: 'right' });

  y += 14;
  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  const customerLines = [
    invoice.customerName,
    invoice.customerPhone,
    invoice.customerAddress,
  ];
  customerLines.forEach((line) => {
    doc.text(line, margin, y);
    y += 5;
  });

  y += 6;
  doc.setFillColor(253, 242, 248);
  doc.rect(margin, y, pageW - margin * 2, 8, 'F');
  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold');
  doc.text('Cake details', margin + 2, y + 5.5);
  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  doc.text(`${invoice.cakeFlavor} — ${invoice.cakeSize}`, margin, y);
  y += 5;
  doc.text(`Trees planted: ${invoice.treeCount} | Delivery: ${invoice.deliveryDate}`, margin, y);

  y += 12;
  doc.setDrawColor(251, 207, 232);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...dark);
  doc.text('Description', margin, y);
  doc.text('Qty', pageW - margin - 55, y);
  doc.text('Rate', pageW - margin - 38, y);
  doc.text('Amount', pageW - margin, y, { align: 'right' });
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);

  invoice.lineItems.forEach((item) => {
    const desc = doc.splitTextToSize(item.description, pageW - margin * 2 - 50);
    doc.text(desc, margin, y);
    doc.text(String(item.quantity), pageW - margin - 55, y);
    doc.text(`₹${item.unitPrice}`, pageW - margin - 38, y);
    doc.text(`₹${item.amount}`, pageW - margin, y, { align: 'right' });
    y += Math.max(6, desc.length * 5);
  });

  y += 8;
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  const totals: [string, string][] = [
    ['Subtotal', `₹${invoice.subtotal}`],
    [`GST (${invoice.taxRate}%)`, `₹${invoice.taxAmount}`],
    ['Total', `₹${invoice.totalAmount}`],
  ];
  totals.forEach(([label, value], i) => {
    const isTotal = i === totals.length - 1;
    if (isTotal) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...pink);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...gray);
    }
    doc.text(label, pageW - margin - 45, y);
    doc.text(value, pageW - margin, y, { align: 'right' });
    y += 6;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...dark);
  doc.text(`Payment status: ${invoice.paymentStatus}`, margin, y);

  const footerY = doc.internal.pageSize.getHeight() - 22;
  doc.setDrawColor(...pink);
  doc.line(margin, footerY - 4, pageW - margin, footerY - 4);
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for partnering with ForestGift — Celebrating birthdays, planting trees.', margin, footerY);
  doc.text('Authorized signature: _________________________', margin, footerY + 8);
  if (vendor.email) doc.text(vendor.email, pageW - margin, footerY, { align: 'right' });
  if (vendor.phone) doc.text(vendor.phone, pageW - margin, footerY + 5, { align: 'right' });

  doc.save(`${invoice.invoiceNumber}.pdf`);
}

export function printInvoicePdf(invoice: CakeInvoice, vendor: InvoicePdfVendor): void {
  downloadInvoicePdf(invoice, vendor);
}
