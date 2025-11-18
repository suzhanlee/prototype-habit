import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;

      // Validation
      if (!email || !username || !password) {
        return res.status(400).json({
          error: { message: 'Missing required fields', status: 400 },
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          error: { message: 'Password must be at least 8 characters', status: 400 },
        });
      }

      const result = await authService.register(email, username, password);
      res.status(201).json({ data: result, success: true });
    } catch (error: any) {
      res.status(400).json({
        error: { message: error.message, status: 400 },
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: { message: 'Email and password required', status: 400 },
        });
      }

      const result = await authService.login(email, password);
      res.status(200).json({ data: result, success: true });
    } catch (error: any) {
      res.status(401).json({
        error: { message: error.message || 'Authentication failed', status: 401 },
      });
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: { message: 'Refresh token required', status: 400 },
        });
      }

      const result = await authService.refreshToken(refreshToken);
      res.status(200).json({ data: result, success: true });
    } catch (error: any) {
      res.status(401).json({
        error: { message: error.message, status: 401 },
      });
    }
  },

  async getMe(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const user = await authService.getUser(req.user.userId);
      res.status(200).json({ data: user, success: true });
    } catch (error: any) {
      res.status(500).json({
        error: { message: error.message, status: 500 },
      });
    }
  },
};
