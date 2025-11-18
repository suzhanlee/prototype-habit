'use client';

import { useState, useEffect } from 'react';
import { usersApi, validateUsername, validateAvatarUrl, UserSettings } from '@/lib/users';

interface ProfileFormProps {
  initialData: UserSettings;
  onUpdate: (data: Partial<UserSettings>) => void;
}

export default function ProfileForm({ initialData, onUpdate }: ProfileFormProps) {
  const [username, setUsername] = useState(initialData.username);
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [avatarError, setAvatarError] = useState('');

  const hasChanges = username !== initialData.username || avatarUrl !== (initialData.avatarUrl || '');

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameError(validateUsername(value) || '');
  };

  const handleAvatarUrlChange = (value: string) => {
    setAvatarUrl(value);
    setAvatarError(validateAvatarUrl(value) || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameErr = validateUsername(username);
    const avatarErr = validateAvatarUrl(avatarUrl);

    if (usernameErr || avatarErr) {
      setUsernameError(usernameErr || '');
      setAvatarError(avatarErr || '');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedData = await usersApi.updateProfile({
        username: username !== initialData.username ? username : undefined,
        avatarUrl: avatarUrl !== (initialData.avatarUrl || '') ? avatarUrl : undefined,
      });

      setSuccess('프로필이 성공적으로 업데이트되었습니다');
      onUpdate(updatedData);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || '프로필 업데이트에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername(initialData.username);
    setAvatarUrl(initialData.avatarUrl || '');
    setUsernameError('');
    setAvatarError('');
    setError('');
    setSuccess('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">프로필 정보</h3>

        {/* Avatar Preview */}
        {avatarUrl && (
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Email (read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <input
            type="email"
            value={initialData.email}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사용자명 *
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              usernameError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary-500'
            }`}
            placeholder="사용자명 입력"
          />
          {usernameError && (
            <p className="text-xs text-red-500 mt-1">{usernameError}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            3-30자, 영문/숫자/밑줄(_)만 사용 가능
          </p>
        </div>

        {/* Avatar URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            아바타 URL
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => handleAvatarUrlChange(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              avatarError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-primary-500'
            }`}
            placeholder="https://example.com/avatar.jpg"
          />
          {avatarError && (
            <p className="text-xs text-red-500 mt-1">{avatarError}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            이미지 URL을 입력하세요 (선택사항)
          </p>
        </div>

        {/* Account Created */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            계정 생성일
          </label>
          <input
            type="text"
            value={new Date(initialData.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
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
            disabled={!hasChanges || isLoading || !!usernameError || !!avatarError}
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
