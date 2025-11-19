'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HabitComparisonResponse } from '@/lib/analytics';

interface HabitComparisonChartProps {
  data: HabitComparisonResponse;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{data.habitName}</p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">
            완료율: <span className="font-medium">{data.completionRate}%</span>
          </p>
          <p className="text-gray-600">
            완료일수: <span className="font-medium">{data.completedDays}/{data.totalDays}일</span>
          </p>
          <p className="text-gray-600">
            현재 스트릭: <span className="font-medium text-orange-600">{data.currentStreak}일</span>
          </p>
          <p className="text-gray-600">
            최장 스트릭: <span className="font-medium text-green-600">{data.longestStreak}일</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const getBarColor = (completionRate: number): string => {
  if (completionRate >= 80) return '#10B981'; // Green
  if (completionRate >= 50) return '#F59E0B'; // Yellow
  return '#EF4444'; // Red
};

export default function HabitComparisonChart({ data }: HabitComparisonChartProps) {
  if (!data.data || data.data.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">습관별 성과 비교</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">습관 데이터가 없습니다</p>
        </div>
      </div>
    );
  }

  // Sort by completion rate (descending)
  const sortedData = [...data.data].sort((a, b) => b.completionRate - a.completionRate);

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">습관별 성과 비교</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">우수 (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">보통 (50-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">개선 필요 (&lt;50%)</span>
          </div>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              type="category"
              dataKey="habitName"
              tick={{ fontSize: 12 }}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="completionRate" radius={[0, 4, 4, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.completionRate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">
            {sortedData.filter(h => h.completionRate >= 80).length}
          </div>
          <div className="text-xs text-gray-600">우수한 습관</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-xl font-bold text-yellow-600">
            {sortedData.filter(h => h.completionRate >= 50 && h.completionRate < 80).length}
          </div>
          <div className="text-xs text-gray-600">보통인 습관</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-xl font-bold text-red-600">
            {sortedData.filter(h => h.completionRate < 50).length}
          </div>
          <div className="text-xs text-gray-600">개선 필요</div>
        </div>
      </div>
    </div>
  );
}