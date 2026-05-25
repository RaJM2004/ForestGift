import { Request, Response } from 'express';
import User from '../models/User';
import Vendor from '../models/Vendor';
import CakeExpense, { CAKE_EXPENSE_CATEGORIES, CakeExpenseCategory } from '../models/CakeExpense';
import CakeDeliveryEarning from '../models/CakeDeliveryEarning';
import CakeInvoice, { CakeInvoicePaymentStatus } from '../models/CakeInvoice';
import { mapUserToDelivery, formatCakeDeliveryHomeLocation } from '../utils/cakeDeliveryMapper';
import { CAKE_UNIT_PRICE_RS, normalizeEarningAmounts } from '../utils/cakePricing';

const GST_RATE = 18;

function paramId(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

function isValidCategory(c: string): c is CakeExpenseCategory {
  return (CAKE_EXPENSE_CATEGORIES as readonly string[]).includes(c);
}

function parseDateRange(start?: string, end?: string) {
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;
  if (endDate) endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
}

function inRange(isoDate: string, startDate: Date | null, endDate: Date | null): boolean {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return false;
  if (startDate && d < startDate) return false;
  if (endDate && d > endDate) return false;
  return true;
}

async function nextInvoiceNumber(vendorId: string): Promise<string> {
  const count = await CakeInvoice.countDocuments({ vendorId });
  return `INV-${vendorId}-${String(count + 1).padStart(5, '0')}`;
}

function paymentStatusFromCakeStatus(cakeStatus?: string): CakeInvoicePaymentStatus {
  if (cakeStatus === 'Delivered') return 'Paid';
  if (cakeStatus === 'Accepted' || cakeStatus === 'OutForDelivery') return 'Partial';
  return 'Pending';
}

export async function buildInvoiceForUser(
  vendorId: string,
  userId: string,
  forceNew = false,
): Promise<InstanceType<typeof CakeInvoice> | null> {
  const vendor = await Vendor.findOne({ id: vendorId });
  const user = await User.findOne({ id: userId, cakeVendor: vendorId });
  if (!vendor || !user) return null;

  const unitPrice = CAKE_UNIT_PRICE_RS;
  const quantity = 1;
  const delivery = mapUserToDelivery(user);
  const subtotal = unitPrice * quantity;
  const taxAmount = Math.round((subtotal * GST_RATE) / 100);
  const totalAmount = subtotal + taxAmount;
  const today = new Date().toISOString().slice(0, 10);
  const paymentStatus = paymentStatusFromCakeStatus(user.cakeStatus);

  const lineItems = [
    {
      description: `${delivery.cakeFlavor} — ${delivery.cakeSize} (1 unit)`,
      quantity,
      unitPrice,
      amount: subtotal,
    },
  ];

  const existing = await CakeInvoice.findOne({ vendorId, userId });
  if (existing) {
    existing.orderId = delivery.orderId;
    existing.customerName = user.name;
    existing.customerPhone = user.phone;
    existing.customerAddress = formatCakeDeliveryHomeLocation(user.address, user.location);
    existing.cakeSize = delivery.cakeSize;
    existing.cakeFlavor = delivery.cakeFlavor;
    existing.treeCount = delivery.treeCount;
    existing.lineItems = lineItems;
    existing.subtotal = subtotal;
    existing.taxAmount = taxAmount;
    existing.totalAmount = totalAmount;
    existing.paymentStatus = paymentStatus;
    existing.deliveryDate = delivery.deliveryDate;
    if (forceNew) existing.invoiceDate = today;
    await existing.save();
    return existing;
  }

  const invoiceNumber = await nextInvoiceNumber(vendorId);
  const doc = new CakeInvoice({
    invoiceNumber,
    vendorId,
    userId: user.id,
    orderId: delivery.orderId,
    customerName: user.name,
    customerPhone: user.phone,
    customerAddress: formatCakeDeliveryHomeLocation(user.address, user.location),
    cakeSize: delivery.cakeSize,
    cakeFlavor: delivery.cakeFlavor,
    treeCount: delivery.treeCount,
    lineItems,
    subtotal,
    taxRate: GST_RATE,
    taxAmount,
    totalAmount,
    paymentStatus,
    invoiceDate: today,
    deliveryDate: delivery.deliveryDate,
  });

  await doc.save();
  return doc;
}

export async function ensureInvoicesForVendor(vendorId: string): Promise<void> {
  const users = await User.find({
    cakeVendor: vendorId,
    cakeStatus: { $nin: ['Rejected'] },
  });
  for (const u of users) {
    await buildInvoiceForUser(vendorId, u.id);
  }
}

// ——— Expenses ———

export const listVendorExpenses = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const { start, end, category } = req.query;
    const { startDate, endDate } = parseDateRange(
      typeof start === 'string' ? start : undefined,
      typeof end === 'string' ? end : undefined,
    );

    let expenses = await CakeExpense.find({ vendorId }).sort({ date: -1, createdAt: -1 });

    if (typeof category === 'string' && category && category !== 'all') {
      expenses = expenses.filter((e) => e.category === category);
    }
    if (startDate || endDate) {
      expenses = expenses.filter((e) => inRange(e.date, startDate, endDate));
    }

    res.json({ expenses });
  } catch (error) {
    res.status(500).json({ message: 'Error loading expenses', error });
  }
};

