import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const streakService = {
  async calculateStreak(habitId: number) {
    // Get all completed logs for the habit, ordered by date descending
    const logs = await prisma.habitLog.findMany({
      where: {
        habitId,
        isCompleted: true,
      },
      orderBy: { loggedDate: 'desc' },
      select: { loggedDate: true },
    });

    if (logs.length === 0) {
      // No completed logs
      await prisma.streak.update({
        where: { habitId },
        data: {
          currentStreak: 0,
          lastCompletedDate: null,
          streakStartedDate: null,
        },
      });
      return;
    }

    // Convert logs to date set for efficient lookup
    const completedDates = new Set(
      logs.map(log => {
        const date = new Date(log.loggedDate);
        return date.toISOString().split('T')[0]; // Normalize to YYYY-MM-DD
      })
    );

    // Get today and normalize
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    let currentStreak = 0;
    let streakStartedDate: Date | null = null;
    let lastCompletedDate = new Date(logs[0].loggedDate);

    // Check if today is completed
    const isTodayCompleted = completedDates.has(todayStr);

    // Start checking from today if completed, otherwise from yesterday
    let checkDate = new Date(today);
    if (!isTodayCompleted) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count consecutive days backwards from most recent completion
    while (true) {
      const checkDateStr = checkDate.toISOString().split('T')[0];

      if (completedDates.has(checkDateStr)) {
        currentStreak++;
        if (!streakStartedDate) {
          streakStartedDate = new Date(checkDate);
        }
        // Move to previous day
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Break the streak - missing day found
        break;
      }
    }

    // Get current longest streak from database
    const streakData = await prisma.streak.findUnique({
      where: { habitId },
    });

    const longestStreak = Math.max(streakData?.longestStreak || 0, currentStreak);

    // Update streak record
    await prisma.streak.update({
      where: { habitId },
      data: {
        currentStreak,
        longestStreak,
        lastCompletedDate,
        streakStartedDate,
      },
    });
  },

  async getStreak(habitId: number) {
    const streak = await prisma.streak.findUnique({
      where: { habitId },
    });

    return streak;
  },

  async getStreaks(userId: number) {
    const streaks = await prisma.streak.findMany({
      where: {
        userId,
        habit: {
          deletedAt: null,
        },
      },
      include: {
        habit: true,
      },
      orderBy: { currentStreak: 'desc' },
    });

    return streaks;
  },

  async resetStreak(habitId: number) {
    await prisma.streak.update({
      where: { habitId },
      data: {
        currentStreak: 0,
        streakStartedDate: null,
      },
    });
  },

  /**
   * Check if streak recalculation is needed for a habit
   * This prevents unnecessary recalculations on every completion
   */
  async shouldRecalculateStreak(habitId: number): Promise<boolean> {
    const streak = await prisma.streak.findUnique({
      where: { habitId },
    });

    if (!streak) {
      return true; // No streak record, need to calculate
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    // Check if today has a completion
    const todayLog = await prisma.habitLog.findFirst({
      where: {
        habitId,
        isCompleted: true,
        loggedDate: new Date(todayStr),
      },
    });

    // If streak.lastCompletedDate is not today or yesterday, we might need recalculation
    if (streak.lastCompletedDate) {
      const lastCompletedDate = new Date(streak.lastCompletedDate);
      lastCompletedDate.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      // If last completion is older than yesterday, we need to recalculate
      if (lastCompletedDate < yesterday) {
        return true;
      }

      // If today is completed but lastCompletedDate is not today, we need to recalculate
      if (todayLog && lastCompletedDate.getTime() !== today.getTime()) {
        return true;
      }
    }

    return false; // No recalculation needed
  },
};
