import api from './api';

export interface TodayOverview {
  todayDate: string;
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
  habits: Array<{
    id: number;
    name: string;
    isCompleted: boolean;
    currentStreak: number;
    targetValue?: string;
    colorHex: string;
  }>;
}

export interface StatsResponse {
  period: string;
  totalCompletions: number;
  overallCompletionRate: number;
  longestStreak: number;
  mostCompletedHabit?: string;
  habitStreaks: Array<{
    habitId: number;
    habitName: string;
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
  }>;
}

export interface HeatmapData {
  data: Record<string, number>;
  startDate: string;
  endDate: string;
}

export interface WeeklyStatsItem {
  date: string;
  dayName: string;
  completedCount: number;
  totalHabits: number;
  completionRate: number;
}

export const dashboardApi = {
  async getTodayOverview() {
    const response = await api.get('/dashboard/today');
    return response.data.data;
  },

  async getStats(period = '30') {
    const response = await api.get('/dashboard/stats', {
      params: { period },
    });
    return response.data.data;
  },

  async getHeatmapData(months = 12) {
    const response = await api.get('/dashboard/heatmap', {
      params: { months },
    });
    return response.data.data;
  },

  async getWeeklyStats() {
    const response = await api.get('/dashboard/weekly');
    return response.data.data;
  },
};
