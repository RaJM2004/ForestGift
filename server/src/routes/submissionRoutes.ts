import express from 'express';
import { createSubmission, getSubmissionsByNgo, getAllSubmissions } from '../controllers/submissionController';

const router = express.Router();

router.post('/', createSubmission);
router.get('/', getAllSubmissions);
router.get('/ngo/:id', getSubmissionsByNgo);

export default router;
