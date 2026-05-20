import { Request, Response } from 'express';
import Submission from '../models/Submission';

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { ngoId, orderId, userId, lat, lng, location, species, count, note, fileNames, proofs } = req.body;

    if (!ngoId || lat == null || lng == null || count == null) {
      return res.status(400).json({ message: 'ngoId, lat, lng, and count are required' });
    }

    const submission = new Submission({
      ngoId,
      orderId,
      userId,
      lat,
      lng,
      location,
      species,
      count,
      note,
      fileNames: Array.isArray(fileNames) ? fileNames : [],
      proofs: Array.isArray(proofs) ? proofs : [],
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Error creating submission', error });
  }
};

export const getSubmissionsByNgo = async (req: Request, res: Response) => {
  try {
    const ngoId = req.params.id || req.query.ngoId;
    if (!ngoId) {
      return res.status(400).json({ message: 'ngoId is required' });
    }

    const submissions = await Submission.find({ ngoId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions', error });
  }
};

export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all submissions', error });
  }
};
