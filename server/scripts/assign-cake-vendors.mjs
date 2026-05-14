/**
 * One-off / dev: assign cakeVendor + cakeStatus on users so cake dashboard has rows.
 * Run: node scripts/assign-cake-vendors.mjs
 * Loads MONGODB_URI from server/.env (run from server directory).
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const uri = process.env.MONGODB_URI || '';
if (!uri) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

const assigns = [
  { id: 'USR001', cakeVendor: 'VND001', cakeStatus: 'Ordered' },
  { id: 'USR002', cakeVendor: 'VND001', cakeStatus: 'Accepted' },
  { id: 'USR003', cakeVendor: 'VND001', cakeStatus: 'OutForDelivery' },
  { id: 'USR004', cakeVendor: 'VND001', cakeStatus: 'Delivered' },
  { id: 'USR005', cakeVendor: 'VND002', cakeStatus: 'Ordered' },
  { id: 'USR006', cakeVendor: 'VND001', cakeStatus: 'Rejected' },
  { id: 'USR007', cakeVendor: 'VND001', cakeStatus: 'Ordered' },
];

await mongoose.connect(uri);
const col = mongoose.connection.collection('users');
for (const a of assigns) {
  const r = await col.updateOne({ id: a.id }, { $set: { cakeVendor: a.cakeVendor, cakeStatus: a.cakeStatus } });
  console.log(a.id, 'matched', r.matchedCount, 'modified', r.modifiedCount);
}
const sample = await col.find({}, { projection: { _id: 0, id: 1, name: 1, cakeVendor: 1, dob: 1, location: 1 } }).toArray();
console.log('\nAll users (id, cakeVendor, dob, location):');
console.table(sample.map((u) => ({ id: u.id, cakeVendor: u.cakeVendor, dob: u.dob, location: u.location })));
await mongoose.disconnect();
