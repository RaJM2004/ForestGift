import express from 'express';
import {
  getCakeSummary,
  getAllVendors,
  addVendor,
  updateCakeStatus,
  getVendorDashboardData,
  updateVendorDeliveryStatus,
} from '../controllers/cakeController';

const router = express.Router();

router.get('/summary', getCakeSummary);
router.get('/vendors', getAllVendors);
router.post('/vendors', addVendor);
router.post('/status', updateCakeStatus);
router.get('/vendor/:vendorId/data', getVendorDashboardData);
router.patch('/vendor/delivery', updateVendorDeliveryStatus);

export default router;
