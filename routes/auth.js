import express from 'express';
import { register, login, changePassword, fetchUser } from '../controllers/auth.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', authMiddleware, changePassword);
router.get('/user', authMiddleware, fetchUser);

export default router;