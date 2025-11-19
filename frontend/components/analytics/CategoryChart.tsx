'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryAnalyticsResponse } from '@/lib/analytics';

interface CategoryChartProps {
  data: CategoryAnalyticsResponse;
}

// Category color palette
const CATEGORY_COLORS: Record<string, string> = {
  '운동': '#3B82F6',  // Blue
  '독서': '#10B981',  // Green
  '명상': '#8B5CF6',  // Purple
  '학습': '#F59E0B',  // Amber
  '건강': '#EF4444',  // Red
  '기타': '#6B7280'   // Gray
};

// Default colors for categories not in the predefined palette
const DEFAULT_COLORS = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
  '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.category}</p>
        <p className="text-sm text-gray-600">
          완료: {data.completionCount}회 ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy }: any) => {
  return (
    <text
      x={cx}
      y={cy}
      fill="#1F2937"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-lg font-bold"
    >
      총 {payload?.total || 0}회
    </text>
  );
};

export default function CategoryChart({ data }: CategoryChartProps) {
  if (!data.data || data.data.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">카테고리 분포</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">카테고리 데이터가 없습니다</p>
        </div>
      </div>
    );
  }

  // Add colors to data
  const chartData = data.data.map((item, index) => ({
    ...item,
    color: CATEGORY_COLORS[item.category] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  }));

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">카테고리 분포</h2>
        <div className="text-sm text-gray-500">
          {data.period.startDate} ~ {data.period.endDate}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="40%"
              labelLine={false}
              label={(entry) => `${entry.category}: ${entry.percentage}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="completionCount"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm">
                  {value} ({entry.payload.percentage}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{data.data.length}</div>
          <div className="text-sm text-gray-600">활성 카테고리</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">{data.total}</div>
          <div className="text-sm text-gray-600">총 완료 횟수</div>
        </div>
      </div>
    </div>
  );
}