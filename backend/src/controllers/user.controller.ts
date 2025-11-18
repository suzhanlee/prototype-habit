import { Request, Response } from 'express';
import { userService } from '../services/user.service';

export const userController = {
  /**
   * GET /api/users/settings - Get user settings
   */
  async getUserSettings(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const settings = await userService.getUserSettings(req.user.userId);
      res.status(200).json({ data: settings, success: true });
    } catch (error: any) {
      res.status(500).json({
        error: { message: error.message, status: 500 },
      });
    }
  },

  /**
   * PUT /api/users/profile - Update user profile
   */
  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { username, avatarUrl } = req.body;

      if (!username && avatarUrl === undefined) {
        return res.status(400).json({
          error: { message: 'At least one field must be provided', status: 400 },
        });
      }

      const updatedUser = await userService.updateProfile(req.user.userId, {
        username,
        avatarUrl,
      });

      res.status(200).json({ data: updatedUser, success: true });
    } catch (error: any) {
      const statusCode = error.message.includes('already exists') ? 409 : 400;
      res.status(statusCode).json({
        error: { message: error.message, status: statusCode },
      });
    }
  },

  /**
   * PUT /api/users/settings - Update user settings
   */
  async updateSettings(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { timezone, locale, pushNotificationEnabled } = req.body;

      if (
        timezone === undefined &&
        locale === undefined &&
        pushNotificationEnabled === undefined
      ) {
        return res.status(400).json({
          error: { message: 'At least one field must be provided', status: 400 },
        });
      }

      const updatedSettings = await userService.updateSettings(
        req.user.userId,
        {
          timezone,
          locale,
          pushNotificationEnabled,
        }
      );

      res.status(200).json({ data: updatedSettings, success: true });
    } catch (error: any) {
      res.status(400).json({
        error: { message: error.message, status: 400 },
      });
    }
  },

  /**
   * POST /api/users/password - Change password
   */
  async changePassword(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: {
            message: 'Current password and new password are required',
            status: 400,
          },
        });
      }

      const result = await userService.changePassword(
        req.user.userId,
        currentPassword,
        newPassword
      );

      res.status(200).json({ data: result, success: true });
    } catch (error: any) {
      const statusCode = error.message.includes('incorrect') ? 400 : 400;
      res.status(statusCode).json({
        error: { message: error.message, status: statusCode },
      });
    }
  },

  /**
   * DELETE /api/users/account - Delete user account
   */
  async deleteAccount(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { password, confirmation } = req.body;

      if (!password) {
        return res.status(400).json({
          error: { message: 'Password is required', status: 400 },
        });
      }

      if (confirmation !== 'DELETE') {
        return res.status(400).json({
          error: { message: 'Please type DELETE to confirm', status: 400 },
        });
      }

      const result = await userService.deleteAccount(req.user.userId, password);

      res.status(200).json({ data: result, success: true });
    } catch (error: any) {
      res.status(400).json({
        error: { message: error.message, status: 400 },
      });
    }
  },
};
