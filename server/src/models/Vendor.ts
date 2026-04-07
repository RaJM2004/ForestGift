import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  id: string;
  name: string;
  email: string;
  contact: string;
  phone: string;
  area: string;
  costPerCake: number;
}

const VendorSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  phone: { type: String, required: true },
  area: { type: String, required: true },
  costPerCake: { type: Number, default: 500 },
}, { timestamps: true });

export default mongoose.model<IVendor>('Vendor', VendorSchema);

