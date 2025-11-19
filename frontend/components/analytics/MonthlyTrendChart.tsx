'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts';
import { MonthlyTrendResponse } from '@/lib/analytics';

interface MonthlyTrendChartProps {
  data: MonthlyTrendResponse;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">
            완료율: <span className="font-medium text-blue-600">{data.completionRate.toFixed(1)}%</span>
          </p>
          <p className="text-gray-600">
            완료 횟수: <span className="font-medium">{data.totalCompletions}회</span>
          </p>
          <p className="text-gray-600">
            활성 습관: <span className="font-medium">{data.habitCount}개</span>
          </p>
          <p className="text-gray-600">
            추세: <span className={`font-medium ${
              data.trend === 'up' ? 'text-green-600' :
              data.trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {data.trend === 'up' ? '📈 상승' : data.trend === 'down' ? '📉 하락' : '➡️ 유지'}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// Format month name
const formatMonth = (monthStr: string) => {
  const [year, month] = monthStr.split('-');
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  return `${year}년 ${monthNames[parseInt(month) - 1]}`;
};

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  if (!data.data || data.data.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">월별 추세</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">월별 추세 데이터가 없습니다</p>
        </div>
      </div>
    );
  }

  // Sort data by month
  const sortedData = [...data.data].sort((a, b) => a.month.localeCompare(b.month));

  // Calculate trend for the line
  const trendData = sortedData.map((item, index) => ({
    ...item,
    trendLine: item.completionRate // Simple trend line (completion rate)
  }));

  // Calculate average completion rate
  const avgCompletionRate = sortedData.reduce((sum, item) => sum + item.completionRate, 0) / sortedData.length;

  // Find best and worst months
  const bestMonth = sortedData.reduce((best, current) =>
    current.completionRate > best.completionRate ? current : best
  );

  const worstMonth = sortedData.reduce((worst, current) =>
    current.completionRate < worst.completionRate ? current : worst
  );

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">월별 추세</h2>
        <div className="text-sm text-gray-500">
          최근 {sortedData.length}개월 데이터
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={trendData}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              label={{ value: '완료율 (%)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              label={{ value: '완료 횟수', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Area for completion rate */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="completionRate"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#completionGradient)"
              name="완료율"
            />

            {/* Line for completion count */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalCompletions"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10B981' }}
              name="완료 횟수"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {avgCompletionRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600">평균 완료율</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {bestMonth.completionRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600">최고 월</div>
          <div className="text-xs text-gray-500">{formatMonth(bestMonth.month)}</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">
            {worstMonth.completionRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600">최저 월</div>
          <div className="text-xs text-gray-500">{formatMonth(worstMonth.month)}</div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {sortedData.filter(m => m.trend === 'up').length}
          </div>
          <div className="text-xs text-gray-600">상승 월 수</div>
        </div>
      </div>
    </div>
  );
}