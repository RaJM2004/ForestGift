import express from 'express';
import {
  getCakeSummary,
  getAllVendors,
  addVendor,
  updateCakeStatus,
  getVendorDashboardData,
  updateVendorDeliveryStatus,
} from '../controllers/cakeController';
import { updateVendorDeliveryWorkflow } from '../controllers/cakeWorkflowController';
import {
  listVendorInvoices,
  getVendorInvoice,
  generateVendorInvoice,
  updateInvoicePaymentStatus,
  getVendorEarnings,
  listVendorEarnings,
} from '../controllers/cakeFinanceController';

const router = express.Router();

router.get('/summary', getCakeSummary);
router.get('/vendors', getAllVendors);
router.post('/vendors', addVendor);
router.post('/status', updateCakeStatus);
router.get('/vendor/:vendorId/data', getVendorDashboardData);
router.patch('/vendor/delivery', updateVendorDeliveryStatus);
router.post('/vendor/delivery/workflow', updateVendorDeliveryWorkflow);

// Finance — invoices
router.get('/vendor/:vendorId/invoices', listVendorInvoices);
router.get('/vendor/:vendorId/invoices/:invoiceId', getVendorInvoice);
router.post('/vendor/:vendorId/invoices/generate/:userId', generateVendorInvoice);
router.patch('/vendor/:vendorId/invoices/:invoiceId/payment', updateInvoicePaymentStatus);

// Finance — earnings (verified deliveries only)
router.get('/vendor/:vendorId/earnings', getVendorEarnings);
router.get('/vendor/:vendorId/earnings/records', listVendorEarnings);

export default router;
