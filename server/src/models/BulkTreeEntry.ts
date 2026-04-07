import mongoose, { Schema, Document } from 'mongoose';

export interface IBulkTreeEntry extends Document {
  ngoId: string;
  orderId?: string;
  userId?: string;
  lat: number;
  lng: number;
  location?: string;
  species?: string;
  count: number;
  note?: string;
  fileNames?: string[];
  images?: string[];
  favorite?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BulkTreeEntrySchema: Schema = new Schema(
  {
    ngoId: { type: String, required: true },
    orderId: { type: String },
    userId: { type: String },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    location: { type: String },
    species: { type: String },
    count: { type: Number, required: true },
    note: { type: String },
    fileNames: { type: [String], default: [] },
    images: { type: [String], default: [] },
    favorite: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IBulkTreeEntry>('BulkTreeEntry', BulkTreeEntrySchema);
