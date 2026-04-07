import { Request, Response } from 'express';
import Certificate from '../models/Certificate';
import BulkTreeEntry from '../models/BulkTreeEntry';

export const createCertificate = async (req: Request, res: Response) => {
  try {
    let { userId, userName, ngoId, ngoName, submissionId, lat, lng, imageUrl, verificationCode } = req.body;
    
    // Idempotency: skip creation if it already exists for this submission
    const existing = await Certificate.findOne({ submissionId });
    if (existing) {
      console.log(`[CERT] Found existing certificate for submission: ${submissionId}`);
      return res.json(existing);
    }

    // Ensure we have a verification code
    if (!verificationCode) {
      verificationCode = `CERT-${userId}-${Date.now()}`;
    }
    
    const newCertificate = new Certificate({
      userId,
      userName,
      ngoId,
      ngoName,
      submissionId,
      lat,
      lng,
      imageUrl,
      verificationCode,
    });

    const saved = await newCertificate.save();
    console.log(`[CERT] Created new certificate: ${verificationCode}`);
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCertificates = async (_req: Request, res: Response) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCertificateByVerification = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    console.log(`[VERIFY] Attempting to verify certificate with code: ${code}`);
    
    const cert = await Certificate.findOne({ verificationCode: code }).lean();
    if (!cert) {
      console.log(`[VERIFY] No certificate found for code: ${code}`);
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    const trees = await BulkTreeEntry.find({
      $or: [
        { userId: cert.userId },
        { orderId: cert.userId }
      ]
    }).lean();

    console.log(`[VERIFY] Found certificate for: ${cert.userName} with ${trees.length} trees`);
    res.json({ ...cert, trees });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
