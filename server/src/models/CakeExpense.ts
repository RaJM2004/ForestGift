import mongoose, { Schema, Document } from 'mongoose';

export const CAKE_EXPENSE_CATEGORIES = [
  'Ingredients',
  'Packaging',
  'Delivery',
  'Employee Salary',
  'Equipment',
  'Miscellaneous',
] as const;

export type CakeExpenseCategory = (typeof CAKE_EXPENSE_CATEGORIES)[number];

export interface ICakeExpense extends Document {
  vendorId: string;
  title: string;
  amount: number;
  category: CakeExpenseCategory;
  date: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CakeExpenseSchema: Schema = new Schema(
  {
    vendorId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: CAKE_EXPENSE_CATEGORIES,
      required: true,
    },
    date: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.model<ICakeExpense>('CakeExpense', CakeExpenseSchema);
