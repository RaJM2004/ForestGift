import mongoose, { Schema, Document } from 'mongoose';

export interface INGO extends Document {
  id: string;
  name: string;
  reg: string;
  contact: string;
  phone: string;
  email: string;
  area: string;
  assigned: number;
  completed: number;
  pending: number;
  rating: number;
}

const NGOSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  reg: { type: String, required: true },
  contact: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  area: { type: String, required: true },
  assigned: { type: Number, default: 0 },
  completed: { type: Number, default: 0 },
  pending: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<INGO>('NGO', NGOSchema);
