import { PrismaClient } from '@prisma/client';
import { notificationService } from './notification.service';
import { webPushService } from './webpush.service';
import { streakService } from './streak.service';

const prisma = new PrismaClient();

export const habitLogService = {
  async createLog(habitId: number, userId: number, loggedDate: Date, data: {
    isCompleted?: boolean;
    notes?: string;
  }) {
    // Verify habit belongs to user
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
        deletedAt: null,
      },
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    // Check if log already exists
    const existingLog = await prisma.habitLog.findUnique({
      where: {
        habitId_loggedDate: {
          habitId,
          loggedDate: new Date(loggedDate.toISOString().split('T')[0]),
        },
      },
    });

    const isCompleted = data.isCompleted ?? true;
    const wasAlreadyCompleted = existingLog?.isCompleted || false;

    if (existingLog) {
      // Update existing log
      const updated = await prisma.habitLog.update({
        where: { id: existingLog.id },
        data: {
          isCompleted: data.isCompleted,
          notes: data.notes,
          completedAt: data.isCompleted ? new Date() : null,
        },
      });

      // If just completed (wasn't completed before), trigger notifications
      if (isCompleted && !wasAlreadyCompleted) {
        await this.triggerCompletionNotifications(userId, habitId, habit.name);
      }

      return updated;
    }

    // Create new log
    const log = await prisma.habitLog.create({
      data: {
        habitId,
        userId,
        loggedDate: new Date(loggedDate.toISOString().split('T')[0]),
        isCompleted: data.isCompleted ?? true,
        notes: data.notes,
        completedAt: data.isCompleted ? new Date() : null,
      },
    });

    // If completed, trigger notifications
    if (isCompleted) {
      await this.triggerCompletionNotifications(userId, habitId, habit.name);
    }

    return log;
  },

  /**
   * Trigger notifications when a habit is completed
   */
  async triggerCompletionNotifications(userId: number, habitId: number, habitName: string) {
    try {
      // Create habit completion notification
      const notification = await notificationService.createHabitCompletionNotification(
        userId,
        habitId,
        habitName
      );

      // Send push notification
      await webPushService.sendPushNotification(
        userId,
        notification.title,
        notification.body || ''
      );

      // Only recalculate streak if necessary (optimization to prevent unnecessary calculations)
      const shouldRecalculate = await streakService.shouldRecalculateStreak(habitId);
      if (shouldRecalculate) {
        await streakService.calculateStreak(habitId);
      }

      // Get updated streak
      const streak = await streakService.getStreak(habitId);

      // Check if this is a streak milestone and create notification if needed
      if (streak && streak.currentStreak > 0) {
        const streakNotification = await notificationService.createStreakNotification(
          userId,
          habitId,
          habitName,
          streak.currentStreak
        );

        // Send push notification for milestone streaks
        if (streakNotification) {
          await webPushService.sendPushNotification(
            userId,
            streakNotification.title,
            streakNotification.body || ''
          );
        }
      }
    } catch (error) {
      // Don't fail the log creation if notification fails
      console.error('Error creating completion notifications:', error);
    }
  },

  async getLog(habitId: number, userId: number, logId: number) {
    const log = await prisma.habitLog.findFirst({
      where: {
        id: logId,
        habitId,
        userId,
      },
    });

    if (!log) {
      throw new Error('Log not found');
    }

    return log;
  },

  async getLogs(habitId: number, userId: number, startDate: Date, endDate: Date) {
    const habit = await prisma.habit.findFirst({
      where: {
        id: habitId,
        userId,
        deletedAt: null,
      },
    });

    if (!habit) {
      throw new Error('Habit not found');
    }

    const logs = await prisma.habitLog.findMany({
      where: {
        habitId,
        userId,
        loggedDate: {
          gte: new Date(startDate.toISOString().split('T')[0]),
          lte: new Date(endDate.toISOString().split('T')[0]),
        },
      },
      orderBy: { loggedDate: 'asc' },
    });

    return logs;
  },

  async updateLog(habitId: number, userId: number, logId: number, data: {
    isCompleted?: boolean;
    notes?: string;
  }) {
    const log = await this.getLog(habitId, userId, logId);

    const updated = await prisma.habitLog.update({
      where: { id: logId },
      data: {
        isCompleted: data.isCompleted,
        notes: data.notes,
        completedAt: data.isCompleted ? new Date() : null,
      },
    });

    return updated;
  },

  async deleteLog(habitId: number, userId: number, logId: number) {
    const log = await this.getLog(habitId, userId, logId);

    await prisma.habitLog.delete({
      where: { id: logId },
    });

    return { success: true, message: 'Log deleted' };
  },

  async getTodayLogs(userId: number) {
    const today = new Date().toISOString().split('T')[0];

    const logs = await prisma.habitLog.findMany({
      where: {
        userId,
        loggedDate: new Date(today),
      },
      include: {
        habit: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return logs;
  },
};
