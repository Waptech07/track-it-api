import express from 'express';
import { register, login, changePassword } from '../controllers/auth.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', authMiddleware, changePassword);

export default router;