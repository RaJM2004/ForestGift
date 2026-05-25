import * as XLSX from 'xlsx';
import type { CakeEarningRecord, CakeInvoice } from '../api/finance';
import type { DeliveryRequest } from '../types/delivery';

function downloadWorkbook(wb: XLSX.WorkBook, filename: string): void {
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

export function exportEarningsRecordsToExcel(records: CakeEarningRecord[], prefix = 'earnings'): void {
  const rows = records.map((r) => ({
    'Order ID': r.orderId,
    Customer: r.customerName,
    'Cake Name': r.cakeName,
    'Cake Size': r.cakeSize,
    Quantity: r.quantity,
    'Price Per Unit (₹)': r.pricePerUnit,
    'Total Price': r.totalPrice,
    'Delivery Date': r.deliveryDate,
    'Delivery Status': r.deliveryStatus,
    'Delivered At': new Date(r.deliveredAt).toISOString(),
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Earnings');
  downloadWorkbook(wb, `${prefix}-${new Date().toISOString().slice(0, 10)}`);
}

export function exportInvoicesToExcel(invoices: CakeInvoice[], prefix = 'invoices'): void {
  const rows = invoices.map((i) => ({
    'Invoice #': i.invoiceNumber,
    Date: i.invoiceDate,
    'Order ID': i.orderId,
    Customer: i.customerName,
    'Cake Size': i.cakeSize,
    Total: i.totalAmount,
    'Payment Status': i.paymentStatus,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
  downloadWorkbook(wb, `${prefix}-${new Date().toISOString().slice(0, 10)}`);
}

export function exportOrderHistoryToExcel(deliveries: DeliveryRequest[], prefix = 'orders'): void {
  const rows = deliveries.map((d) => ({
    'Order ID': d.orderId,
    Customer: d.recipientName,
    Phone: d.phoneNumber,
    'Delivery Date': d.deliveryDate,
    Location: d.location,
    'Cake Size': d.cakeSize,
    Flavor: d.cakeFlavor,
    Status: d.status,
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  downloadWorkbook(wb, `${prefix}-${new Date().toISOString().slice(0, 10)}`);
}
