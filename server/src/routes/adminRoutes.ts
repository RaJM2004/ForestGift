import express from 'express';
import { getAdminOverview, createUser, assignNGO, createNGO } from '../controllers/adminController';

const router = express.Router();
router.get('/overview', getAdminOverview);
router.post('/users', createUser);
router.post('/assign-ngo', assignNGO);
router.post('/ngos', createNGO);

export default router;
