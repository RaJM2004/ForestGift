import express from 'express';
import { getCakeSummary, getAllVendors, addVendor, updateCakeStatus } from '../controllers/cakeController';

const router = express.Router();
router.get('/summary', getCakeSummary);
router.get('/vendors', getAllVendors);
router.post('/vendors', addVendor);
router.post('/status', updateCakeStatus);

export default router;