export const createVendorExpense = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const { title, amount, category, date, notes } = req.body;

    if (!title || amount == null || !category || !date) {
      return res.status(400).json({ message: 'title, amount, category, and date are required' });
    }
    if (!isValidCategory(category)) {
      return res.status(400).json({ message: 'Invalid expense category' });
    }
    if (Number(amount) < 0) {
      return res.status(400).json({ message: 'Amount must be non-negative' });
    }

    const vendor = await Vendor.findOne({ id: vendorId });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const expense = await CakeExpense.create({
      vendorId,
      title: String(title).trim(),
      amount: Number(amount),
      category,
      date: String(date).slice(0, 10),
      notes: notes ? String(notes) : '',
    });

    res.status(201).json({ expense });
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense', error });
  }
};

export const updateVendorExpense = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const expenseId = paramId(req.params.expenseId);
    const { title, amount, category, date, notes } = req.body;

    const expense = await CakeExpense.findOne({ _id: expenseId, vendorId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (title != null) expense.title = String(title).trim();
    if (amount != null) {
      if (Number(amount) < 0) return res.status(400).json({ message: 'Amount must be non-negative' });
      expense.amount = Number(amount);
    }
    if (category != null) {
      if (!isValidCategory(category)) return res.status(400).json({ message: 'Invalid category' });
      expense.category = category;
    }
    if (date != null) expense.date = String(date).slice(0, 10);
    if (notes != null) expense.notes = String(notes);

    await expense.save();
    res.json({ expense });
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
  }
};

export const deleteVendorExpense = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const expenseId = paramId(req.params.expenseId);
    const result = await CakeExpense.deleteOne({ _id: expenseId, vendorId });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error });
  }
};

export const getExpenseAnalytics = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const { start, end } = req.query;
    const { startDate, endDate } = parseDateRange(
      typeof start === 'string' ? start : undefined,
      typeof end === 'string' ? end : undefined,
    );

    let expenses = await CakeExpense.find({ vendorId });
    if (startDate || endDate) {
      expenses = expenses.filter((e) => inRange(e.date, startDate, endDate));
    }

    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const byCategory = CAKE_EXPENSE_CATEGORIES.map((cat) => ({
      category: cat,
      amount: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
    })).filter((x) => x.amount > 0);

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const daily = expenses
      .filter((e) => e.date === today)
      .reduce((s, e) => s + e.amount, 0);
    const weekly = expenses
      .filter((e) => inRange(e.date, weekAgo, now))
      .reduce((s, e) => s + e.amount, 0);
    const monthly = expenses
      .filter((e) => inRange(e.date, monthAgo, now))
      .reduce((s, e) => s + e.amount, 0);

    const trendMap = new Map<string, number>();
    expenses.forEach((e) => {
      trendMap.set(e.date, (trendMap.get(e.date) || 0) + e.amount);
    });
    const trend = [...trendMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, amount }));

    res.json({
      totalExpenses,
      daily,
      weekly,
      monthly,
      byCategory,
      trend,
      count: expenses.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error loading expense analytics', error });
  }
};

// ——— Invoices ———

export const listVendorInvoices = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const invoices = await CakeInvoice.find({ vendorId }).sort({ createdAt: -1 });
    res.json({ invoices });
  } catch (error) {
    res.status(500).json({ message: 'Error loading invoices', error });
  }
};

export const getVendorInvoice = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const invoiceId = paramId(req.params.invoiceId);
    const invoice = await CakeInvoice.findOne({ _id: invoiceId, vendorId });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ invoice });
  } catch (error) {
    res.status(500).json({ message: 'Error loading invoice', error });
  }
};

export const generateVendorInvoice = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const userId = paramId(req.params.userId);
    const invoice = await buildInvoiceForUser(vendorId, userId, true);
    if (!invoice) return res.status(404).json({ message: 'Order not found for vendor' });
    res.status(201).json({ invoice });
  } catch (error) {
    res.status(500).json({ message: 'Error generating invoice', error });
  }
};

export const updateInvoicePaymentStatus = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const invoiceId = paramId(req.params.invoiceId);
    const { paymentStatus } = req.body;
    if (!['Paid', 'Pending', 'Partial'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }
    const invoice = await CakeInvoice.findOneAndUpdate(
      { _id: invoiceId, vendorId },
      { paymentStatus },
      { new: true },
    );
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ invoice });
  } catch (error) {
    res.status(500).json({ message: 'Error updating invoice', error });
  }
};

