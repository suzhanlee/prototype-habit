import api from './api';

// Category Analytics
export interface CategoryDistribution {
  category: string;
  completionCount: number;
  percentage: number;
  color: string;
}

export interface CategoryAnalyticsResponse {
  data: CategoryDistribution[];
  total: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

// Habit Comparison
export interface HabitComparison {
  habitId: number;
  habitName: string;
  completionRate: number;
  totalDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
}

export interface HabitComparisonResponse {
  data: HabitComparison[];
}

// Monthly Trends
export interface MonthlyTrend {
  month: string; // 'YYYY-MM'
  completionRate: number;
  totalCompletions: number;
  habitCount: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MonthlyTrendResponse {
  data: MonthlyTrend[];
}

// Top Habits
export interface TopHabit {
  habitId: number;
  habitName: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
  avgCompletionRate: number;
}

export interface TopHabitsResponse {
  data: TopHabit[];
}

// Weak Habits
export interface WeakHabit {
  habitId: number;
  habitName: string;
  completionRate: number;
  currentStreak: number;
  daysWithoutCompletion: number;
  lastCompletedDate: string;
  recommendation: string;
}

export interface WeakHabitsResponse {
  data: WeakHabit[];
}

// Completion Patterns (Heatmap)
export interface CompletionPattern {
  date: string; // 'YYYY-MM-DD'
  count: number;
  dayOfWeek: number;
  weekNumber: number;
  intensity: number;
}

export interface CompletionPatternResponse {
  data: CompletionPattern[];
}

// Time-based Analytics
export interface TimeAnalytics {
  hour: number;
  completions: number;
  habits: string[];
  successRate: number;
}

export interface TimeAnalyticsResponse {
  data: TimeAnalytics[];
  bestTime: {
    hour: number;
    completions: number;
    recommendation: string;
  };
}

// Consistency Score
export interface ConsistencyScore {
  score: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  description: string;
  breakdown: {
    completionRate: number;
    streakConsistency: number;
    activeDaysRatio: number;
    recentPerformance: number;
  };
}

// Streak Analytics
export interface StreakInfo {
  habitId: number;
  habitName: string;
  streak: number;
}

export interface StreakAnalytics {
  currentStreaks: StreakInfo[];
  longestStreaks: StreakInfo[];
  averageStreak: number;
  totalActiveStreaks: number;
  milestones: {
    week: number;
    month: number;
    quarter: number;
    year: number;
  };
}

// Predictive Insights
export interface AtRiskHabit {
  habitId: number;
  habitName: string;
  currentStreak: number;
  reason: string;
  action: string;
}

export interface FocusHabit {
  habitId: number;
  habitName: string;
  reason: string;
  suggestion: string;
}

export interface Recommendation {
  type: 'improvement' | 'warning' | 'success' | 'tip';
  title: string;
  description: string;
}

export interface PredictiveInsights {
  atRisk: AtRiskHabit[];
  shouldFocus: FocusHabit[];
  bestTime: {
    hour: number;
    reason: string;
  };
  recommendations: Recommendation[];
}

export const analyticsApi = {
  // Category Distribution
  async getCategoryDistribution(startDate?: string, endDate?: string): Promise<CategoryAnalyticsResponse> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get('/analytics/categories', { params });
    return response.data;
  },

  // Habit Comparison
  async getHabitComparison(startDate?: string, endDate?: string, limit = 10): Promise<HabitComparisonResponse> {
    const params: any = { limit };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get('/analytics/comparison', { params });
    return response.data;
  },

  // Monthly Trends
  async getMonthlyTrend(months = 12): Promise<MonthlyTrendResponse> {
    const response = await api.get('/analytics/trends/monthly', {
      params: { months },
    });
    return response.data;
  },

  // Top Habits
  async getTopHabits(limit = 5, days = 30): Promise<TopHabitsResponse> {
    const response = await api.get('/analytics/habits/top', {
      params: { limit, days },
    });
    return response.data;
  },

  // Weak Habits
  async getWeakHabits(limit = 5, threshold = 50): Promise<WeakHabitsResponse> {
    const response = await api.get('/analytics/habits/weak', {
      params: { limit, threshold },
    });
    return response.data;
  },

  // Completion Patterns
  async getCompletionPattern(days = 365): Promise<CompletionPatternResponse> {
    const response = await api.get('/analytics/patterns', {
      params: { days },
    });
    return response.data;
  },

  // Time-based Analytics
  async getTimeBasedAnalytics(days = 30): Promise<TimeAnalyticsResponse> {
    const response = await api.get('/analytics/time-based', {
      params: { days },
    });
    return response.data;
  },

  // Consistency Score
  async getConsistencyScore(days = 30): Promise<ConsistencyScore> {
    const response = await api.get('/analytics/consistency', {
      params: { days },
    });
    return response.data;
  },

  // Streak Analytics
  async getStreakAnalytics(): Promise<StreakAnalytics> {
    const response = await api.get('/analytics/streaks');
    return response.data;
  },

  // Predictive Insights
  async getPredictiveInsights(): Promise<PredictiveInsights> {
    const response = await api.get('/analytics/insights');
    return response.data;
  },

  // Export Data
  async exportData(format: 'csv' | 'json' = 'json', type: 'summary' | 'detailed' | 'all' = 'summary', startDate?: string, endDate?: string): Promise<Blob> {
    const params: any = { format, type };
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get('/analytics/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};