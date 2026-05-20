import express from 'express';
import { getUserOrders, createOrder } from '../controllers/orderController';

const router = express.Router();

router.get('/:userId', getUserOrders);
router.post('/', createOrder);

export default router;
