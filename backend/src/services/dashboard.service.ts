import { PrismaClient } from '@prisma/client';
import { streakService } from './streak.service';

const prisma = new PrismaClient();

export const dashboardService = {
  async getTodayOverview(userId: number) {
    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date(today);

    // Get all active habits
    const habits = await prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        logs: {
          where: {
            loggedDate: todayDate,
          },
        },
        streak: true,
      },
    });

    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.logs.length > 0 && h.logs[0].isCompleted).length;
    const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    const habitSummaries = habits.map(h => ({
      id: h.id,
      name: h.name,
      isCompleted: h.logs.length > 0 ? h.logs[0].isCompleted : false,
      currentStreak: h.streak?.currentStreak || 0,
      targetValue: h.targetValue,
      colorHex: h.colorHex,
    }));

    return {
      todayDate: today,
      totalHabits,
      completedHabits,
      completionRate,
      habits: habitSummaries,
    };
  },

  async getStats(userId: number, periodDays: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);
    const endDate = new Date();

    // Get habits
    const habits = await prisma.habit.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        logs: {
          where: {
            loggedDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
        streak: true,
      },
    });

    // Calculate stats
    const totalCompletions = habits.reduce((sum, h) => sum + h.logs.filter(l => l.isCompleted).length, 0);
    const expectedCompletions = habits.length * periodDays;
    const overallCompletionRate = expectedCompletions > 0 ? Math.round((totalCompletions / expectedCompletions) * 100) : 0;

    // Find longest streak
    let longestStreak = 0;
    habits.forEach(h => {
      if (h.streak && h.streak.longestStreak > longestStreak) {
        longestStreak = h.streak.longestStreak;
      }
    });

    // Most completed habit
    const habitCompletionCounts = habits.map(h => ({
      habitId: h.id,
      habitName: h.name,
      completions: h.logs.filter(l => l.isCompleted).length,
    })).sort((a, b) => b.completions - a.completions);

    const mostCompletedHabit = habitCompletionCounts[0]?.habitName || null;

    const habitStreaks = habits.map(h => ({
      habitId: h.id,
      habitName: h.name,
      currentStreak: h.streak?.currentStreak || 0,
      longestStreak: h.streak?.longestStreak || 0,
      totalCompletions: h.logs.filter(l => l.isCompleted).length,
    }));

    return {
      period: `${periodDays} days`,
      totalCompletions,
      overallCompletionRate,
      longestStreak,
      mostCompletedHabit,
      habitStreaks,
    };
  },

  async getHeatmapData(userId: number, months: number = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const logs = await prisma.habitLog.findMany({
      where: {
        userId,
        loggedDate: {
          gte: startDate,
        },
        isCompleted: true,
      },
      select: {
        loggedDate: true,
      },
    });

    // Count completions by date
    const completionsByDate: Record<string, number> = {};
    logs.forEach(log => {
      const dateStr = log.loggedDate.toISOString().split('T')[0];
      completionsByDate[dateStr] = (completionsByDate[dateStr] || 0) + 1;
    });

    return {
      data: completionsByDate,
      startDate,
      endDate: new Date(),
    };
  },

  async getWeeklyStats(userId: number) {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const habits = await prisma.habit.findMany({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
      },
      include: {
        logs: {
          where: {
            loggedDate: {
              gte: weekStart,
              lte: today,
            },
          },
        },
      },
    });

    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const completedCount = habits.reduce((sum, h) => {
        const log = h.logs.find(l => l.loggedDate.toISOString().split('T')[0] === dateStr);
        return sum + (log && log.isCompleted ? 1 : 0);
      }, 0);

      weeklyData.push({
        date: dateStr,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        completedCount,
        totalHabits: habits.length,
        completionRate: habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0,
      });
    }

    return weeklyData;
  },
};
