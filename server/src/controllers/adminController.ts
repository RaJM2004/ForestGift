import { Request, Response } from 'express';
import User from '../models/User';
import NGO from '../models/NGO';
import Activity from '../models/Activity';
import Vendor from '../models/Vendor';
import AdminSetting from '../models/AdminSetting';
import { sendWelcomeEmail } from '../services/emailService';

export const getAdminOverview = async (req: Request, res: Response) => {
  try {
    const [users, ngos, activities] = await Promise.all([
      User.find(),
      NGO.find(),
      Activity.find().sort({ createdAt: -1 }).limit(10)
    ]);
    console.log(`Feteched ${users.length} users and ${ngos.length} NGOs`);
    res.json({ users, ngos, activities });
  } catch (error) {
    res.status(500).json({ message: "Admin Data Error", error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const lastUser = await User.findOne().sort({ id: -1 });
    let nextIdNum = 1;
    if (lastUser && lastUser.id) {
      const match = lastUser.id.match(/\d+/);
      if (match) nextIdNum = parseInt(match[0]) + 1;
    }
    
    const nextId = `USR${nextIdNum.toString().padStart(3, '0')}`;
    const year = new Date().getFullYear();
    const token = `TKN-${year}-${nextIdNum.toString().padStart(4, '0')}`;
    const referralCode = `FOREST-${req.body.name.split(' ')[0].toUpperCase()}-${nextIdNum.toString().padStart(3, '0')}`;
    const referredByCode = req.body.referredBy;

    const location = req.body.location as string | undefined;
    let cakeVendor = req.body.cakeVendor as string | undefined;
    if (!cakeVendor || cakeVendor === 'Unassigned') {
      const vendorDoc = location ? await Vendor.findOne({ area: location }) : null;
      cakeVendor = vendorDoc?.id ?? 'Unassigned';
    }
    const cakeStatus = req.body.cakeStatus ?? 'Ordered';

    const newUser = new User({
      ...req.body,
      id: nextId,
      token: token,
      referralCode: referralCode,
      referredBy: null,
      ngo: 'Not Assigned', // Strictly unassigned upon registration
      status: 'Initial',   // Awaiting Admin assignment
      date: new Date().toISOString().split('T')[0],
      cakeVendor,
      cakeStatus,
    });

    // Handle referral attribution if provided
    if (referredByCode) {
      const referrer = await User.findOne({ referralCode: referredByCode });
      if (referrer) {
        newUser.referredBy = referrer.id;
        referrer.referralCount += 1;
        referrer.impactPoints += 50; // Points for a direct referral
        await referrer.save();
      }
    }

    await newUser.save();

    // Trigger Welcome Email
    console.log(`[EMAIL] Attempting to send welcome email to: ${newUser.email}`);
    const emailResult = await sendWelcomeEmail(newUser.email, newUser.name, newUser.token);
    if (emailResult.success) {
      console.log(`[EMAIL] Welcome email sent successfully to: ${newUser.email}`);
      newUser.welcomeEmailSent = true;
      await newUser.save();
    } else {
      console.error(`[EMAIL] Failed to send welcome email to: ${newUser.email}. Error:`, emailResult.error);
    }

    // Log the activity
    await new Activity({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: `New Citizen registered: ${newUser.name} (${token})`,
      type: 'token'
    }).save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const assignNGO = async (req: Request, res: Response) => {
  try {
    const { userId, ngoId } = req.body;
    
    const user = await User.findOne({ id: userId });
    const ngo = await NGO.findOne({ id: ngoId });

    if (!user || !ngo) {
      return res.status(404).json({ message: "User or NGO not found" });
    }

    user.ngo = ngo.name;
    user.status = 'Pending';
    await user.save();

    ngo.assigned += user.trees;
    ngo.pending += user.trees;
    await ngo.save();

    await new Activity({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: `Assigned ${user.trees} trees from ${user.name} to ${ngo.name}`,
      type: 'assign'
    }).save();

    res.json({ message: "Assignment successful", user, ngo });
  } catch (error) {
    res.status(500).json({ message: "Error assigning NGO", error });
  }
};

export const createNGO = async (req: Request, res: Response) => {
  try {
    const lastNGO = await NGO.findOne().sort({ id: -1 });
    let nextIdNum = 1;
    if (lastNGO && lastNGO.id) {
      const match = lastNGO.id.match(/\d+/);
      if (match) nextIdNum = parseInt(match[0]) + 1;
    }
    
    const nextId = `NGO${nextIdNum.toString().padStart(3, '0')}`;

    const newNGO = new NGO({
      ...req.body,
      id: nextId,
      assigned: 0,
      completed: 0,
      pending: 0,
      rating: 5.0 // Default rating for new NGOs
    });

    await newNGO.save();

    // Log the activity
    await new Activity({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: `New NGO Partner registered: ${newNGO.name} (${newNGO.area})`,
      type: 'ngo'
    }).save();

    res.status(201).json(newNGO);
  } catch (error) {
    console.error("NGO Creation Error:", error);
    res.status(500).json({ message: "Error creating NGO", error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await User.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (error) { res.status(500).json({ message: "Error deleting user", error }); }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updated = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ message: "Error updating user", error }); }
};

export const resendWelcomeEmailController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    console.log(`[RETRY] Manual refresh for user: ${userId}`);
    
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(404).json({ message: `User ${userId} not found in nodes.` });

    const emailResult = await sendWelcomeEmail(user.email, user.name, user.token);
    
    if (emailResult.success) {
      user.welcomeEmailSent = true;
      await user.save();
      return res.json({ message: "Credential packet transmitted successfully." });
    } else {
      const errorDetail = emailResult.error;
      console.error(`[RETRY] Transmission Failure for ${user.email}:`, errorDetail);
      return res.status(500).json({ 
        message: "Network transmission failed", 
        error: errorDetail,
        suggestion: "Ensure recipient is an authorized developer or verify your domain in Resend dashboard."
      });
    }
  } catch (error: any) {
    console.error("[RETRY] Internal Engine Exception:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteNGO = async (req: Request, res: Response) => {
  try {
    await NGO.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'NGO deleted' });
  } catch (error) { res.status(500).json({ message: "Error deleting NGO", error }); }
};

export const updateNGOProfile = async (req: Request, res: Response) => {
  try {
    const updated = await NGO.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ message: "Error updating NGO", error }); }
};

export const deleteVendor = async (req: Request, res: Response) => {
  try {
    await Vendor.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Vendor deleted' });
  } catch (error) { res.status(500).json({ message: "Error deleting vendor", error }); }
};

export const updateVendor = async (req: Request, res: Response) => {
  try {
    const updated = await Vendor.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ message: "Error updating vendor", error }); }
};

export const getSettings = async (req: Request, res: Response) => {
  try {
    let config = await AdminSetting.findOne();
    if (!config) {
      config = await new AdminSetting().save();
    }
    res.json(config);
  } catch (error) { res.status(500).json({ message: "Error fetching settings", error }); }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    let config = await AdminSetting.findOne();
    if (!config) {
      config = new AdminSetting(req.body);
      await config.save();
    } else {
      config = await AdminSetting.findOneAndUpdate({}, req.body, { new: true });
    }
    res.json(config);
  } catch (error) { res.status(500).json({ message: "Error updating settings", error }); }
};
