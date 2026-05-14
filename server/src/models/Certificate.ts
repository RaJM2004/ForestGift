import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  userId: string;
  userName: string;
  ngoId: string;
  ngoName: string;
  submissionId: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  verificationCode: string;
  issueDate: Date;
  emailSent: boolean;
}

const CertificateSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    ngoId: { type: String, required: true },
    ngoName: { type: String, required: true },
    submissionId: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    imageUrl: { type: String },
    verificationCode: { type: String, required: true, unique: true },
    issueDate: { type: Date, default: Date.now },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
