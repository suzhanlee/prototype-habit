import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';

export const notificationController = {
  /**
   * GET /api/notifications
   * Get user's notifications with pagination
   */
  async getNotifications(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await notificationService.getNotifications(
        req.user.userId,
        limit,
        offset
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to fetch notifications', status: 500 },
      });
    }
  },

  /**
   * POST /api/notifications/read/:id
   * Mark a notification as read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const notificationId = parseInt(req.params.id);

      if (isNaN(notificationId)) {
        return res.status(400).json({
          error: { message: 'Invalid notification ID', status: 400 },
        });
      }

      const notification = await notificationService.markAsRead(
        notificationId,
        req.user.userId
      );

      res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (error: any) {
      const status = error.message === 'Notification not found' ? 404 : 500;
      res.status(status).json({
        error: { message: error.message || 'Failed to mark notification as read', status },
      });
    }
  },

  /**
   * DELETE /api/notifications/:id
   * Delete a notification
   */
  async deleteNotification(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const notificationId = parseInt(req.params.id);

      if (isNaN(notificationId)) {
        return res.status(400).json({
          error: { message: 'Invalid notification ID', status: 400 },
        });
      }

      const result = await notificationService.deleteNotification(
        notificationId,
        req.user.userId
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      const status = error.message === 'Notification not found' ? 404 : 500;
      res.status(status).json({
        error: { message: error.message || 'Failed to delete notification', status },
      });
    }
  },

  /**
   * GET /api/notifications/unread-count
   * Get count of unread notifications
   */
  async getUnreadCount(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const result = await notificationService.getUnreadCount(req.user.userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to fetch unread count', status: 500 },
      });
    }
  },

  /**
   * POST /api/notifications/mark-all-read
   * Mark all notifications as read
   */
  async markAllAsRead(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const result = await notificationService.markAllAsRead(req.user.userId);

      res.status(200).json({
        success: true,
        data: result,
        message: `Marked ${result.count} notification(s) as read`,
      });
    } catch (error: any) {
      console.error('Error marking all as read:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to mark all as read', status: 500 },
      });
    }
  },
};
