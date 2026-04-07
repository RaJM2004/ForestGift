import { Request, Response } from 'express';
import User from '../models/User';
import NGO from '../models/NGO';
import Activity from '../models/Activity';

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

    const newUser = new User({
      ...req.body,
      id: nextId,
      token: token,
      referralCode: referralCode,
      referredBy: null,
      ngo: 'Not Assigned', // Strictly unassigned upon registration
      status: 'Initial',   // Awaiting Admin assignment
      date: new Date().toISOString().split('T')[0]
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
