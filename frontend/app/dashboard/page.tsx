'use client';

import { useState, useEffect } from 'react';
import { dashboardApi, TodayOverview } from '@/lib/dashboard';
import { habitsApi } from '@/lib/habits';

export default function DashboardPage() {
  const [overview, setOverview] = useState<TodayOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dashboardApi.getTodayOverview();
        setOverview(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load overview');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCheckIn = async (habitId: number, isCompleted: boolean) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await habitsApi.checkIn(habitId, today, !isCompleted);

      // Reload data
      const data = await dashboardApi.getTodayOverview();
      setOverview(data);
    } catch (err: any) {
      setError(err.message || 'Failed to update habit');
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

  if (!overview) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">아직 습관이 없습니다.</p>
        <a href="/habits" className="btn-primary inline-block mt-4">
          첫 습관 만들기
        </a>
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

      {/* Completion Rate */}
      <div className="card p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {overview.todayDate}
        </h1>
        <p className="text-gray-600 mb-6 sm:mb-8">오늘의 습관 완료 현황</p>

        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <div>
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600">
                  {overview.completionRate}%
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  {overview.completedHabits}/{overview.totalHabits}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  오늘의 습관
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-500 h-3 rounded-full transition-all"
                    style={{
                      width: `${overview.completionRate}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="card">
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold">오늘의 습관</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {overview.habits.map((habit) => (
            <div
              key={habit.id}
              className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <button
                    onClick={() => handleCheckIn(habit.id, habit.isCompleted)}
                    className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      habit.isCompleted
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {habit.isCompleted && (
                      <span className="text-white font-bold text-sm sm:text-base">✓</span>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {habit.name}
                    </h3>
                    {habit.targetValue && (
                      <p className="text-sm text-gray-500 truncate">
                        목표: {habit.targetValue}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-lg sm:text-xl font-bold text-primary-600">
                    {habit.currentStreak}
                  </div>
                  <div className="text-xs text-gray-500">연속 달성</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {overview.totalHabits === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">아직 습관이 없습니다</p>
          <a href="/habits" className="btn-primary inline-block">
            첫 습관 만들기
          </a>
        </div>
      )}
    </div>
  );
}
