import { Request, Response } from 'express';
import { analyticsService } from '../services/analytics.service';

export const analyticsController = {
  /**
   * GET /api/analytics/categories
   * Get category distribution
   */
  async getCategoryDistribution(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { startDate, endDate } = req.query;

      // Default to last 30 days
      const end = endDate ? new Date(endDate as string) : new Date();
      const start = startDate ? new Date(startDate as string) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Validate dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          error: { message: 'Invalid date format', status: 400 },
        });
      }

      if (start > end) {
        return res.status(400).json({
          error: { message: 'Start date must be before end date', status: 400 },
        });
      }

      const result = await analyticsService.getCategoryDistribution(userId, start, end);
      res.json(result);
    } catch (error: any) {
      console.error('Error in getCategoryDistribution:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to get category distribution', status: 500 },
      });
    }
  },

  /**
   * GET /api/analytics/comparison
   * Compare habit performance
   */
  async getHabitComparison(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { startDate, endDate, limit } = req.query;

      const end = endDate ? new Date(endDate as string) : new Date();
      const start = startDate ? new Date(startDate as string) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
      const limitNum = limit ? parseInt(limit as string, 10) : 10;

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          error: { message: 'Invalid date format', status: 400 },
        });
      }

      const result = await analyticsService.getHabitComparison(userId, start, end, limitNum);
      res.json(result);
    } catch (error: any) {
      console.error('Error in getHabitComparison:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to get habit comparison', status: 500 },
      });
    }
  },

  /**
   * GET /api/analytics/trends/monthly
   * Get monthly trends
   */
  async getMonthlyTrend(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { months } = req.query;

      const monthsNum = months ? parseInt(months as string, 10) : 12;

      if (isNaN(monthsNum) || monthsNum < 1 || monthsNum > 24) {
        return res.status(400).json({
          error: { message: 'Months must be between 1 and 24', status: 400 },
        });
      }

      const result = await analyticsService.getMonthlyTrend(userId, monthsNum);
      res.json(result);
    } catch (error: any) {
      console.error('Error in getMonthlyTrend:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to get monthly trends', status: 500 },
      });
    }
  },

  /**
   * GET /api/analytics/habits/top
   * Get top performing habits
   */
  async getTopHabits(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { limit, days } = req.query;

      const limitNum = limit ? parseInt(limit as string, 10) : 5;
      const daysNum = days ? parseInt(days as string, 10) : 30;

      if (isNaN(limitNum) || limitNum < 1 || limitNum > 10) {
        return res.status(400).json({
          error: { message: 'Limit must be between 1 and 10', status: 400 },
        });
      }

      const result = await analyticsService.getTopHabits(userId, limitNum, daysNum);
      res.json(result);
    } catch (error: any) {
      console.error('Error in getTopHabits:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to get top habits', status: 500 },
      });
    }
  },

  /**
   * GET /api/analytics/habits/weak
   * Get weak habits needing attention
   */
  async getWeakHabits(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { limit, threshold } = req.query;

      const limitNum = limit ? parseInt(limit as string, 10) : 5;
      const thresholdNum = threshold ? parseInt(threshold as string, 10) : 50;

      const result = await analyticsService.getWeakHabits(userId, limitNum, thresholdNum);
      res.json(result);
    } catch (error: any) {
      console.error('Error in getWeakHabits:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to get weak habits', status: 500 },
      });
    }
  },

  /**
   * GET /api/analytics/patterns
   * Get completion patterns for heatmap
   */
  async getCompletionPattern(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { days } = req.query;

      const daysNum = days ? parseInt(days as string, 10) : 365;

      if (isNaN(daysNum) || daysNum < 1 || daysNum > 730) {
        return res.status(400).json({
          error: { message: 'Days must be between 1 and 730', status: 400 },
        });
      }

      const result = await analyticsService.getCompletionPattern(userId, daysNum);
      res.json(result);
    } catch (error: any) {
      console.error('Error in getCompletionPattern:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to get completion patterns', status: 500 },
      });
    }
  },

  /**
   * GET /api/analytics/time-based
   * Get time-based analytics
   */
  async getTimeBasedAnalytics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { days } = req.query;

      const daysNum = days ? parseInt(days as string, 10) : 30;

      const result = await analyticsService.getTimeBasedAnalytics(userId, daysNum);
      res.json(result);
    } catch (error: any) {
      console.error('Error in getTimeBasedAnalytics:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to get time-based analytics', status: 500 },
      });
    }
  },

  /**
   * GET /api/analytics/consistency
   * Get consistency score
   */
  async getConsistencyScore(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { days } = req.query;

      const daysNum = days ? parseInt(days as string, 10) : 30;

      const result = await analyticsService.getConsistencyScore(userId, daysNum);
      res.json(result);
    } catch (error: any) {
      console.error('Error in getConsistencyScore:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to get consistency score', status: 500 },
      });
    }
  },

  /**
   * GET /api/analytics/streaks
   * Get streak analytics
   */
  async getStreakAnalytics(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const result = await analyticsService.getStreakAnalytics(userId);
      res.json(result);
    } catch (error: any) {
      console.error('Error in getStreakAnalytics:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to get streak analytics', status: 500 },
      });
    }
  },

  /**
   * GET /api/analytics/insights
   * Get predictive insights
   */
  async getPredictiveInsights(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const result = await analyticsService.getPredictiveInsights(userId);
      res.json(result);
    } catch (error: any) {
      console.error('Error in getPredictiveInsights:', error);
      res.status(500).json({
        error: { message: error.message || 'Failed to get predictive insights', status: 500 },
      });
    }
  },
};
