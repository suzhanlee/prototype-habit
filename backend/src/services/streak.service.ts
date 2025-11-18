import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const streakService = {
  async calculateStreak(habitId: number) {
    // Get all logs for the habit, ordered by date descending
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

    // Calculate streak from today backwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let streakStartedDate: Date | null = null;

    // Start from yesterday if today is not completed, or from today if it is
    let checkDate = new Date(today);
    const firstLogDate = new Date(logs[0].loggedDate);

    // Check if today is completed
    const todayLog = logs.find(log => {
      const logDate = new Date(log.loggedDate);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });

    if (!todayLog) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count consecutive days
    for (let i = 0; ; i++) {
      const currentCheckDate = new Date(checkDate);
      currentCheckDate.setDate(currentCheckDate.getDate() - i);
      currentCheckDate.setHours(0, 0, 0, 0);

      const logExists = logs.find(log => {
        const logDate = new Date(log.loggedDate);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === currentCheckDate.getTime();
      });

      if (logExists) {
        currentStreak++;
        if (!streakStartedDate) {
          streakStartedDate = new Date(currentCheckDate);
        }
      } else {
        break;
      }
    }

    // Get longest streak
    const streakData = await prisma.streak.findUnique({
      where: { habitId },
    });

    const longestStreak = Math.max(streakData?.longestStreak || 0, currentStreak);

    // Update streak
    await prisma.streak.update({
      where: { habitId },
      data: {
        currentStreak,
        longestStreak,
        lastCompletedDate: firstLogDate,
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
};
