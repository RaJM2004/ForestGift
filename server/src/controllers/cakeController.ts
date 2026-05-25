import { Request, Response } from 'express';
import User from '../models/User';
import Vendor from '../models/Vendor';
import Activity from '../models/Activity';
import { mapUserToDelivery, isServerCakeStatus } from '../utils/cakeDeliveryMapper';

export type { ServerCakeStatus } from '../utils/cakeDeliveryMapper';
export {
  formatCakeDeliveryHomeLocation,
  mapServerStatusToClient,
  mapClientStatusToServer,
} from '../utils/cakeDeliveryMapper';

export const getCakeSummary = async (req: Request, res: Response) => {
  try {
    const vendorId = typeof req.query.vendorId === 'string' ? req.query.vendorId : undefined;
    const filter = vendorId ? { cakeVendor: vendorId } : {};
    const users = await User.find(filter);
    const totalRevenue = users.reduce((sum, u) => sum + u.amount, 0);
    const totalTrees = users.reduce((sum, u) => sum + u.trees, 0);
    res.json({ totalRevenue, totalTrees });
  } catch (error) {
    res.status(500).json({ message: 'Cake Data Error', error });
  }
};

export const getVendorDashboardData = async (req: Request, res: Response) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) {
      return res.status(400).json({ message: 'vendorId is required' });
    }

    const vendor = await Vendor.findOne({ id: vendorId });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const users = await User.find({ cakeVendor: vendorId }).sort({ updatedAt: -1 });
    const deliveries = users.map((u) => mapUserToDelivery(u));

    const delivered = users.filter((u) => u.cakeStatus === 'Delivered').length;
    const rejected = users.filter((u) => u.cakeStatus === 'Rejected').length;
    const total = users.length;
    const successRate = total > 0 ? Math.round((delivered / total) * 100) : 100;

    const totalRevenue = users.reduce((sum, u) => sum + u.amount, 0);
    const totalTrees = users.reduce((sum, u) => sum + u.trees, 0);

    const todayIso = new Date().toISOString().slice(0, 10);
    const activePipeline = users.filter(
      (u) =>
        u.cakeStatus === 'Accepted' ||
        u.cakeStatus === 'Preparing' ||
        u.cakeStatus === 'OutForDelivery' ||
        u.cakeStatus === 'Delivered',
    ).length;

    res.json({
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        contact: vendor.contact,
        phone: vendor.phone,
        area: vendor.area,
        costPerCake: vendor.costPerCake,
      },
      deliveries,
      summary: {
        totalRevenue,
        totalTrees,
        pendingCount: users.filter((u) => u.cakeStatus === 'Ordered').length,
        activePipelineCount: activePipeline,
        deliveredCount: delivered,
        rejectedCount: rejected,
        successRate,
        monthlyDeliveries: Math.max(delivered, users.filter((u) => u.cakeStatus !== 'Rejected').length),
        onTimeDeliveries: delivered,
        averageRating: 4.8,
        todayIso,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error loading vendor dashboard', error });
  }
};

export const updateVendorDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const { vendorId, userId, cakeStatus } = req.body;

    if (!vendorId || !userId || !isServerCakeStatus(cakeStatus)) {
      return res.status(400).json({ message: 'vendorId, userId, and valid cakeStatus are required' });
    }

    const vendor = await Vendor.findOne({ id: vendorId });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const user = await User.findOne({ id: userId, cakeVendor: vendorId });
    if (!user) {
      return res.status(404).json({ message: 'No delivery assignment found for this vendor' });
    }

    user.cakeStatus = cakeStatus;
    await user.save();

    await new Activity({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: `Cake delivery ${cakeStatus} for ${user.name} (${vendor.name})`,
      type: 'payment',
    }).save();

    res.json({ delivery: mapUserToDelivery(user) });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery status', error });
  }
};

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors', error });
  }
};

export const addVendor = async (req: Request, res: Response) => {
  try {
    const lastVendor = await Vendor.findOne().sort({ id: -1 });
    let nextIdNum = 1;
    if (lastVendor && lastVendor.id) {
      const match = lastVendor.id.match(/\d+/);
      if (match) nextIdNum = parseInt(match[0], 10) + 1;
    }

    const nextId = `VND${nextIdNum.toString().padStart(3, '0')}`;

    const newVendor = new Vendor({
      ...req.body,
      id: nextId,
    });

    await newVendor.save();

    await new Activity({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: `New Cake Vendor registered: ${newVendor.name} (${newVendor.area})`,
      type: 'ngo',
    }).save();

    res.status(201).json(newVendor);
  } catch (error) {
    console.error('Vendor Creation Error:', error);
    res.status(500).json({ message: 'Error creating vendor', error });
  }
};

export const updateCakeStatus = async (req: Request, res: Response) => {
  try {
    const { userId, status, vendorId } = req.body;

    if (!userId || !isServerCakeStatus(status)) {
      return res.status(400).json({ message: 'userId and a valid cake status are required' });
    }

    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (vendorId && user.cakeVendor !== vendorId) {
      return res.status(403).json({ message: 'Vendor does not own this assignment' });
    }

    user.cakeStatus = status;
    await user.save();

    await new Activity({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: `Cake marked as ${status} for citizen ${user.name}`,
      type: 'payment',
    }).save();

    res.json({ message: 'Cake status updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cake status', error });
  }
};
