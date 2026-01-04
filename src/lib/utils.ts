import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Expense, ExpenseCategory, CategorySummary, ExpenseFilter } from '@/types/expense';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
};

export const filterExpenses = (expenses: Expense[], filters: ExpenseFilter): Expense[] => {
  return expenses.filter((expense) => {
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      if (
        !expense.description.toLowerCase().includes(term) &&
        !expense.category.toLowerCase().includes(term)
      ) {
        return false;
      }
    }

    if (filters.category && filters.category !== 'All') {
      if (expense.category !== filters.category) {
        return false;
      }
    }

    if (filters.startDate) {
      if (expense.date < filters.startDate) {
        return false;
      }
    }

    if (filters.endDate) {
      if (expense.date > filters.endDate) {
        return false;
      }
    }

    return true;
  });
};

export const sortExpenses = (expenses: Expense[], order: 'asc' | 'desc' = 'desc'): Expense[] => {
  return [...expenses].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
};

export const calculateCategorySummaries = (
  expenses: Expense[]
): CategorySummary[] => {
  const categoryTotals = new Map<ExpenseCategory, { total: number; count: number }>();

  expenses.forEach((expense) => {
    const current = categoryTotals.get(expense.category) || { total: 0, count: 0 };
    categoryTotals.set(expense.category, {
      total: current.total + expense.amount,
      count: current.count + 1,
    });
  });

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return Array.from(categoryTotals.entries())
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      percentage: totalAmount > 0 ? (data.total / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
};

export const getTotalSpending = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getMonthlySpending = (expenses: Expense[]): number => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfMonthISO = startOfMonth.toISOString().split('T')[0];

  return expenses
    .filter((e) => e.date >= startOfMonthISO)
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const exportToCSV = (expenses: Expense[]): string => {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map((expense) => [
    expense.date,
    expense.category,
    `"${expense.description.replace(/"/g, '""')}"`,
    expense.amount.toFixed(2),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (expenses: Expense[], filename = 'expenses.csv'): void => {
  const csv = exportToCSV(expenses);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
