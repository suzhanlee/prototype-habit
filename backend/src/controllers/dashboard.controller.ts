import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export const dashboardController = {
  async getTodayOverview(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const data = await dashboardService.getTodayOverview(req.user.userId);
      res.status(200).json({ data, success: true });
    } catch (error: any) {
      res.status(500).json({
        error: { message: error.message, status: 500 },
      });
    }
  },

  async getStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const period = req.query.period as string || '30';
      const periodDays = parseInt(period);

      const data = await dashboardService.getStats(req.user.userId, periodDays);
      res.status(200).json({ data, success: true });
    } catch (error: any) {
      res.status(500).json({
        error: { message: error.message, status: 500 },
      });
    }
  },

  async getHeatmapData(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const months = req.query.months ? parseInt(req.query.months as string) : 12;
      const data = await dashboardService.getHeatmapData(req.user.userId, months);
      res.status(200).json({ data, success: true });
    } catch (error: any) {
      res.status(500).json({
        error: { message: error.message, status: 500 },
      });
    }
  },

  async getWeeklyStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const data = await dashboardService.getWeeklyStats(req.user.userId);
      res.status(200).json({ data, success: true });
    } catch (error: any) {
      res.status(500).json({
        error: { message: error.message, status: 500 },
      });
    }
  },
};
