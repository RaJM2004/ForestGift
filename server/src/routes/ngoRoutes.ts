import express from 'express';
import { getNgoProfile, updateNgo } from '../controllers/ngoController';

const router = express.Router();
router.get('/:id', getNgoProfile);
router.patch('/:id', updateNgo);

export default router;
