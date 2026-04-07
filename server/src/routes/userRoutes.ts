import express from 'express';
import { getUserProfile, updatePassword, getImpactStats, toggleFavorite, getUserReferrals } from '../controllers/userController';

const router = express.Router();
router.get('/:id', getUserProfile);
router.get('/:id/impact', getImpactStats);
router.get('/:id/referrals', getUserReferrals);
router.patch('/impact/favorite', toggleFavorite);
router.post('/update-password', updatePassword);

export default router;
