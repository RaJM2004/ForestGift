import { Request, Response } from 'express';
import User from '../models/User';
import Vendor from '../models/Vendor';
import Activity from '../models/Activity';

export const getCakeSummary = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    const totalRevenue = users.reduce((sum, u) => sum + u.amount, 0);
    const totalTrees = users.reduce((sum, u) => sum + u.trees, 0);
    res.json({ totalRevenue, totalTrees });
  } catch (error) {
    res.status(500).json({ message: "Cake Data Error", error });
  }
};

export const getAllVendors = async (req: Request, res: Response) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendors", error });
  }
};

export const addVendor = async (req: Request, res: Response) => {
  try {
    const lastVendor = await Vendor.findOne().sort({ id: -1 });
    let nextIdNum = 1;
    if (lastVendor && lastVendor.id) {
      const match = lastVendor.id.match(/\d+/);
      if (match) nextIdNum = parseInt(match[0]) + 1;
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
      type: 'ngo' // Use ngo icon/type for vendor for now
    }).save();

    res.status(201).json(newVendor);
  } catch (error) {
    console.error("Vendor Creation Error:", error);
    res.status(500).json({ message: "Error creating vendor", error });
  }
};

export const updateCakeStatus = async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.body;
    const user = await User.findOne({ id: userId });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cakeStatus = status;
    await user.save();

    await new Activity({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: `Cake marked as ${status} for citizen ${user.name}`,
      type: 'payment' // use payment/check type
    }).save();

    res.json({ message: "Cake status updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating cake status", error });
  }
};
