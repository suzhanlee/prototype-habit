import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Get user settings
router.get('/settings', userController.getUserSettings);

// Update profile
router.put('/profile', userController.updateProfile);

// Update settings
router.put('/settings', userController.updateSettings);

// Change password
router.post('/password', userController.changePassword);

// Delete account
router.delete('/account', userController.deleteAccount);

export default router;
