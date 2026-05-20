import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminSetting extends Document {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  treeUnitPrice: number;
  maintenanceMode: boolean;
  updatedAt: Date;
}

const AdminSettingSchema: Schema = new Schema({
  platformName: { type: String, default: 'ForestGift Ecosystem' },
  supportEmail: { type: String, default: 'admin@forestgift.com' },
  supportPhone: { type: String, default: '+91-9876543210' },
  treeUnitPrice: { type: Number, default: 1000 },
  maintenanceMode: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IAdminSetting>('AdminSetting', AdminSettingSchema);
