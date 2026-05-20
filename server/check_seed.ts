import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';
import BulkTreeEntry from './src/models/BulkTreeEntry';

dotenv.config();

async function checkSeed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const userCount = await User.countDocuments();
    const treeCount = await BulkTreeEntry.countDocuments();
    
    console.log(`--- DATABASE SEED STATUS ---`);
    console.log(`User Count: ${userCount}`);
    console.log(`Tree Count: ${treeCount}`);
    console.log(`Seeded: ${userCount > 0 ? 'YES' : 'NO'}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Error checking database:', err);
    process.exit(1);
  }
}

checkSeed();
