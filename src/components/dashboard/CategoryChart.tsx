'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Expense, ExpenseCategory } from '@/types/expense';
import { calculateCategorySummaries, formatCurrency } from '@/lib/utils';

interface CategoryChartProps {
  expenses: Expense[];
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#f97316',
  Transportation: '#3b82f6',
  Entertainment: '#a855f7',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Other: '#6b7280',
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { category: string; total: number; count: number; percentage: number } }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900">{data.category}</p>
        <p className="text-sm text-gray-600">
          {formatCurrency(data.total)} ({data.count} expense{data.count !== 1 ? 's' : ''})
        </p>
        <p className="text-sm text-gray-600">{data.percentage.toFixed(1)}% of total</p>
      </div>
    );
  }
  return null;
};

export default function CategoryChart({ expenses }: CategoryChartProps) {
  const categorySummaries = calculateCategorySummaries(expenses);

  if (categorySummaries.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-center">No expense data to display</p>
        </div>
      </div>
    );
  }

  const chartData = categorySummaries.map((summary) => ({
    category: summary.category,
    total: summary.total,
    count: summary.count,
    percentage: summary.percentage,
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="total"
              nameKey="category"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.category as ExpenseCategory]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-gray-700">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown List */}
      <div className="mt-6 space-y-3">
        {categorySummaries.map((summary) => (
          <div key={summary.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[summary.category] }}
              />
              <span className="text-sm font-medium text-gray-700">{summary.category}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {summary.count} expense{summary.count !== 1 ? 's' : ''}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(summary.total)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
