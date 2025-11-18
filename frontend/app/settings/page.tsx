'use client';

import { useState, useEffect } from 'react';
import { usersApi, UserSettings } from '@/lib/users';
import ProfileForm from '@/components/settings/ProfileForm';
import SettingsForm from '@/components/settings/SettingsForm';
import PasswordForm from '@/components/settings/PasswordForm';
import AccountDangerZone from '@/components/settings/AccountDangerZone';

type TabType = 'profile' | 'settings' | 'security';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      setIsLoading(true);
      const data = await usersApi.getUserSettings();
      setUserSettings(data);
      setError('');
    } catch (err: any) {
      setError('설정을 불러오는데 실패했습니다');
      console.error('Failed to load user settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = (updatedData: Partial<UserSettings>) => {
    if (userSettings) {
      setUserSettings({ ...userSettings, ...updatedData });
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: '프로필', icon: '👤' },
    { id: 'settings' as TabType, label: '설정', icon: '⚙️' },
    { id: 'security' as TabType, label: '보안', icon: '🔒' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">설정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && !userSettings) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold mb-2">{error}</p>
          <button
            onClick={loadUserSettings}
            className="btn btn-primary"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!userSettings) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">설정</h1>
        <p className="text-gray-600">
          프로필, 환경설정 및 보안 설정을 관리하세요
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <ProfileForm
              initialData={userSettings}
              onUpdate={handleUpdateSettings}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsForm
              initialData={userSettings}
              onUpdate={handleUpdateSettings}
            />
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <PasswordForm />
              <AccountDangerZone />
            </div>
          )}
        </div>
      </div>

      {/* Info Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              설정 정보
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>모든 설정 변경사항은 즉시 저장됩니다</li>
              <li>시간대 변경은 습관 추적 및 알림에 영향을 줍니다</li>
              <li>비밀번호 변경 후에도 로그인 상태가 유지됩니다</li>
              <li>계정 삭제는 되돌릴 수 없으니 신중히 선택하세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
