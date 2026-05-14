import express from 'express';
import { createCertificate, getAllCertificates, getCertificateByVerification } from '../controllers/certificateController';

const router = express.Router();

router.post('/', createCertificate);
router.get('/', getAllCertificates);
router.get('/verify/:code', getCertificateByVerification);

export default router;
