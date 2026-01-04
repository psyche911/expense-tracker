import { Wallet, Calendar, TrendingUp, PiggyBank } from 'lucide-react';
import { Expense } from '@/types/expense';
import { formatCurrency, getTotalSpending, getMonthlySpending } from '@/lib/utils';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface SummaryCardsProps {
  expenses: Expense[];
}

export default function SummaryCards({ expenses }: SummaryCardsProps) {
  const totalSpending = getTotalSpending(expenses);
  const monthlySpending = getMonthlySpending(expenses);

  // Calculate last month spending for comparison
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = endOfMonth(lastMonth);

  const lastMonthSpending = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date);
      return isWithinInterval(expenseDate, {
        start: startOfMonth(lastMonth),
        end: lastMonthEnd,
      });
    })
    .reduce((sum, e) => sum + e.amount, 0);

  // Calculate trend
  const trend =
    lastMonthSpending > 0
      ? ((monthlySpending - lastMonthSpending) / lastMonthSpending) * 100
      : 0;
  const isPositiveTrend = trend < 0; // Positive for us means spending less

  // Calculate average expense
  const averageExpense = expenses.length > 0 ? totalSpending / expenses.length : 0;

  const cards = [
    {
      title: 'Total Spending',
      value: formatCurrency(totalSpending),
      icon: Wallet,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'This Month',
      value: formatCurrency(monthlySpending),
      icon: Calendar,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      trend: trend !== 0 ? `${isPositiveTrend ? '-' : '+'}${Math.abs(trend).toFixed(1)}% from last month` : undefined,
      trendPositive: isPositiveTrend,
    },
    {
      title: 'Average Expense',
      value: formatCurrency(averageExpense),
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Total Expenses',
      value: expenses.length.toString(),
      icon: PiggyBank,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                {card.trend && (
                  <p
                    className={`text-xs mt-1 font-medium ${
                      card.trendPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {card.trend}
                  </p>
                )}
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
