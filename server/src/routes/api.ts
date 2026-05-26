import express from 'express';
import adminRoutes from './adminRoutes';
import ngoRoutes from './ngoRoutes';
import userRoutes from './userRoutes';
import cakeRoutes from './cakeRoutes';
import authRoutes from './authRoutes';
import submissionRoutes from './submissionRoutes';
import certificateRoutes from './certificateRoutes';
import bulkTreeEntryRoutes from './bulkTreeEntryRoutes';
import orderRoutes from './orderRoutes';
import User from '../models/User';
import NGO from '../models/NGO';
import Activity from '../models/Activity';
import paymentRoutes from './paymentRoutes';
import supportRoutes from './supportRoutes';
import storyRoutes from './storyRoutes';

const router = express.Router();

// Auth routes
router.use('/auth', authRoutes);

// Domain-specific routes
router.use('/admin', adminRoutes);
router.use('/ngo', ngoRoutes);
router.use('/user', userRoutes);
router.use('/cake', cakeRoutes);
router.use('/submissions', submissionRoutes);
router.use('/bulk-tree-entries', bulkTreeEntryRoutes);
router.use('/certificates', certificateRoutes);
router.use('/orders', orderRoutes);
router.use('/payment', paymentRoutes);
router.use('/support', supportRoutes);
router.use('/stories', storyRoutes);

// Generic fallback routes for backward compatibility/simplicity
router.get('/users', async (req, res) => res.json(await User.find().sort({ createdAt: -1 })));
router.get('/ngos', async (req, res) => res.json(await NGO.find()));
router.get('/activities', async (req, res) => res.json(await Activity.find().sort({ createdAt: -1 })));

export default router;

