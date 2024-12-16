import express from 'express';
import { createPackage, getPackage, getUserPackages } from '../controllers/packages.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createPackage);
router.get('/:trackingCode', getPackage);
router.get('/user/packages', getUserPackages);

export default router;