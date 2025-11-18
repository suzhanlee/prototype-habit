'use client';

import { useState } from 'react';
import { usersApi, validatePassword, calculatePasswordStrength } from '@/lib/users';

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passwordStrength = calculatePasswordStrength(newPassword);

  const currentPasswordError = currentPassword ? validatePassword(currentPassword) : null;
  const newPasswordError = newPassword ? validatePassword(newPassword) : null;
  const confirmPasswordError =
    confirmPassword && newPassword !== confirmPassword
      ? '비밀번호가 일치하지 않습니다'
      : null;

  const canSubmit =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    !currentPasswordError &&
    !newPasswordError &&
    !confirmPasswordError &&
    currentPassword !== newPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await usersApi.changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess('비밀번호가 성공적으로 변경되었습니다');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || '비밀번호 변경에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (color: string) => {
    const colors: Record<string, string> = {
      gray: 'bg-gray-300',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      blue: 'bg-blue-500',
    };
    return colors[color] || 'bg-gray-300';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">비밀번호 변경</h3>

        {/* Current Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            현재 비밀번호 *
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                currentPasswordError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
              placeholder="현재 비밀번호 입력"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showCurrentPassword ? '숨김' : '표시'}
            </button>
          </div>
          {currentPasswordError && (
            <p className="text-xs text-red-500 mt-1">{currentPasswordError}</p>
          )}
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            새 비밀번호 *
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                newPasswordError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
              placeholder="새 비밀번호 입력"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? '숨김' : '표시'}
            </button>
          </div>
          {newPasswordError && (
            <p className="text-xs text-red-500 mt-1">{newPasswordError}</p>
          )}
          {currentPassword && newPassword === currentPassword && (
            <p className="text-xs text-red-500 mt-1">
              새 비밀번호는 현재 비밀번호와 달라야 합니다
            </p>
          )}

          {/* Password Strength Meter */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getStrengthColor(
                      passwordStrength.color
                    )}`}
                    style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600">
                  {passwordStrength.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                권장: 대소문자, 숫자, 특수문자 혼합 사용
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            새 비밀번호 확인 *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                confirmPasswordError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
              placeholder="새 비밀번호 다시 입력"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? '숨김' : '표시'}
            </button>
          </div>
          {confirmPasswordError && (
            <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>
          )}
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSubmit || isLoading}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '변경 중...' : '비밀번호 변경'}
        </button>
      </div>
    </form>
  );
}
