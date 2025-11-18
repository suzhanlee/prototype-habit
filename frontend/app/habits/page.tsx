'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { habitsApi, Habit } from '@/lib/habits';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '기타',
    frequencyType: 'daily',
    targetValue: '',
    reminderEnabled: true,
    reminderTime: '09:00',
  });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await habitsApi.getHabits();
      setHabits(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load habits');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await habitsApi.createHabit(formData);
      setFormData({
        name: '',
        description: '',
        category: '기타',
        frequencyType: 'daily',
        targetValue: '',
        reminderEnabled: true,
        reminderTime: '09:00',
      });
      setShowModal(false);
      await loadHabits();
    } catch (err: any) {
      setError(err.message || 'Failed to create habit');
    }
  };

  const handleDelete = async (id: number) {
    if (confirm('이 습관을 삭제하시겠습니까?')) {
      try {
        await habitsApi.deleteHabit(id);
        await loadHabits();
      } catch (err: any) {
        setError(err.message || 'Failed to delete habit');
      }
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await habitsApi.toggleActive(id, !isActive);
      await loadHabits();
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

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">습관 관리</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + 새 습관 추가
        </button>
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 mb-4">아직 습관이 없습니다</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            첫 습관 만들기
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {habits.map((habit) => (
            <div key={habit.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {habit.name}
                  </h3>
                  {habit.description && (
                    <p className="text-gray-600 text-sm mt-1">
                      {habit.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                      {habit.category}
                    </span>
                    <span className="px-2 py-1 bg-primary-100 rounded text-xs text-primary-700">
                      {habit.frequencyType === 'daily' ? '매일' : '주간'}
                    </span>
                    {habit.targetValue && (
                      <span className="px-2 py-1 bg-green-100 rounded text-xs text-green-700">
                        {habit.targetValue}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-primary-600">
                    {habit.streak?.currentStreak || 0}
                  </div>
                  <div className="text-xs text-gray-500">연속 달성</div>
                  <div className="text-sm text-gray-500 mt-2">
                    최장: {habit.streak?.longestStreak || 0}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => handleToggleActive(habit.id, habit.isActive)}
                  className={`btn btn-sm ${
                    habit.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {habit.isActive ? '활성' : '비활성'}
                </button>
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200 ml-auto"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">새 습관 추가</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">습관명 *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="예: 아침 운동"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">설명</label>
                <input
                  type="text"
                  className="input"
                  placeholder="습관에 대한 설명"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="label">카테고리</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>운동</option>
                  <option>독서</option>
                  <option>명상</option>
                  <option>학습</option>
                  <option>건강</option>
                  <option>기타</option>
                </select>
              </div>

              <div>
                <label className="label">빈도</label>
                <select
                  className="input"
                  value={formData.frequencyType}
                  onChange={(e) => setFormData({ ...formData, frequencyType: e.target.value })}
                >
                  <option value="daily">매일</option>
                  <option value="weekly">주간</option>
                </select>
              </div>

              <div>
                <label className="label">목표값</label>
                <input
                  type="text"
                  className="input"
                  placeholder="예: 30분, 10페이지"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                />
              </div>

              <div>
                <label className="label">리마인더 시간</label>
                <input
                  type="time"
                  className="input"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
