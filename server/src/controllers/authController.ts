import { Request, Response } from 'express';
import User from '../models/User';
import NGO from '../models/NGO';
import Vendor from '../models/Vendor';

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Admin login logic
    const ADMIN_EMAIL = 'admin@forestgift.com'; // Updated branding
    if (email === ADMIN_EMAIL) {
      return res.json({
        role: 'admin',
        user: { email: ADMIN_EMAIL, name: 'Administrator' }
      });
    }

    // Check User
    const user = await User.findOne({ email });
    if (user) {
      return res.json({
        role: 'user',
        user: user
      });
    }

    // Check NGO
    const ngo = await NGO.findOne({ email });
    if (ngo) {
      return res.json({
        role: 'ngo',
        user: ngo
      });
    }

    // Check Cake (Vendor)
    const vendor = await Vendor.findOne({ email });
    if (vendor) {
      const v = vendor.toObject({ virtuals: false });
      return res.json({
        role: 'cake',
        user: {
          id: v.id,
          name: v.name,
          email: v.email,
          contact: v.contact,
          phone: v.phone,
          area: v.area,
          costPerCake: v.costPerCake,
        },
      });
    }

    return res.status(404).json({ message: 'Email not found. Please contact Admin.' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
