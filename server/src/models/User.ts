import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  dob: string;
  address: string;
  phone: string;
  email: string;
  token: string;
  amount: number;
  trees: number;
  status: 'Planted' | 'Pending' | 'Initial' | 'Not Assigned';
  ngo: string;
  location: string;
  date: string;
  cakeStatus?:
    | 'Ordered'
    | 'Accepted'
    | 'Preparing'
    | 'OutForDelivery'
    | 'Delivered'
    | 'Rejected';
  cakeVendor?: string;
  cakeDeliveryOtp?: string;
  cakeOtpExpiresAt?: Date;
  cakeDeliveredAt?: Date;
  password?: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  impactPoints: number;
  globalRank: number;
  welcomeEmailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  token: { type: String, required: true },
  amount: { type: Number, required: true },
  trees: { type: Number, required: true },
  status: { type: String, enum: ['Planted', 'Pending', 'Initial', 'Not Assigned'], default: 'Initial' },
  ngo: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  cakeStatus: {
    type: String,
    enum: ['Ordered', 'Accepted', 'Preparing', 'OutForDelivery', 'Delivered', 'Rejected'],
    default: 'Ordered',
  },
  cakeVendor: { type: String, default: 'Unassigned' },
  cakeDeliveryOtp: { type: String },
  cakeOtpExpiresAt: { type: Date },
  cakeDeliveredAt: { type: Date },
  password: { type: String, default: 'forestgift123' },
  referralCode: { type: String, unique: true },
  referredBy: { type: String },
  referralCount: { type: Number, default: 0 },
  impactPoints: { type: Number, default: 0 },
  globalRank: { type: Number, default: 0 },
  welcomeEmailSent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
