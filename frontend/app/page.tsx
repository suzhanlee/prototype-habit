import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Habit Tracker
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          매일 작은 습관이 큰 변화를 만듭니다.
        </p>

        <div className="space-y-4">
          <p className="text-gray-500">습관 형성을 시작해보세요!</p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/login"
              className="btn-primary"
            >
              로그인
            </Link>
            <Link
              href="/auth/register"
              className="btn-secondary"
            >
              회원가입
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary-500">📝</div>
            <h3 className="font-semibold mt-2">쉬운 기록</h3>
            <p className="text-sm text-gray-600">간단하게 습관을 기록하세요</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-500">📈</div>
            <h3 className="font-semibold mt-2">진행도 추적</h3>
            <p className="text-sm text-gray-600">시각적으로 진행도를 확인하세요</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-500">🎯</div>
            <h3 className="font-semibold mt-2">목표 달성</h3>
            <p className="text-sm text-gray-600">연속 달성으로 동기 부여</p>
          </div>
        </div>
      </div>
    </main>
  )
}
