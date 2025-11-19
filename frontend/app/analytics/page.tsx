'use client';

import { useState, useEffect } from 'react';
import {
  analyticsApi,
  CategoryAnalyticsResponse,
  HabitComparisonResponse,
  MonthlyTrendResponse,
  TopHabitsResponse,
  WeakHabitsResponse,
  CompletionPatternResponse,
  TimeAnalyticsResponse,
  ConsistencyScore,
  StreakAnalytics,
  PredictiveInsights
} from '@/lib/analytics';

// Import chart components
import CategoryChart from '@/components/analytics/CategoryChart';
import HabitComparisonChart from '@/components/analytics/HabitComparisonChart';
import MonthlyTrendChart from '@/components/analytics/MonthlyTrendChart';

const TimeHeatmap = ({ data }: { data: CompletionPatternResponse }) => (
  <div className="card p-6 lg:col-span-2">
    <h2 className="text-xl font-bold mb-4">완료 패턴 히트맵</h2>
    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
      <p className="text-gray-500">Time Heatmap Component (Coming soon)</p>
    </div>
  </div>
);

const TopHabitsCard = ({ data }: { data: TopHabitsResponse }) => (
  <div className="card p-6">
    <h2 className="text-xl font-bold mb-4">최고 성과 습관</h2>
    <div className="space-y-3">
      {data.data.map((habit, index) => (
        <div key={habit.habitId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
            </span>
            <span className="font-medium">{habit.habitName}</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-600">{habit.completionRate}%</div>
            <div className="text-sm text-gray-600">🔥 {habit.currentStreak}일</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const WeakHabitsCard = ({ data }: { data: WeakHabitsResponse }) => (
  <div className="card p-6">
    <h2 className="text-xl font-bold mb-4">관심이 필요한 습관</h2>
    <div className="space-y-3">
      {data.data.map((habit) => (
        <div key={habit.habitId} className="p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{habit.habitName}</span>
            <span className="text-sm text-red-600">⚠️ {habit.completionRate}%</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{habit.recommendation}</p>
          <div className="text-xs text-gray-500">
            마지막 완료: {habit.daysWithoutCompletion}일 전
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ConsistencyMeter = ({ data }: { data: ConsistencyScore }) => (
  <div className="card p-6">
    <h2 className="text-xl font-bold mb-4">일관성 점수</h2>
    <div className="text-center">
      <div className="relative inline-flex items-center justify-center">
        <div className="text-5xl font-bold text-primary-600">{data.score}</div>
      </div>
      <div className="mt-4">
        <div className={`text-lg font-medium ${
          data.score >= 75 ? 'text-green-600' :
          data.score >= 50 ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {data.description}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {data.trend === 'up' ? '📈' : data.trend === 'down' ? '📉' : '➡️'}
          {data.change > 0 ? '+' : ''}{data.change}점 변화
        </div>
      </div>
    </div>
  </div>
);

const InsightsPanel = ({ data }: { data: PredictiveInsights }) => (
  <div className="card p-6 lg:col-span-2">
    <h2 className="text-xl font-bold mb-4">인사이트 및 추천</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* At-risk habits */}
      {data.atRisk.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-red-600">위험한 습관</h3>
          {data.atRisk.map((habit) => (
            <div key={habit.habitId} className="p-3 bg-red-50 rounded-lg text-sm">
              <div className="font-medium">{habit.habitName}</div>
              <div className="text-gray-600">{habit.reason}</div>
              <div className="text-red-600 font-medium">{habit.action}</div>
            </div>
          ))}
        </div>
      )}

      {/* Focus recommendations */}
      {data.shouldFocus.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-yellow-600">집중 추천</h3>
          {data.shouldFocus.map((habit) => (
            <div key={habit.habitId} className="p-3 bg-yellow-50 rounded-lg text-sm">
              <div className="font-medium">{habit.habitName}</div>
              <div className="text-gray-600">{habit.reason}</div>
              <div className="text-yellow-600 font-medium">{habit.suggestion}</div>
            </div>
          ))}
        </div>
      )}

      {/* General recommendations */}
      {data.recommendations.length > 0 && (
        <div className="space-y-2 md:col-span-2">
          <h3 className="font-medium text-blue-600">개선 제안</h3>
          {data.recommendations.map((rec, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg text-sm">
              <div className="font-medium">{rec.title}</div>
              <div className="text-gray-600">{rec.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // State for all analytics data
  const [categoryData, setCategoryData] = useState<CategoryAnalyticsResponse | null>(null);
  const [comparisonData, setComparisonData] = useState<HabitComparisonResponse | null>(null);
  const [trendData, setTrendData] = useState<MonthlyTrendResponse | null>(null);
  const [topHabitsData, setTopHabitsData] = useState<TopHabitsResponse | null>(null);
  const [weakHabitsData, setWeakHabitsData] = useState<WeakHabitsResponse | null>(null);
  const [patternData, setPatternData] = useState<CompletionPatternResponse | null>(null);
  const [timeData, setTimeData] = useState<TimeAnalyticsResponse | null>(null);
  const [consistencyData, setConsistencyData] = useState<ConsistencyScore | null>(null);
  const [streakData, setStreakData] = useState<StreakAnalytics | null>(null);
  const [insightsData, setInsightsData] = useState<PredictiveInsights | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [period]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Calculate date range based on period
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - parseInt(period) * 24 * 60 * 60 * 1000);
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Load all analytics data in parallel
      const [
        categoryRes,
        comparisonRes,
        trendRes,
        topHabitsRes,
        weakHabitsRes,
        patternRes,
        timeRes,
        consistencyRes,
        streakRes,
        insightsRes
      ] = await Promise.all([
        analyticsApi.getCategoryDistribution(startDateStr, endDateStr),
        analyticsApi.getHabitComparison(startDateStr, endDateStr),
        analyticsApi.getMonthlyTrend(12),
        analyticsApi.getTopHabits(5, parseInt(period)),
        analyticsApi.getWeakHabits(5, 50),
        analyticsApi.getCompletionPattern(365),
        analyticsApi.getTimeBasedAnalytics(parseInt(period)),
        analyticsApi.getConsistencyScore(parseInt(period)),
        analyticsApi.getStreakAnalytics(),
        analyticsApi.getPredictiveInsights()
      ]);

      setCategoryData(categoryRes);
      setComparisonData(comparisonRes);
      setTrendData(trendRes);
      setTopHabitsData(topHabitsRes);
      setWeakHabitsData(weakHabitsRes);
      setPatternData(patternRes);
      setTimeData(timeRes);
      setConsistencyData(consistencyRes);
      setStreakData(streakRes);
      setInsightsData(insightsRes);

    } catch (err: any) {
      setError(err.message || '분석 데이터를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">분석 데이터를 불러오는 중...</p>
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
        <h1 className="text-3xl font-bold">고급 분석</h1>
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
          <button
            onClick={loadAnalyticsData}
            className="btn btn-secondary"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Row 1: Consistency Meter and Category Chart */}
        {consistencyData && <ConsistencyMeter data={consistencyData} />}
        {categoryData && <CategoryChart data={categoryData} />}

        {/* Row 2: Monthly Trend and Habit Comparison */}
        {trendData && <MonthlyTrendChart data={trendData} />}
        {comparisonData && <HabitComparisonChart data={comparisonData} />}

        {/* Row 3: Top Habits and Weak Habits */}
        {topHabitsData && <TopHabitsCard data={topHabitsData} />}
        {weakHabitsData && <WeakHabitsCard data={weakHabitsData} />}

        {/* Row 4: Time Heatmap */}
        {patternData && <TimeHeatmap data={patternData} />}

        {/* Row 5: Insights Panel */}
        {insightsData && <InsightsPanel data={insightsData} />}
      </div>

      {/* No data state */}
      {!categoryData && !comparisonData && !trendData && !topHabitsData && (
        <div className="card p-8 text-center">
          <p className="text-gray-600">표시할 분석 데이터가 없습니다</p>
          <p className="text-sm text-gray-500 mt-2">습관을 생성하고 기록을 시작하면 분석 데이터가 표시됩니다</p>
        </div>
      )}
    </div>
  );
}