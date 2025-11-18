'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usersApi } from '@/lib/users';
import { useAuth } from '@/lib/useAuth';

export default function AccountDangerZone() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { logout } = useAuth();

  const canDelete = password && confirmation === 'DELETE';

  const handleDeleteClick = () => {
    setIsModalOpen(true);
    setPassword('');
    setConfirmation('');
    setError('');
  };

  const handleCloseModal = () => {
    if (isLoading) return;
    setIsModalOpen(false);
    setPassword('');
    setConfirmation('');
    setError('');
  };

  const handleDeleteAccount = async () => {
    if (!canDelete) return;

    setIsLoading(true);
    setError('');

    try {
      await usersApi.deleteAccount({
        password,
        confirmation,
      });

      // Logout and redirect
      logout();
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || '계정 삭제에 실패했습니다');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-red-300 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">위험 영역</h3>
            <p className="text-sm text-gray-700 mb-4">
              계정을 삭제하면 모든 데이터(습관, 기록, 통계 등)가 영구적으로 삭제됩니다.
              이 작업은 되돌릴 수 없습니다.
            </p>
            <button
              onClick={handleDeleteClick}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              계정 삭제
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">계정 삭제 확인</h3>

            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-semibold mb-2">
                경고: 이 작업은 되돌릴 수 없습니다!
              </p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>모든 습관 데이터가 삭제됩니다</li>
                <li>모든 기록 및 통계가 삭제됩니다</li>
                <li>계정이 영구적으로 비활성화됩니다</li>
                <li>이 작업은 취소할 수 없습니다</li>
              </ul>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 입력 *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="비밀번호 입력"
                disabled={isLoading}
              />
            </div>

            {/* Confirmation Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                확인을 위해 <span className="font-mono font-bold">DELETE</span>를 입력하세요 *
              </label>
              <input
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="DELETE 입력"
                disabled={isLoading}
              />
              {confirmation && confirmation !== 'DELETE' && (
                <p className="text-xs text-red-500 mt-1">
                  정확히 &quot;DELETE&quot;를 입력하세요
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                disabled={isLoading}
                className="btn btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!canDelete || isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? '삭제 중...' : '계정 삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
