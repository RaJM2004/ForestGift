import express from 'express';
import { getAdminOverview, createUser, assignNGO, createNGO, deleteUser, updateUser, deleteNGO, updateNGOProfile, deleteVendor, updateVendor, getSettings, updateSettings, resendWelcomeEmailController } from '../controllers/adminController';
const router = express.Router();
router.get('/overview', getAdminOverview);
router.post('/users', createUser);
router.post('/resend-welcome-email', resendWelcomeEmailController);
router.post('/assign-ngo', assignNGO);
router.post('/ngos', createNGO);

router.delete('/users/:id', deleteUser);
router.patch('/users/:id', updateUser);

router.delete('/ngos/:id', deleteNGO);
router.patch('/ngos/:id', updateNGOProfile);

router.delete('/vendors/:id', deleteVendor);
router.patch('/vendors/:id', updateVendor);

router.get('/settings', getSettings);
router.patch('/settings', updateSettings);

export default router;
