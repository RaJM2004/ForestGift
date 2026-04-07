import { Request, Response } from 'express';
import BulkTreeEntry from '../models/BulkTreeEntry';

export const createBulkTreeEntry = async (req: Request, res: Response) => {
  try {
    const { ngoId, orderId, userId, lat, lng, location, count, note, fileNames, images } = req.body;

    if (!ngoId || lat == null || lng == null || count == null) {
      return res.status(400).json({ message: 'ngoId, lat, lng, and count are required' });
    }

    const entry = new BulkTreeEntry({
      ngoId,
      orderId,
      userId,
      lat,
      lng,
      location,
      count,
      note,
      fileNames: Array.isArray(fileNames) ? fileNames : [],
      images: Array.isArray(images) ? images : [],
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating bulk tree entry', error });
  }
};

export const getBulkTreeEntriesByNgo = async (req: Request, res: Response) => {
  try {
    const ngoId = req.params.id || req.query.ngoId;
    if (!ngoId) {
      return res.status(400).json({ message: 'ngoId is required' });
    }

    const entries = await BulkTreeEntry.find({ ngoId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bulk tree entries', error });
  }
};

export const getAllBulkTreeEntries = async (_req: Request, res: Response) => {
  try {
    const entries = await BulkTreeEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bulk tree entries', error });
  }
};
