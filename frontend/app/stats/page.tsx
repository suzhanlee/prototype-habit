'use client';

import { useState, useEffect } from 'react';
import { dashboardApi, StatsResponse, WeeklyStatsItem } from '@/lib/dashboard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStatsItem[]>([]);
  const [period, setPeriod] = useState('30');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, [period]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const [statsData, weeklyData] = await Promise.all([
        dashboardApi.getStats(period),
        dashboardApi.getWeeklyStats(),
      ]);
      setStats(statsData);
      setWeeklyStats(weeklyData);
    } catch (err: any) {
      setError(err.message || 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">통계가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">통계</h1>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="input"
          >
            <option value="7">지난 7일</option>
            <option value="30">지난 30일</option>
            <option value="90">지난 90일</option>
            <option value="180">지난 180일</option>
            <option value="365">지난 1년</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="text-gray-600 text-sm font-medium mb-2">
            전체 완료율
          </div>
          <div className="text-3xl font-bold text-primary-600">
            {stats.overallCompletionRate}%
          </div>
        </div>

        <div className="card p-6">
          <div className="text-gray-600 text-sm font-medium mb-2">
            총 완료 수
          </div>
          <div className="text-3xl font-bold text-green-600">
            {stats.totalCompletions}
          </div>
        </div>

        <div className="card p-6">
          <div className="text-gray-600 text-sm font-medium mb-2">
            최장 Streak
          </div>
          <div className="text-3xl font-bold text-orange-600">
            {stats.longestStreak}
          </div>
        </div>

        <div className="card p-6">
          <div className="text-gray-600 text-sm font-medium mb-2">
            가장 완료한 습관
          </div>
          <div className="text-lg font-bold text-gray-900">
            {stats.mostCompletedHabit || '-'}
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      {weeklyStats.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6">주간 완료율</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dayName" />
              <YAxis />
              <Tooltip
                formatter={(value) => `${value}%`}
                labelFormatter={(label) => `${label}`}
              />
              <Line
                type="monotone"
                dataKey="completionRate"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Habits Streaks */}
      {stats.habitStreaks.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6">습관별 Streak</h2>
          <div className="space-y-4">
            {stats.habitStreaks.map((habit) => (
              <div key={habit.habitId} className="border-b border-gray-200 pb-4 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">
                    {habit.habitName}
                  </h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">
                      {habit.currentStreak}
                    </div>
                    <div className="text-xs text-gray-500">
                      최장: {habit.longestStreak}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>완료: {habit.totalCompletions}회</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{
                      width: `${(habit.totalCompletions / (parseInt(period) || 30)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.habitStreaks.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-gray-600">아직 습관 기록이 없습니다</p>
        </div>
      )}
    </div>
  );
}
