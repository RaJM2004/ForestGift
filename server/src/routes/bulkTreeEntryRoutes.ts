import express from 'express';
import {
  createBulkTreeEntry,
  getBulkTreeEntriesByNgo,
  getAllBulkTreeEntries,
} from '../controllers/bulkTreeEntryController';

const router = express.Router();

router.post('/', createBulkTreeEntry);
router.get('/', getAllBulkTreeEntries);
router.get('/ngo/:id', getBulkTreeEntriesByNgo);

export default router;
