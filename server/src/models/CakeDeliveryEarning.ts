import mongoose, { Schema, Document } from 'mongoose';

export interface ICakeDeliveryEarning extends Document {
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
  deliveredAt: Date;
}

const CakeDeliveryEarningSchema: Schema = new Schema(
  {
    vendorId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    cakeName: { type: String, required: true },
    cakeSize: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    pricePerUnit: { type: Number, required: true, default: 220 },
    totalPrice: { type: Number, required: true },
    deliveryDate: { type: String, required: true },
    deliveryStatus: { type: String, default: 'Delivered' },
    deliveredAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ICakeDeliveryEarning>('CakeDeliveryEarning', CakeDeliveryEarningSchema);
