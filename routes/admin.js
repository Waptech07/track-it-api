import express from 'express';
import { getUsers, updatePackageStatus, deleteUser, getAllAccounts, editMessage, getAllAdmins, addAdmin } from '../controllers/admin.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/users', getUsers);
router.get('/accounts', getAllAccounts);
router.put('/messages/:messageId', editMessage);
router.put('/packages/:packageId/status', updatePackageStatus);
router.delete('/users/:userId', deleteUser);
router.get('/admins', getAllAdmins);
router.post('/admin', addAdmin);   

export default router;