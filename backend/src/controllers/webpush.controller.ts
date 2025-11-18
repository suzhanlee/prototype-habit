import { Request, Response } from 'express';
import { webPushService } from '../services/webpush.service';

export const webPushController = {
  /**
   * GET /api/notifications/vapid-public-key
   * Get VAPID public key for client-side subscription
   */
  async getPublicKey(req: Request, res: Response) {
    try {
      const publicKey = webPushService.getPublicKey();

      res.status(200).json({
        success: true,
        data: { publicKey },
      });
    } catch (error: any) {
      console.error('Error getting VAPID public key:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to get VAPID public key', status: 500 },
      });
    }
  },

  /**
   * POST /api/notifications/subscribe
   * Subscribe to push notifications
   */
  async subscribe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { subscription } = req.body;

      if (!subscription || !subscription.endpoint || !subscription.keys) {
        return res.status(400).json({
          error: { message: 'Invalid subscription data', status: 400 },
        });
      }

      const userAgent = req.headers['user-agent'];

      const pushSubscription = await webPushService.subscribeToPush(
        req.user.userId,
        subscription,
        userAgent
      );

      res.status(200).json({
        success: true,
        data: {
          id: pushSubscription.id,
          endpoint: pushSubscription.endpoint,
          createdAt: pushSubscription.createdAt,
        },
        message: 'Successfully subscribed to push notifications',
      });
    } catch (error: any) {
      console.error('Error subscribing to push:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to subscribe to push notifications', status: 500 },
      });
    }
  },

  /**
   * POST /api/notifications/unsubscribe
   * Unsubscribe from push notifications
   */
  async unsubscribe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { endpoint } = req.body;

      if (!endpoint) {
        return res.status(400).json({
          error: { message: 'Endpoint is required', status: 400 },
        });
      }

      const result = await webPushService.unsubscribeFromPush(req.user.userId, endpoint);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      const status = error.message === 'Subscription not found' ? 404 : 500;
      res.status(status).json({
        error: { message: error.message || 'Failed to unsubscribe from push notifications', status },
      });
    }
  },

  /**
   * POST /api/notifications/push
   * Send a test push notification
   */
  async sendTestPush(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { title, body } = req.body;

      if (!title || !body) {
        return res.status(400).json({
          error: { message: 'Title and body are required', status: 400 },
        });
      }

      const result = await webPushService.sendPushNotification(
        req.user.userId,
        title,
        body
      );

      res.status(200).json({
        success: result.success,
        data: result,
      });
    } catch (error: any) {
      console.error('Error sending test push:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to send push notification', status: 500 },
      });
    }
  },

  /**
   * GET /api/notifications/subscriptions
   * Get user's push subscriptions
   */
  async getSubscriptions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const subscriptions = await webPushService.getUserSubscriptions(req.user.userId);

      res.status(200).json({
        success: true,
        data: { subscriptions, count: subscriptions.length },
      });
    } catch (error: any) {
      console.error('Error fetching subscriptions:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to fetch subscriptions', status: 500 },
      });
    }
  },

  /**
   * POST /api/notifications/subscriptions/cleanup
   * Clean up invalid push subscriptions
   */
  async cleanupSubscriptions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const result = await webPushService.cleanupInvalidSubscriptions(req.user.userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Error cleaning up subscriptions:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to cleanup subscriptions', status: 500 },
      });
    }
  },
};
