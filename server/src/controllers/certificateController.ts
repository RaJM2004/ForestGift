import { Request, Response } from 'express';
import Certificate from '../models/Certificate';
import BulkTreeEntry from '../models/BulkTreeEntry';
import Submission from '../models/Submission';
import User from '../models/User';
import { sendCertificateEmail } from '../services/emailService';

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

    // Trigger Certificate Email
    const user = await User.findOne({ id: userId });
    if (user && user.email) {
        const emailResult = await sendCertificateEmail(user.email, user.name, verificationCode);
        if (emailResult.success) {
            saved.emailSent = true;
            await saved.save();
        }
    }

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
    
    // 1. Fetch the user to get their full identity markers (Parity with UserDashboard logic)
    const user = await User.findOne({ id: cert.userId }).lean();
    
    // 2. Build identity filter for robust matching
    const identityFilter: any[] = [{ userId: cert.userId }];
    
    if (user) {
        if (user.name) identityFilter.push({ userName: { $regex: new RegExp(`^${user.name}$`, 'i') } });
        if (user.token) identityFilter.push({ userToken: user.token });
        if (user.phone) identityFilter.push({ phone: user.phone });
        if (user.email) identityFilter.push({ email: user.email });
    }

    // Include submissionId and userId from the certificate itself in search
    const searchFilter = {
      $or: [
        ...identityFilter,
        { orderId: cert.submissionId },
        { orderId: cert.userId }
      ]
    };

    // Fetch trees from BulkTreeEntry
    const trees = await BulkTreeEntry.find(searchFilter).lean();

    // Fetch proof images from Submission
    const submissions = await Submission.find(searchFilter).lean();

    // Combine images from both sources
    let finalImageUrl = cert.imageUrl;
    
    // First check certificate itself
    // Then check submissions (proofs)
    if (!finalImageUrl) {
        for (const sub of submissions) {
            if (sub.proofs && sub.proofs.length > 0) {
                finalImageUrl = sub.proofs[0];
                break;
            }
        }
    }

    // Then check bulk tree entries (images)
    if (!finalImageUrl) {
      for (const tree of trees) {
        if (tree.images && tree.images.length > 0) {
          finalImageUrl = tree.images[0];
          break;
        }
      }
    }

    console.log(`[VERIFY] Found certificate for: ${cert.userName} with ${trees.length} trees and ${submissions.length} submissions. Image: ${finalImageUrl}`);
    res.json({ ...cert, trees, submissions, displayImage: finalImageUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
