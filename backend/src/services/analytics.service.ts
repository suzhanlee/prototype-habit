import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
  '운동': '#3B82F6',
  '독서': '#10B981',
  '명상': '#8B5CF6',
  '학습': '#F59E0B',
  '건강': '#EF4444',
  '기타': '#6B7280',
};

export const analyticsService = {
  /**
   * Get category-wise completion distribution
   */
  async getCategoryDistribution(userId: number, startDate: Date, endDate: Date) {
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
            isCompleted: true,
          },
        },
      },
    });

    // Group by category
    const categoryData: Record<string, number> = {};
    let totalCompletions = 0;

    habits.forEach(habit => {
      const count = habit.logs.length;
      categoryData[habit.category] = (categoryData[habit.category] || 0) + count;
      totalCompletions += count;
    });

    // Convert to array with percentages
    const data = Object.entries(categoryData).map(([category, completionCount]) => ({
      category,
      completionCount,
      percentage: totalCompletions > 0 ? Math.round((completionCount / totalCompletions) * 1000) / 10 : 0,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS['기타'],
    }));

    return {
      data,
      total: totalCompletions,
      period: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
    };
  },

  /**
   * Compare habit performance
   */
  async getHabitComparison(userId: number, startDate: Date, endDate: Date, limit: number = 10) {
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

    // Calculate total days in period
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const comparison = habits.map(habit => {
      const completedDays = habit.logs.filter(log => log.isCompleted).length;
      const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 1000) / 10 : 0;

      return {
        habitId: habit.id,
        habitName: habit.name,
        completionRate,
        totalDays,
        completedDays,
        currentStreak: habit.streak?.currentStreak || 0,
        longestStreak: habit.streak?.longestStreak || 0,
      };
    });

    // Sort by completion rate descending
    comparison.sort((a, b) => b.completionRate - a.completionRate);

    return {
      data: comparison.slice(0, limit),
    };
  },

  /**
   * Get monthly completion trends
   */
  async getMonthlyTrend(userId: number, months: number = 12) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

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
            isCompleted: true,
          },
        },
      },
    });

    // Group by month
    const monthlyData: Record<string, { completions: number; habitCount: number }> = {};

    habits.forEach(habit => {
      habit.logs.forEach(log => {
        const monthKey = log.loggedDate.toISOString().substring(0, 7); // YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { completions: 0, habitCount: 0 };
        }
        monthlyData[monthKey].completions++;
      });
    });

    // Calculate habit count per month
    const monthKeys = Object.keys(monthlyData).sort();
    monthKeys.forEach(monthKey => {
      const [year, month] = monthKey.split('-').map(Number);
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0);

      const activeHabits = habits.filter(habit => {
        const created = new Date(habit.createdAt);
        return created <= monthEnd;
      });

      monthlyData[monthKey].habitCount = activeHabits.length;
    });

    // Convert to array with completion rates
    const data = monthKeys.map((month, index) => {
      const { completions, habitCount } = monthlyData[month];
      const daysInMonth = new Date(
        parseInt(month.split('-')[0]),
        parseInt(month.split('-')[1]),
        0
      ).getDate();
      const expectedCompletions = habitCount * daysInMonth;
      const completionRate = expectedCompletions > 0
        ? Math.round((completions / expectedCompletions) * 1000) / 10
        : 0;

      // Determine trend
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (index > 0) {
        const prevRate = monthlyData[monthKeys[index - 1]]
          ? Math.round((monthlyData[monthKeys[index - 1]].completions /
              (monthlyData[monthKeys[index - 1]].habitCount * daysInMonth)) * 1000) / 10
          : 0;
        if (completionRate > prevRate + 5) trend = 'up';
        else if (completionRate < prevRate - 5) trend = 'down';
      }

      return {
        month,
        completionRate,
        totalCompletions: completions,
        habitCount,
        trend,
      };
    });

    return { data };
  },

  /**
   * Get top performing habits
   */
  async getTopHabits(userId: number, limit: number = 5, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

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

    const habitStats = habits.map(habit => {
      const completedDays = habit.logs.filter(log => log.isCompleted).length;
      const completionRate = days > 0 ? Math.round((completedDays / days) * 1000) / 10 : 0;

      return {
        habitId: habit.id,
        habitName: habit.name,
        currentStreak: habit.streak?.currentStreak || 0,
        longestStreak: habit.streak?.longestStreak || 0,
        totalCompletions: completedDays,
        completionRate,
        avgCompletionRate: completionRate,
      };
    });

    // Sort by: completion rate (60%), current streak (30%), total completions (10%)
    habitStats.sort((a, b) => {
      const scoreA = (a.completionRate * 0.6) + (a.currentStreak * 0.3) + (a.totalCompletions * 0.1);
      const scoreB = (b.completionRate * 0.6) + (b.currentStreak * 0.3) + (b.totalCompletions * 0.1);
      return scoreB - scoreA;
    });

    return {
      data: habitStats.slice(0, limit),
    };
  },

  /**
   * Get habits needing attention
   */
  async getWeakHabits(userId: number, limit: number = 5, threshold: number = 50) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date();
    const today = new Date().toISOString().split('T')[0];

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
              gte: startDate,
              lte: endDate,
            },
          },
          orderBy: {
            loggedDate: 'desc',
          },
        },
        streak: true,
      },
    });

    const weakHabits = habits
      .map(habit => {
        const completedDays = habit.logs.filter(log => log.isCompleted).length;
        const completionRate = Math.round((completedDays / 30) * 1000) / 10;

        const lastCompletedLog = habit.logs.find(log => log.isCompleted);
        const lastCompletedDate = lastCompletedLog?.loggedDate.toISOString().split('T')[0];

        let daysWithoutCompletion = 0;
        if (lastCompletedDate) {
          const lastDate = new Date(lastCompletedDate);
          const todayDate = new Date(today);
          daysWithoutCompletion = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        } else {
          daysWithoutCompletion = 30;
        }

        return {
          habitId: habit.id,
          habitName: habit.name,
          completionRate,
          currentStreak: habit.streak?.currentStreak || 0,
          daysWithoutCompletion,
          lastCompletedDate: lastCompletedDate || null,
          recommendation: completionRate < 30
            ? 'Try setting a smaller, more achievable goal'
            : 'Schedule this habit at your most productive time',
        };
      })
      .filter(habit => habit.completionRate < threshold)
      .sort((a, b) => a.completionRate - b.completionRate);

    return {
      data: weakHabits.slice(0, limit),
    };
  },

  /**
   * Get completion pattern for heatmap
   */
  async getCompletionPattern(userId: number, days: number = 365) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

    const logs = await prisma.habitLog.findMany({
      where: {
        userId,
        loggedDate: {
          gte: startDate,
          lte: endDate,
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

    // Generate data for each day
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const count = completionsByDate[dateStr] || 0;

      // Calculate intensity (0-4)
      let intensity = 0;
      if (count > 0) intensity = 1;
      if (count >= 3) intensity = 2;
      if (count >= 5) intensity = 3;
      if (count >= 7) intensity = 4;

      data.push({
        date: dateStr,
        count,
        dayOfWeek: date.getDay(),
        weekNumber: Math.floor(i / 7),
        intensity,
      });
    }

    return { data };
  },

  /**
   * Get time-based analytics
   */
  async getTimeBasedAnalytics(userId: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

    const logs = await prisma.habitLog.findMany({
      where: {
        userId,
        loggedDate: {
          gte: startDate,
          lte: endDate,
        },
        isCompleted: true,
        completedAt: {
          not: null,
        },
      },
      select: {
        completedAt: true,
        habit: {
          select: {
            name: true,
          },
        },
      },
    });

    // Group by hour
    const hourlyData: Record<number, { completions: number; habits: Set<string> }> = {};
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = { completions: 0, habits: new Set() };
    }

    logs.forEach(log => {
      if (log.completedAt) {
        const hour = new Date(log.completedAt).getHours();
        hourlyData[hour].completions++;
        hourlyData[hour].habits.add(log.habit.name);
      }
    });

    const data = Object.entries(hourlyData).map(([hour, info]) => ({
      hour: parseInt(hour),
      completions: info.completions,
      habits: Array.from(info.habits),
      successRate: info.completions > 0 ? Math.round((info.completions / logs.length) * 1000) / 10 : 0,
    }));

    // Find best time
    const bestTimeData = data.reduce((best, current) =>
      current.completions > best.completions ? current : best
    , data[0]);

    return {
      data,
      bestTime: {
        hour: bestTimeData.hour,
        completions: bestTimeData.completions,
        recommendation: `Schedule habits around ${bestTimeData.hour}:00 for best results`,
      },
    };
  },

  /**
   * Calculate consistency score
   */
  async getConsistencyScore(userId: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

    // Get previous period for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);

    const [currentHabits, previousHabits] = await Promise.all([
      prisma.habit.findMany({
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
      }),
      prisma.habit.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        include: {
          logs: {
            where: {
              loggedDate: {
                gte: prevStartDate,
                lt: startDate,
              },
            },
          },
        },
      }),
    ]);

    // Calculate current period metrics
    const totalHabits = currentHabits.length;
    if (totalHabits === 0) {
      return {
        score: 0,
        previousScore: 0,
        trend: 'neutral' as const,
        change: 0,
        description: 'No habits tracked yet',
        breakdown: {
          completionRate: 0,
          streakConsistency: 0,
          activeDaysRatio: 0,
          recentPerformance: 0,
        },
      };
    }

    // 1. Completion Rate (40%)
    const totalCompletions = currentHabits.reduce((sum, h) =>
      sum + h.logs.filter(l => l.isCompleted).length, 0
    );
    const expectedCompletions = totalHabits * days;
    const completionRate = expectedCompletions > 0
      ? (totalCompletions / expectedCompletions) * 100
      : 0;

    // 2. Streak Consistency (30%)
    const avgStreak = currentHabits.reduce((sum, h) =>
      sum + (h.streak?.currentStreak || 0), 0
    ) / totalHabits;
    const streakConsistency = Math.min((avgStreak / 7) * 100, 100);

    // 3. Active Days Ratio (20%)
    const uniqueDays = new Set(
      currentHabits.flatMap(h =>
        h.logs.filter(l => l.isCompleted).map(l => l.loggedDate.toISOString().split('T')[0])
      )
    ).size;
    const activeDaysRatio = (uniqueDays / days) * 100;

    // 4. Recent Performance (10%) - last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const recentCompletions = currentHabits.reduce((sum, h) =>
      sum + h.logs.filter(l =>
        l.isCompleted && new Date(l.loggedDate) >= last7Days
      ).length, 0
    );
    const recentExpected = totalHabits * 7;
    const recentPerformance = recentExpected > 0
      ? (recentCompletions / recentExpected) * 100
      : 0;

    // Calculate weighted score
    const score = Math.round(
      (completionRate * 0.4) +
      (streakConsistency * 0.3) +
      (activeDaysRatio * 0.2) +
      (recentPerformance * 0.1)
    );

    // Calculate previous score for comparison
    const prevCompletions = previousHabits.reduce((sum, h) =>
      sum + h.logs.filter(l => l.isCompleted).length, 0
    );
    const prevExpected = previousHabits.length * days;
    const previousScore = prevExpected > 0
      ? Math.round((prevCompletions / prevExpected) * 100)
      : 0;

    // Determine trend
    const change = score - previousScore;
    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    if (change > 5) trend = 'up';
    else if (change < -5) trend = 'down';

    // Description
    let description = 'Keep going!';
    if (score >= 90) description = 'Excellent consistency!';
    else if (score >= 75) description = 'Great job!';
    else if (score >= 60) description = 'Good progress!';
    else if (score >= 40) description = 'Room for improvement';
    else description = 'Let\'s build momentum';

    return {
      score,
      previousScore,
      trend,
      change,
      description,
      breakdown: {
        completionRate: Math.round(completionRate),
        streakConsistency: Math.round(streakConsistency),
        activeDaysRatio: Math.round(activeDaysRatio),
        recentPerformance: Math.round(recentPerformance),
      },
    };
  },

  /**
   * Get comprehensive streak analytics
   */
  async getStreakAnalytics(userId: number) {
    const habits = await prisma.habit.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        streak: true,
      },
    });

    const currentStreaks = habits
      .filter(h => h.streak && h.streak.currentStreak > 0)
      .map(h => ({
        habitId: h.id,
        habitName: h.name,
        streak: h.streak!.currentStreak,
      }))
      .sort((a, b) => b.streak - a.streak);

    const longestStreaks = habits
      .filter(h => h.streak && h.streak.longestStreak > 0)
      .map(h => ({
        habitId: h.id,
        habitName: h.name,
        streak: h.streak!.longestStreak,
      }))
      .sort((a, b) => b.streak - a.streak);

    const totalStreaks = habits.reduce((sum, h) =>
      sum + (h.streak?.currentStreak || 0), 0
    );
    const averageStreak = habits.length > 0
      ? Math.round((totalStreaks / habits.length) * 10) / 10
      : 0;

    // Calculate milestones
    const milestones = {
      week: habits.filter(h => h.streak && h.streak.longestStreak >= 7).length,
      month: habits.filter(h => h.streak && h.streak.longestStreak >= 30).length,
      quarter: habits.filter(h => h.streak && h.streak.longestStreak >= 90).length,
      year: habits.filter(h => h.streak && h.streak.longestStreak >= 365).length,
    };

    return {
      currentStreaks,
      longestStreaks,
      averageStreak,
      totalActiveStreaks: currentStreaks.length,
      milestones,
    };
  },

  /**
   * Get predictive insights and recommendations
   */
  async getPredictiveInsights(userId: number) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);

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
              gte: last7Days,
            },
          },
          orderBy: {
            loggedDate: 'desc',
          },
        },
        streak: true,
      },
    });

    // 1. At-risk habits (good streak but missed yesterday)
    const atRisk = habits
      .filter(h => {
        const currentStreak = h.streak?.currentStreak || 0;
        const hasYesterdayLog = h.logs.some(l =>
          l.loggedDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0] &&
          l.isCompleted
        );
        return currentStreak >= 7 && !hasYesterdayLog;
      })
      .map(h => ({
        habitId: h.id,
        habitName: h.name,
        currentStreak: h.streak!.currentStreak,
        reason: 'No completion yesterday',
        action: 'Complete today to maintain streak',
      }));

    // 2. Should focus (low completion rate)
    const shouldFocus = habits
      .filter(h => {
        const completedLogs = h.logs.filter(l => l.isCompleted).length;
        const completionRate = h.logs.length > 0 ? completedLogs / h.logs.length : 0;
        return completionRate < 0.5;
      })
      .map(h => {
        const completedLogs = h.logs.filter(l => l.isCompleted).length;
        const completionRate = h.logs.length > 0
          ? Math.round((completedLogs / h.logs.length) * 100)
          : 0;

        return {
          habitId: h.id,
          habitName: h.name,
          completionRate,
          reason: 'Completion rate below 50%',
          suggestion: completionRate < 30
            ? 'Try a smaller goal to rebuild momentum'
            : 'Schedule at your most productive time',
        };
      })
      .slice(0, 3);

    // 3. Best time recommendation
    const logsWithTime = await prisma.habitLog.findMany({
      where: {
        userId,
        completedAt: {
          not: null,
        },
        isCompleted: true,
      },
      select: {
        completedAt: true,
      },
    });

    const hourCounts: Record<number, number> = {};
    logsWithTime.forEach(log => {
      if (log.completedAt) {
        const hour = new Date(log.completedAt).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });

    const bestHour = Object.entries(hourCounts).reduce(
      (best, [hour, count]) => count > best.count ? { hour: parseInt(hour), count } : best,
      { hour: 7, count: 0 }
    );

    // 4. General recommendations
    const recommendations = [];

    // Recommendation: Group similar habits
    const categoryGroups = habits.reduce((acc, h) => {
      acc[h.category] = (acc[h.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const largestCategory = Object.entries(categoryGroups).reduce(
      (best, [cat, count]) => count > best.count ? { category: cat, count } : best,
      { category: '', count: 0 }
    );

    if (largestCategory.count > 1) {
      recommendations.push({
        type: 'improvement',
        title: 'Group similar habits',
        description: `You have ${largestCategory.count} ${largestCategory.category} habits. Try completing them together!`,
      });
    }

    // Recommendation: Best streak
    const bestStreak = habits.reduce((best, h) => {
      const streak = h.streak?.currentStreak || 0;
      return streak > best.streak ? { habit: h.name, streak } : best;
    }, { habit: '', streak: 0 });

    if (bestStreak.streak >= 7) {
      recommendations.push({
        type: 'success',
        title: 'Amazing streak!',
        description: `${bestStreak.habit} is at ${bestStreak.streak} days. Keep it going!`,
      });
    }

    // Recommendation: Consistency tip
    if (habits.length > 5) {
      recommendations.push({
        type: 'improvement',
        title: 'Focus on core habits',
        description: 'Consider focusing on 3-5 most important habits first',
      });
    }

    return {
      atRisk,
      shouldFocus,
      bestTime: {
        hour: bestHour.hour,
        reason: bestHour.count > 0
          ? 'Highest success rate at this time'
          : 'No completion time data yet',
      },
      recommendations,
    };
  },
};
