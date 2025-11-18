'use client';

import { useState } from 'react';
import { usersApi, TIMEZONE_OPTIONS, LOCALE_OPTIONS, UserSettings } from '@/lib/users';

interface SettingsFormProps {
  initialData: UserSettings;
  onUpdate: (data: Partial<UserSettings>) => void;
}

export default function SettingsForm({ initialData, onUpdate }: SettingsFormProps) {
  const [timezone, setTimezone] = useState(initialData.timezone);
  const [locale, setLocale] = useState(initialData.locale);
  const [pushNotificationEnabled, setPushNotificationEnabled] = useState(
    initialData.pushNotificationEnabled
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const hasChanges =
    timezone !== initialData.timezone ||
    locale !== initialData.locale ||
    pushNotificationEnabled !== initialData.pushNotificationEnabled;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedData = await usersApi.updateSettings({
        timezone: timezone !== initialData.timezone ? timezone : undefined,
        locale: locale !== initialData.locale ? locale : undefined,
        pushNotificationEnabled:
          pushNotificationEnabled !== initialData.pushNotificationEnabled
            ? pushNotificationEnabled
            : undefined,
      });

      setSuccess('설정이 성공적으로 업데이트되었습니다');
      onUpdate(updatedData);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || '설정 업데이트에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTimezone(initialData.timezone);
    setLocale(initialData.locale);
    setPushNotificationEnabled(initialData.pushNotificationEnabled);
    setError('');
    setSuccess('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">애플리케이션 설정</h3>

        {/* Timezone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시간대
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {TIMEZONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            습관 추적 및 알림에 사용되는 시간대
          </p>
        </div>

        {/* Locale */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            언어
          </label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {LOCALE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            인터페이스 표시 언어
          </p>
        </div>

        {/* Push Notifications */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                푸시 알림
              </label>
              <p className="text-xs text-gray-500 mt-1">
                습관 리마인더 및 알림 활성화
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPushNotificationEnabled(!pushNotificationEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                pushNotificationEnabled ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pushNotificationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!hasChanges || isLoading}
            className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '저장 중...' : '변경사항 저장'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={!hasChanges || isLoading}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
        </div>
      </div>
    </form>
  );
}
