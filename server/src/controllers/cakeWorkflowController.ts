import { Request, Response } from 'express';
import User from '../models/User';
import Vendor from '../models/Vendor';
import Activity from '../models/Activity';
import CakeDeliveryEarning from '../models/CakeDeliveryEarning';
import { mapUserToDelivery } from '../utils/cakeDeliveryMapper';
import { computeCakePricing, generateDeliveryOtp } from '../utils/cakePricing';
import CakeInvoice from '../models/CakeInvoice';
import { buildInvoiceForUser } from './cakeFinanceController';
import { sendCakeDeliveryOtpEmail } from '../services/emailService';

type WorkflowAction = 'accept' | 'reject' | 'preparing' | 'out_for_delivery' | 'complete_delivery';

const OTP_TTL_MS = 24 * 60 * 60 * 1000;

function paramId(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
}

async function recordEarning(
  vendor: { id: string; costPerCake: number },
  user: InstanceType<typeof User>,
) {
  const delivery = mapUserToDelivery(user);
  const pricing = computeCakePricing(user.trees);
  const deliveredAt = user.cakeDeliveredAt || new Date();

  const existing = await CakeDeliveryEarning.findOne({ orderId: delivery.orderId });
  if (existing) {
    existing.quantity = pricing.quantity;
    existing.pricePerUnit = pricing.pricePerUnit;
    existing.totalPrice = pricing.totalPrice;
    await existing.save();
    return existing;
  }

  return CakeDeliveryEarning.create({
    vendorId: vendor.id,
    userId: user.id,
    orderId: delivery.orderId,
    customerName: user.name,
    cakeName: delivery.cakeFlavor,
    cakeSize: delivery.cakeSize,
    quantity: pricing.quantity,
    pricePerUnit: pricing.pricePerUnit,
    totalPrice: pricing.totalPrice,
    deliveryDate: delivery.deliveryDate,
    deliveryStatus: 'Delivered',
    deliveredAt,
  });
}

export const updateVendorDeliveryWorkflow = async (req: Request, res: Response) => {
  try {
    const { vendorId, userId, action, otp } = req.body as {
      vendorId?: string;
      userId?: string;
      action?: WorkflowAction;
      otp?: string;
    };

    if (!vendorId || !userId || !action) {
      return res.status(400).json({ message: 'vendorId, userId, and action are required' });
    }

    const vendor = await Vendor.findOne({ id: vendorId });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const user = await User.findOne({ id: userId, cakeVendor: vendorId });
    if (!user) return res.status(404).json({ message: 'No delivery assignment found for this vendor' });

    const current = user.cakeStatus || 'Ordered';

    if (current === 'Rejected') {
      return res.status(400).json({ message: 'This order was rejected and cannot be updated' });
    }

    if (current === 'Delivered' && action !== 'complete_delivery') {
      return res.status(400).json({ message: 'This order is already delivered' });
    }

    switch (action) {
      case 'accept': {
        if (current !== 'Ordered') {
          return res.status(400).json({ message: 'Only pending orders can be accepted' });
        }
        user.cakeStatus = 'Preparing';
        user.cakeDeliveryOtp = undefined;
        user.cakeOtpExpiresAt = undefined;
        break;
      }
      case 'reject': {
        if (current !== 'Ordered') {
          return res.status(400).json({ message: 'Only pending orders can be rejected' });
        }
        user.cakeStatus = 'Rejected';
        user.cakeDeliveryOtp = undefined;
        user.cakeOtpExpiresAt = undefined;
        break;
      }
      case 'preparing': {
        if (!['Preparing', 'Accepted'].includes(current)) {
          return res.status(400).json({ message: 'Order must be accepted before preparing' });
        }
        user.cakeStatus = 'Preparing';
        break;
      }
      case 'out_for_delivery': {
        if (!['Preparing', 'Accepted', 'OutForDelivery'].includes(current)) {
          return res.status(400).json({ message: 'Complete preparing stage before dispatch' });
        }
        const code = generateDeliveryOtp();
        user.cakeStatus = 'OutForDelivery';
        user.cakeDeliveryOtp = code;
        user.cakeOtpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
        await user.save();

        await buildInvoiceForUser(vendorId, userId);
        await sendCakeDeliveryOtpEmail(user.email, user.name, code, `FG-${user.id}`);

        await new Activity({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          msg: `Cake out for delivery — OTP sent to ${user.name}`,
          type: 'payment',
        }).save();

        return res.json({
          delivery: mapUserToDelivery(user),
          message: 'Invoice created. OTP sent to customer email.',
        });
      }
      case 'complete_delivery': {
        if (current !== 'OutForDelivery') {
          return res.status(400).json({ message: 'Mark out for delivery before completing' });
        }
        if (!otp || String(otp).trim().length !== 6) {
          return res.status(400).json({ message: 'Valid 6-digit OTP is required' });
        }
        if (!user.cakeDeliveryOtp) {
          return res.status(400).json({ message: 'No OTP on file. Dispatch the order again.' });
        }
        if (user.cakeOtpExpiresAt && user.cakeOtpExpiresAt < new Date()) {
          return res.status(400).json({ message: 'OTP has expired. Dispatch again to resend.' });
        }
        if (String(otp).trim() !== user.cakeDeliveryOtp) {
          return res.status(401).json({ message: 'Incorrect OTP. Please verify with the customer.' });
        }

        user.cakeStatus = 'Delivered';
        user.cakeDeliveredAt = new Date();
        user.cakeDeliveryOtp = undefined;
        user.cakeOtpExpiresAt = undefined;
        await user.save();

        const earning = await recordEarning(vendor, user);

        await CakeInvoice.findOneAndUpdate(
          { vendorId, userId: user.id },
          { paymentStatus: 'Paid' },
        );

        await new Activity({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          msg: `Cake delivered for ${user.name} — ₹${earning.totalPrice} recorded`,
          type: 'payment',
        }).save();

        return res.json({
          delivery: mapUserToDelivery(user),
          earning,
          message: 'Delivery verified. Earnings updated.',
        });
      }
      default:
        return res.status(400).json({ message: 'Invalid workflow action' });
    }

    await user.save();

    await new Activity({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      msg: `Cake order ${user.cakeStatus} for ${user.name} (${vendor.name})`,
      type: 'payment',
    }).save();

    res.json({ delivery: mapUserToDelivery(user) });
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery workflow', error });
  }
};
