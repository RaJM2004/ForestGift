import mongoose, { Schema, Document } from 'mongoose';

export type CakeInvoicePaymentStatus = 'Paid' | 'Pending' | 'Partial';

export interface ICakeInvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface ICakeInvoice extends Document {
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
  lineItems: ICakeInvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: CakeInvoicePaymentStatus;
  invoiceDate: string;
  deliveryDate: string;
  createdAt: Date;
  updatedAt: Date;
}

const LineItemSchema = new Schema(
  {
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const CakeInvoiceSchema: Schema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    vendorId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    orderId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, required: true },
    cakeSize: { type: String, required: true },
    cakeFlavor: { type: String, required: true },
    treeCount: { type: Number, required: true },
    lineItems: { type: [LineItemSchema], required: true },
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 18 },
    taxAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial'],
      default: 'Pending',
    },
    invoiceDate: { type: String, required: true },
    deliveryDate: { type: String, required: true },
  },
  { timestamps: true },
);

CakeInvoiceSchema.index({ vendorId: 1, userId: 1 }, { unique: true });

export default mongoose.model<ICakeInvoice>('CakeInvoice', CakeInvoiceSchema);
