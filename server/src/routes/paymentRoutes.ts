import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User';
import Order from '../models/Order';
import Activity from '../models/Activity';

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