// ——— Earnings / financial overview ———

export const getVendorEarnings = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const { start, end } = req.query;
    const { startDate, endDate } = parseDateRange(
      typeof start === 'string' ? start : undefined,
      typeof end === 'string' ? end : undefined,
    );

    const vendor = await Vendor.findOne({ id: vendorId });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    let records = await CakeDeliveryEarning.find({ vendorId }).sort({ deliveredAt: -1 });
    if (startDate || endDate) {
      records = records.filter((r) => inRange(r.deliveryDate, startDate, endDate));
    }

    const normalizedRecords = records.map((r) =>
      normalizeEarningAmounts(r.toObject() as unknown as Record<string, unknown>),
    );

    const sumTotal = (list: typeof normalizedRecords) =>
      list.reduce((s, r) => s + r.totalPrice, 0);

    const totalRevenue = sumTotal(normalizedRecords);
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const dailyRevenue = sumTotal(
      normalizedRecords.filter((r) => r.deliveryDate === today),
    );
    const weeklyRevenue = sumTotal(
      normalizedRecords.filter((r) => inRange(String(r.deliveryDate), weekAgo, now)),
    );
    const monthlyRevenue = sumTotal(
      normalizedRecords.filter((r) => inRange(String(r.deliveryDate), monthAgo, now)),
    );

    const sizeCounts = new Map<string, number>();
    normalizedRecords.forEach((r) => {
      sizeCounts.set(String(r.cakeSize), (sizeCounts.get(String(r.cakeSize)) || 0) + 1);
    });
    const topSellingCakes = [...sizeCounts.entries()]
      .map(([size, count]) => ({ size, count }))
      .sort((a, b) => b.count - a.count);

    const revenueTrendMap = new Map<string, number>();
    normalizedRecords.forEach((r) => {
      const d = String(r.deliveryDate);
      revenueTrendMap.set(d, (revenueTrendMap.get(d) || 0) + r.totalPrice);
    });
    const revenueTrend = [...revenueTrendMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date, revenue }));

    const users = await User.find({ cakeVendor: vendorId });
    const orderStats = {
      total: users.length,
      pending: users.filter((u) => u.cakeStatus === 'Ordered').length,
      preparing: users.filter((u) =>
        ['Preparing', 'Accepted'].includes(u.cakeStatus || ''),
      ).length,
      outForDelivery: users.filter((u) => u.cakeStatus === 'OutForDelivery').length,
      delivered: normalizedRecords.length,
      rejected: users.filter((u) => u.cakeStatus === 'Rejected').length,
    };

    // Persist corrected ₹220 totals for legacy rows (old vendor costPerCake ≈ ₹550)
    void Promise.all(
      records.map((r, i) => {
        const n = normalizedRecords[i];
        if (r.totalPrice === n.totalPrice && r.pricePerUnit === n.pricePerUnit) return null;
        return CakeDeliveryEarning.updateOne(
          { _id: r._id },
          { $set: { quantity: n.quantity, pricePerUnit: n.pricePerUnit, totalPrice: n.totalPrice } },
        );
      }),
    );

    res.json({
      totalRevenue,
      dailyRevenue,
      weeklyRevenue,
      monthlyRevenue,
      deliveredCount: records.length,
      topSellingCakes,
      revenueTrend,
      orderStats,
      records: normalizedRecords,
      pricePerUnit: CAKE_UNIT_PRICE_RS,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error loading earnings', error });
  }
};

export const listVendorEarnings = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const rows = await CakeDeliveryEarning.find({ vendorId }).sort({ deliveredAt: -1 });
    const records = rows.map((r) =>
      normalizeEarningAmounts(r.toObject() as unknown as Record<string, unknown>),
    );
    res.json({ records });
  } catch (error) {
    res.status(500).json({ message: 'Error loading earning records', error });
  }
};

export const getVendorFinanceOverview = async (req: Request, res: Response) => {
  try {
    const vendorId = paramId(req.params.vendorId);
    const [expenseAnalyticsRes, earnings] = await Promise.all([
      CakeExpense.find({ vendorId }),
      (async () => {
        const vendor = await Vendor.findOne({ id: vendorId });
        if (!vendor) return null;
        const users = await User.find({ cakeVendor: vendorId, cakeStatus: { $ne: 'Rejected' } });
        const costPerCake = vendor.costPerCake || 500;
        const revenue = users.reduce((s, u) => s + (u.amount || costPerCake), 0);
        return revenue;
      })(),
    ]);

    if (earnings === null) return res.status(404).json({ message: 'Vendor not found' });

    const totalExpenses = expenseAnalyticsRes.reduce((s, e) => s + e.amount, 0);
    const profit = earnings - totalExpenses;

    res.json({
      totalRevenue: earnings,
      totalExpenses,
      netProfit: profit,
      expenseCount: expenseAnalyticsRes.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error loading finance overview', error });
  }
};
