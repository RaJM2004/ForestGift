import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  userId: string;
  trees: number;
  status: 'Growing' | 'Planted' | 'Verified';
  progress: number;
  date: string;
  location: string;
  amount: string;
  species: string;
}

const OrderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  trees: { type: Number, required: true },
  status: { type: String, enum: ['Growing', 'Planted', 'Verified'], default: 'Growing' },
  progress: { type: Number, default: 0 },
  date: { type: String, required: true },
  location: { type: String, required: true },
  amount: { type: String, required: true },
  species: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
