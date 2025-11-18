import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { webPushController } from '../controllers/webpush.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Notification management routes
router.get('/', notificationController.getNotifications);
router.post('/read/:id', notificationController.markAsRead);
router.post('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);
router.get('/unread-count', notificationController.getUnreadCount);

// Web Push routes
router.get('/vapid-public-key', webPushController.getPublicKey);
router.post('/subscribe', webPushController.subscribe);
router.post('/unsubscribe', webPushController.unsubscribe);
router.post('/push', webPushController.sendTestPush);
router.get('/subscriptions', webPushController.getSubscriptions);
router.post('/subscriptions/cleanup', webPushController.cleanupSubscriptions);

export default router;
