import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  text = '로딩 중...',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div
          className={`
            ${sizeClasses[size]}
            border-4 border-gray-200 border-t-primary-500
            rounded-full animate-spin mx-auto mb-2
          `}
        />
        <p className={`text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </p>
      </div>
    </div>
  );
}

// Full screen loading component
export function FullScreenLoading({ text = '로딩 중...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

// Inline loading component for buttons
export function ButtonLoading({ text = '처리 중...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>{text}</span>
    </div>
  );
}