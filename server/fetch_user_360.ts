import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';
import BulkTreeEntry from './src/models/BulkTreeEntry';
import Submission from './src/models/Submission';
import Certificate from './src/models/Certificate';
import NGO from './src/models/NGO';

dotenv.config();

const TARGET_ID = "USR007";

async function fetchUser360() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`\n🔍 STARTING 360-DATA AUDIT FOR USER: ${TARGET_ID}\n`);

    // 1. Fetch Core Profile
    const profile = await User.findOne({ id: TARGET_ID });
    if (!profile) {
      console.log(`❌ PROFILE NOT FOUND: ${TARGET_ID}`);
    } else {
      console.log(`✅ [USER PROFILE]`);
      console.log(JSON.stringify(profile, null, 2));
    }

    // 2. Fetch Trees & Locations
    const trees = await BulkTreeEntry.find({ userId: TARGET_ID });
    console.log(`\n✅ [TREE ENTRIES]: Found ${trees.length} Records`);
    for (const tree of trees) {
      // Find matching NGO
      const ngo = await NGO.findOne({ id: tree.ngoId });
      console.log(` - ID: ${tree._id} @ (${tree.lat}, ${tree.lng}) | NGO: ${ngo?.name || 'Unknown'} | Note: ${tree.note}`);
      if (tree.images && tree.images.length > 0) {
        console.log(`   📸 Images: ${tree.images.join(', ')}`);
      }
    }

    // 3. Fetch NGO Submissions (Proof Gallery)
    const submissions = await Submission.find({ userId: TARGET_ID });
    console.log(`\n✅ [NGO SUBMISSIONS]: Found ${submissions.length} Updates`);
    for (const sub of submissions) {
      console.log(` - Submission #${sub._id} | Status: ${sub.count} Trees | Note: ${sub.note}`);
      if (sub.proofs && sub.proofs.length > 0) {
        console.log(`   📂 Proofs: ${sub.proofs.join(', ')}`);
      }
    }

    // 4. Fetch Certificates
    const certs = await Certificate.find({ userId: TARGET_ID });
    console.log(`\n✅ [CERTIFICATES]: Found ${certs.length} Issued`);
    for (const cert of certs) {
      console.log(` - Cert: ${cert.verificationCode} | NGO: ${cert.ngoName} | Lat: ${cert.lat}, Lng: ${cert.lng}`);
    }

    console.log(`\n🏁 AUDIT COMPLETE FOR ${TARGET_ID}\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ DATABASE ERROR:', err);
    process.exit(1);
  }
}

fetchUser360();
