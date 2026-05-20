import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  time: string;
  msg: string;
  type: 'token' | 'planted' | 'payment' | 'assign' | 'ngo' | 'report';
}

const ActivitySchema: Schema = new Schema({
  time: { type: String, required: true },
  msg: { type: String, required: true },
  type: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
