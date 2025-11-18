import { Request, Response } from 'express';
import { habitService } from '../services/habit.service';

export const habitController = {
  async createHabit(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { name, description, category, frequencyType, frequencyDetail, targetValue, reminderEnabled, reminderTime, colorHex } = req.body;

      if (!name || !frequencyType) {
        return res.status(400).json({
          error: { message: 'Name and frequency type required', status: 400 },
        });
      }

      const habit = await habitService.createHabit(req.user.userId, {
        name,
        description,
        category,
        frequencyType,
        frequencyDetail,
        targetValue,
        reminderEnabled: reminderEnabled ?? true,
        reminderTime,
        colorHex,
      });

      res.status(201).json({ data: habit, success: true });
    } catch (error: any) {
      res.status(400).json({
        error: { message: error.message, status: 400 },
      });
    }
  },

  async getHabits(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const includeInactive = req.query.includeInactive === 'true';
      const habits = await habitService.getHabits(req.user.userId, includeInactive);

      res.status(200).json({ data: habits, success: true });
    } catch (error: any) {
      res.status(500).json({
        error: { message: error.message, status: 500 },
      });
    }
  },

  async getHabit(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { id } = req.params;
      const habit = await habitService.getHabit(parseInt(id), req.user.userId);

      res.status(200).json({ data: habit, success: true });
    } catch (error: any) {
      res.status(404).json({
        error: { message: error.message, status: 404 },
      });
    }
  },

  async updateHabit(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { id } = req.params;
      const habit = await habitService.updateHabit(parseInt(id), req.user.userId, req.body);

      res.status(200).json({ data: habit, success: true });
    } catch (error: any) {
      res.status(400).json({
        error: { message: error.message, status: 400 },
      });
    }
  },

  async deleteHabit(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { id } = req.params;
      const result = await habitService.deleteHabit(parseInt(id), req.user.userId);

      res.status(200).json({ data: result, success: true });
    } catch (error: any) {
      res.status(400).json({
        error: { message: error.message, status: 400 },
      });
    }
  },

  async toggleActive(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: { message: 'Unauthorized', status: 401 },
        });
      }

      const { id } = req.params;
      const { isActive } = req.body;

      const habit = await habitService.toggleActive(parseInt(id), req.user.userId, isActive);

      res.status(200).json({ data: habit, success: true });
    } catch (error: any) {
      res.status(400).json({
        error: { message: error.message, status: 400 },
      });
    }
  },
};
