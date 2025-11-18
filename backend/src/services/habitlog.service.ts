import { PrismaClient } from '@prisma/client';

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

    return log;
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
