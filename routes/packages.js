import express from 'express';
import { createPackage, getPackageDetails, getPackages } from '../controllers/packages.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createPackage);
router.get('/:trackingCode', getPackageDetails);
router.get('/user/packages', getPackages);

export default router;