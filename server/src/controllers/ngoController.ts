import { Request, Response } from 'express';
import NGO from '../models/NGO';

export const getNgoProfile = async (req: Request, res: Response) => {
  try {
    const ngo = await NGO.findOne({ id: req.params.id || "NGO001" });
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: "NGO Data Error", error });
  }
};

export const updateNgo = async (req: Request, res: Response) => {
  try {
    const ngo = await NGO.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: "NGO Update Error", error });
  }
};
