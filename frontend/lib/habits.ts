import api from './api';

export interface Habit {
  id: number;
  name: string;
  description?: string;
  category?: string;
  frequencyType: string;
  targetValue?: string;
  reminderEnabled: boolean;
  reminderTime?: string;
  colorHex: string;
  isActive: boolean;
  createdAt: string;
  streak?: {
    currentStreak: number;
    longestStreak: number;
  };
}

export interface HabitLog {
  id: number;
  habitId: number;
  loggedDate: string;
  isCompleted: boolean;
  notes?: string;
  completedAt?: string;
}

export const habitsApi = {
  async getHabits(includeInactive = false) {
    const response = await api.get('/habits', {
      params: { includeInactive },
    });
    return response.data.data;
  },

  async createHabit(data: Partial<Habit>) {
    const response = await api.post('/habits', data);
    return response.data.data;
  },

  async getHabit(id: number) {
    const response = await api.get(`/habits/${id}`);
    return response.data.data;
  },

  async updateHabit(id: number, data: Partial<Habit>) {
    const response = await api.put(`/habits/${id}`, data);
    return response.data.data;
  },

  async deleteHabit(id: number) {
    const response = await api.delete(`/habits/${id}`);
    return response.data.data;
  },

  async toggleActive(id: number, isActive: boolean) {
    const response = await api.patch(`/habits/${id}/toggle`, { isActive });
    return response.data.data;
  },

  // Habit Logs
  async checkIn(habitId: number, loggedDate: string, isCompleted = true, notes?: string) {
    const response = await api.post(`/habits/${habitId}/logs`, {
      loggedDate,
      isCompleted,
      notes,
    });
    return response.data.data;
  },

  async getLogs(habitId: number, startDate: string, endDate: string) {
    const response = await api.get(`/habits/${habitId}/logs`, {
      params: { startDate, endDate },
    });
    return response.data.data;
  },

  async updateLog(habitId: number, logId: number, data: Partial<HabitLog>) {
    const response = await api.put(`/habits/${habitId}/logs/${logId}`, data);
    return response.data.data;
  },

  async deleteLog(habitId: number, logId: number) {
    const response = await api.delete(`/habits/${habitId}/logs/${logId}`);
    return response.data.data;
  },
};
