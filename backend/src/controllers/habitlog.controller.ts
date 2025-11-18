import { Request, Response } from 'express';
import { habitLogService } from '../services/habitlog.service';

export const habitLogController = {
  async checkIn(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { id } = req.params;
      const { loggedDate, isCompleted, notes } = req.body;

      if (!loggedDate) {
        return res.status(400).json({
          error: { message: 'Logged date required', status: 400 },
        });
      }

      const log = await habitLogService.createLog(
        parseInt(id),
        req.user.userId,
        new Date(loggedDate),
        { isCompleted: isCompleted ?? true, notes }
      );

      res.status(201).json({ data: log, success: true });
    } catch (error: any) {
      res.status(400).json({
        error: { message: error.message, status: 400 },
      });
    }
  },

  async getLogs(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { id } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: { message: 'Start date and end date required', status: 400 },
        });
      }

      const logs = await habitLogService.getLogs(
        parseInt(id),
        req.user.userId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.status(200).json({ data: logs, success: true });
    } catch (error: any) {
      res.status(400).json({
        error: { message: error.message, status: 400 },
      });
    }
  },

  async updateLog(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { id, logId } = req.params;
      const { isCompleted, notes } = req.body;

      const log = await habitLogService.updateLog(
        parseInt(id),
        req.user.userId,
        parseInt(logId),
        { isCompleted, notes }
      );

      res.status(200).json({ data: log, success: true });
    } catch (error: any) {
      res.status(400).json({
        error: { message: error.message, status: 400 },
      });
    }
  },

  async deleteLog(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { id, logId } = req.params;

      const result = await habitLogService.deleteLog(
        parseInt(id),
        req.user.userId,
        parseInt(logId)
      );

      res.status(200).json({ data: result, success: true });
    } catch (error: any) {
      res.status(400).json({
        error: { message: error.message, status: 400 },
      });
    }
  },

  async getTodayLogs(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const logs = await habitLogService.getTodayLogs(req.user.userId);
      const habits = await Promise.all(
        logs.map(log => log.habit)
      );

      res.status(200).json({
        data: {
          todayDate: new Date().toISOString().split('T')[0],
          logs,
          totalHabits: habits.length,
          completedHabits: logs.filter(l => l.isCompleted).length,
        },
        success: true
      });
    } catch (error: any) {
      res.status(500).json({
        error: { message: error.message, status: 500 },
      });
    }
  },
};
