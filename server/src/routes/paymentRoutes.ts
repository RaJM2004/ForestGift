import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User';
import Order from '../models/Order';
import Activity from '../models/Activity';
import { sendWelcomeEmail, sendSupportNotificationEmail } from '../services/emailService';

const router = express.Router();

router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID as string,
      key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    
    if (!order) {
      return res.status(500).send('Some error occurred');
    }

    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).send(error);
  }
});

router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userDetails,
      planDetails
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment verified! Now handle database persistence
      const { name, email, dob, phone, address } = userDetails;
      const { amount, label, trees } = planDetails;

      // 1. Find or Create User
      let user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        // Create new user if not found
        const userCount = await User.countDocuments();
        const newUserId = `USR${(userCount + 1).toString().padStart(3, '0')}`;
        const newToken = `TKN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        user = new User({
          id: newUserId,
          name,
          email: email.toLowerCase(),
          dob,
          phone,
          address: address || 'Not Provided',
          token: newToken,
          amount: amount,
          trees: trees,
          status: 'Initial',
          ngo: 'Not Assigned',
          location: 'TBD',
          date: new Date().toISOString().split('T')[0],
          referralCode: `FOREST-${name.split(' ')[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
          impactPoints: 50, // Welcome points
          globalRank: 0
        });
      } else {
        // Update existing user
        user.amount += amount;
        user.trees += trees;
        // Optionally update phone/address if they were empty
        if (!user.phone) user.phone = phone;
        if (!user.address || user.address === 'Not Provided') user.address = address;
      }
      
      await user.save();

      // 2. Create Order Record
      const newOrder = new Order({
        orderId: `FG-${Math.floor(10000 + Math.random() * 90000)}`,
        userId: user.id,
        trees: trees,
        status: 'Growing',
        progress: 15,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        location: 'Central Plantation',
        amount: `₹${amount.toLocaleString()}`,
        species: 'Native Species Mix'
      });
      await newOrder.save();

      // 3. Add Activity Record
      const activity = new Activity({
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        msg: `₹${amount.toLocaleString()} payment received from ${name} — ${trees} trees eligible`,
        type: 'payment'
      });
      await activity.save();

      // 4. Trigger Emails (Welcome email to user, Support notification to support@forestgift.in)
      try {
        console.log(`[EMAIL] Triggering notification emails for payment by user ${user.email}`);
        
        // Support email
        const supportSubject = `🌿 Successful Payment: ₹${amount.toLocaleString()} from ${name}`;
        const supportHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1a202c; background-color: #fcfdfa;">
            <div style="text-align: center; margin-bottom: 32px;">
              <img src="http://localhost:5173/forest_gift_logo.png" alt="ForestGift Logo" style="height: 55px; display: block; margin: 0 auto 16px auto; border-radius: 8px;" />
              <h1 style="color: #059669; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 0.1em;">ForestGift</h1>
              <p style="color: #718096; font-size: 12px; font-weight: bold; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.2em;">Successful Payment Notification</p>
            </div>
            
            <h2 style="font-size: 20px; color: #247114; margin-bottom: 16px; border-bottom: 1px solid #edf2f7; padding-bottom: 12px;">Payment Confirmed</h2>
            <p style="line-height: 1.6; color: #4a5568; font-size: 14px;">A successful payment has been processed and verified via Razorpay.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 16px; margin: 24px 0; border: 1px solid #edf2f7; font-size: 14px;">
              <h3 style="margin-top: 0; font-size: 14px; color: #718096; text-transform: uppercase;">Customer Profile</h3>
              <p style="margin: 6px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #059669; font-weight: bold; text-decoration: none;">${email}</a></p>
              <p style="margin: 6px 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 6px 0;"><strong>Address:</strong> ${address || 'Not Provided'}</p>
              <p style="margin: 6px 0;"><strong>DOB:</strong> ${dob}</p>
            </div>

            <div style="background-color: #f8fafc; padding: 20px; border-radius: 16px; margin: 24px 0; border: 1px solid #edf2f7; font-size: 14px;">
              <h3 style="margin-top: 0; font-size: 14px; color: #718096; text-transform: uppercase;">Transaction Details</h3>
              <p style="margin: 6px 0;"><strong>Amount Paid:</strong> ₹${amount.toLocaleString()}</p>
              <p style="margin: 6px 0;"><strong>Trees Planted:</strong> ${trees}</p>
              <p style="margin: 6px 0;"><strong>Razorpay Order ID:</strong> ${razorpay_order_id}</p>
              <p style="margin: 6px 0;"><strong>Razorpay Payment ID:</strong> ${razorpay_payment_id}</p>
              <p style="margin: 6px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <p style="font-size: 11px; color: #a0aec0; text-align: center; margin-top: 42px;">
              This notification was automatically dispatched to support@forestgift.in from the ForestGift payment gateway node.
            </p>
          </div>
        `;
        await sendSupportNotificationEmail(supportSubject, supportHtml);

        // Welcome email with credentials to user
        const emailResult = await sendWelcomeEmail(user.email, user.name, user.token, user.password || 'forestgift123');
        if (emailResult.success) {
          user.welcomeEmailSent = true;
          await user.save();
          console.log(`[EMAIL] Welcome email sent successfully to: ${user.email}`);
        } else {
          console.error(`[EMAIL] Failed to send welcome email:`, emailResult.error);
        }
      } catch (emailErr) {
        console.error(`[EMAIL] Error occurred during email notifications:`, emailErr);
      }

      return res.status(200).json({ 
        message: 'Payment verified and records updated successfully',
        userId: user.id 
      });
    } else {
      return res.status(400).json({ message: 'Invalid signature sent!' });
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error during verification', error: error.message });
  }
});

router.post('/bank-transfer', async (req, res) => {
  try {
    const { userDetails, planDetails } = req.body;
    const { name, email, dob, phone, address } = userDetails;
    const { amount, label, trees } = planDetails;

    // 1. Find or Create User
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      const userCount = await User.countDocuments();
      const newUserId = `USR${(userCount + 1).toString().padStart(3, '0')}`;
      const newToken = `TKN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      user = new User({
        id: newUserId,
        name,
        email: email.toLowerCase(),
        dob,
        phone,
        address: address || 'Not Provided',
        token: newToken,
        amount: amount,
        trees: trees,
        status: 'Initial',
        ngo: 'Not Assigned',
        location: 'TBD',
        date: new Date().toISOString().split('T')[0],
        referralCode: `FOREST-${name.split(' ')[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        impactPoints: 50,
        globalRank: 0
      });
    } else {
      user.amount += amount;
      user.trees += trees;
      if (!user.phone) user.phone = phone;
      if (!user.address || user.address === 'Not Provided') user.address = address;
    }
    
    await user.save();

    // 2. Create Order Record (starts as Pending Verification)
    const newOrder = new Order({
      orderId: `FG-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: user.id,
      trees: trees,
      status: 'Pending Verification',
      progress: 5,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      location: 'Central Plantation',
      amount: `₹${amount.toLocaleString()}`,
      species: 'Native Species Mix'
    });
    await newOrder.save();

    // 3. Add Activity Record
    const activity = new Activity({
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      msg: `Bank Transfer initiated by ${name} — ₹${amount.toLocaleString()} pending verification`,
      type: 'payment'
    });
    await activity.save();

    return res.status(200).json({ 
      message: 'Bank transfer order recorded successfully',
      userId: user.id 
    });
  } catch (error: any) {
    console.error('Error recording bank transfer:', error);
    res.status(500).json({ message: 'Error recording bank transfer', error: error.message });
  }
});

router.get('/key', (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});

export default router;
