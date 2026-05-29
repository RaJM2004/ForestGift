import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import User from './models/User';
import NGO from './models/NGO';
import Vendor from './models/Vendor';
import Activity from './models/Activity';
import BulkTreeEntry from './models/BulkTreeEntry';
import Order from './models/Order';


// Load .env next to this file (server/src/.env), or fallback to server/.env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
console.log('⏳ Connecting to MongoDB...');
const MONGODB_URI = process.env.MONGODB_URI || '';
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('🚀 Server logic initialized');
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Server Error", error: err.message || err });
});

// Seed data route (Internal or for dev only)
app.post('/api/seed', async (req, res) => {
  try {
    const USERS = [
      { id:"USR001", name:"Ramesh Kumar", dob:"1985-03-14", address:"12, MG Road, Bhopal MP", phone:"9876543210", email:"ramesh@email.com", token:"TKN-2024-0001", amount:5000, trees:5, status:"Planted", ngo:"GreenEarth NGO", location:"Block A, Satpura Zone", date:"2024-01-15", referralCount: 15, globalRank: 42, cakeVendor:"VND001", cakeStatus:"Ordered" },
      { id:"USR002", name:"Sunita Devi", dob:"1990-07-22", address:"45, Civil Lines, Jabalpur MP", phone:"9812345678", email:"sunita@email.com", token:"TKN-2024-0002", amount:3000, trees:3, status:"Pending", ngo:"VanaRaksha Foundation", location:"Block B, Vindhya Zone", date:"2024-01-18", referralCount: 8, globalRank: 156, cakeVendor:"VND001", cakeStatus:"Preparing" },
      { id:"USR003", name:"Arun Mehta", dob:"1978-11-05", address:"78, Nai Basti, Indore MP", phone:"9988776655", email:"arun@email.com", token:"TKN-2024-0003", amount:10000, trees:10, status:"Planted", ngo:"GreenEarth NGO", location:"Block C, Satpura Zone", date:"2024-01-20", referralCount: 22, globalRank: 12, cakeVendor:"VND001", cakeStatus:"OutForDelivery" },
      { id:"USR004", name:"Priya Sharma", dob:"1995-02-28", address:"33, Shivaji Nagar, Bhopal MP", phone:"9765432100", email:"priya@email.com", token:"TKN-2024-0004", amount:2000, trees:2, status:"Pending", ngo:"Not Assigned", location:"TBD", date:"2024-01-22", referralCount: 3, globalRank: 890, cakeVendor:"VND001", cakeStatus:"Delivered" },
      { id:"USR005", name:"Vijay Patel", dob:"1982-09-17", address:"101, Gandhi Chowk, Rewa MP", phone:"9654321098", email:"vijay@email.com", token:"TKN-2024-0005", amount:7000, trees:7, status:"Planted", ngo:"SahyogVan Trust", location:"Block D, Amarkantak Zone", date:"2024-01-25", referralCount: 11, globalRank: 245, cakeVendor:"VND002", cakeStatus:"Ordered" },
      { id:"USR006", name:"Meera Joshi", dob:"1988-06-11", address:"55, Lal Bagh, Ujjain MP", phone:"9543210987", email:"meera@email.com", token:"TKN-2024-0006", amount:4000, trees:4, status:"Pending", ngo:"VanaRaksha Foundation", location:"Block A, Malwa Zone", date:"2024-01-28", referralCount: 6, globalRank: 432, cakeVendor:"VND001", cakeStatus:"Rejected" },
    ];

    const NGOS = [
      { id:"NGO001", name:"GreenEarth NGO", reg:"REG/MP/2019/0041", contact:"Dr. Anil Verma", phone:"9111222333", email:"greenearth@ngo.in", area:"Satpura Zone", assigned:25, completed:18, pending:7, rating:4.5 },
      { id:"NGO002", name:"VanaRaksha Foundation", reg:"REG/MP/2020/0087", contact:"Mrs. Kavita Singh", phone:"9222333444", email:"vanaraksha@ngo.in", area:"Vindhya & Malwa Zone", assigned:20, completed:12, pending:8, rating:4.0 },
      { id:"NGO003", name:"SahyogVan Trust", reg:"REG/MP/2018/0023", contact:"Mr. Rajesh Tiwari", phone:"9333444555", email:"sahyogvan@ngo.in", area:"Amarkantak Zone", assigned:15, completed:14, pending:1, rating:4.8 },
      { id:"NGO004", name:"HaritBhumi Sangha", reg:"REG/MP/2021/0112", contact:"Ms. Pooja Yadav", phone:"9444555666", email:"haritbhumi@ngo.in", area:"Narmada Zone", assigned:18, completed:9, pending:9, rating:3.7 },
    ];

    const VENDORS = [
      { id:"VND001", name:"Indore Cake Masters", email:"indore@cakes.com", contact:"Suresh Raina", phone:"9888777666", area:"Satellite Block A", costPerCake:550 },
      { id:"VND002", name:"Bhopal Bakeries", email:"bhopal@cakes.com", contact:"Anita Desai", phone:"9777666555", area:"Satpura Zone", costPerCake:480 },
    ];

    const ACTIVITIES = [

      { time:"10:42 AM", msg:"Token TKN-2024-0006 generated for Meera Joshi", type:"token" },
      { time:"09:15 AM", msg:"GreenEarth NGO updated 3 plantation statuses to Planted", type:"planted" },
      { time:"Yesterday", msg:"₹7,000 payment received from Vijay Patel — 7 trees eligible", type:"payment" },
      { time:"Yesterday", msg:"VanaRaksha Foundation assigned Block B plantations", type:"assign" },
      { time:"2 days ago", msg:"New NGO HaritBhumi Sangha registered and approved", type:"ngo" },
      { time:"3 days ago", msg:"System report generated: January 2024 Plantation Summary", type:"report" },
    ];

    const TREES = [
      { ngoId: "NGO001", orderId: "ORD001", userId: "USR001", lat: 23.2599, lng: 77.4126, location: "Satpura Tiger Reserve, Block A", count: 1, note: "Mango Tree - Healthy Growth", images: ["https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=400"] }
    ];

    const ORDERS = [
      { orderId: "FG-98421", userId: "USR001", trees: 2, status: "Verified", progress: 100, date: "Feb 12, 2024", location: "Satpura Zone", amount: "₹1,200", species: "Teak & Neem" },
      { orderId: "FG-98425", userId: "USR001", trees: 1, status: "Planted", progress: 65, date: "Feb 15, 2024", location: "Amarkantak", amount: "₹600", species: "Mango" },
      { orderId: "FG-98510", userId: "USR001", trees: 2, status: "Growing", progress: 15, date: "Mar 02, 2024", location: "Vindhya Range", amount: "₹1,150", species: "Banyan" },
    ];

    await User.deleteMany({});
    await NGO.deleteMany({});
    await Vendor.deleteMany({});
    await Activity.deleteMany({});
    await BulkTreeEntry.deleteMany({});
    await Order.deleteMany({});

    await User.insertMany(USERS);
    await NGO.insertMany(NGOS);
    await Vendor.insertMany(VENDORS);
    await Activity.insertMany(ACTIVITIES);
    await BulkTreeEntry.insertMany(TREES);
    await Order.insertMany(ORDERS);


    res.json({ message: 'Database seeded successfully on Cluster0' });
  } catch (err) {
    res.status(500).json({ message: 'Error seeding database', error: err });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
