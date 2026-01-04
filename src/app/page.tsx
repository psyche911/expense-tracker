'use client';

import { useState, useEffect } from 'react';
import { Wallet, TrendingUp } from 'lucide-react';
import { Expense, ExpenseFormData } from '@/types/expense';
import { expenseStorage } from '@/lib/storage';
import SummaryCards from '@/components/dashboard/SummaryCards';
import CategoryChart from '@/components/dashboard/CategoryChart';
import ExpenseList from '@/components/expenses/ExpenseList';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import AddExpenseButton from '@/components/expenses/AddExpenseButton';
import ExportButton from '@/components/expenses/ExportButton';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load expenses from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const loadedExpenses = expenseStorage.getExpenses();
    setExpenses(loadedExpenses);
  }, []);

  const handleAddExpense = (data: ExpenseFormData) => {
    const newExpense = expenseStorage.addExpense(data);
    setExpenses((prev) => [...prev, newExpense]);
    setShowAddForm(false);
  };

  const handleUpdateExpense = (id: string, data: ExpenseFormData) => {
    const updatedExpense = expenseStorage.updateExpense(id, data);
    if (updatedExpense) {
      setExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? updatedExpense : expense))
      );
    }
  };

  const handleDeleteExpense = (id: string) => {
    expenseStorage.deleteExpense(id);
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  // Don't render until mounted (prevents hydration mismatch with localStorage)
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Expense Tracker</h1>
                <p className="text-sm text-gray-500">Manage your finances efficiently</p>
              </div>
            </div>
            <ExportButton expenses={expenses} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Cards */}
          <SummaryCards expenses={expenses} />

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Chart */}
            <div className="lg:col-span-1">
              <CategoryChart expenses={expenses} />
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Quick Insights
              </h3>
              {expenses.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-gray-500">
                  <p>Add your first expense to see insights</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-medium">Most Active Category</p>
                    <p className="text-xl font-bold text-blue-900 mt-1">
                      {Object.entries(
                        expenses.reduce(
                          (acc, curr) => {
                            acc[curr.category] = (acc[curr.category] || 0) + 1;
                            return acc;
                          },
                          {} as Record<string, number>
                        )
                      )
                        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700 font-medium">Average per Expense</p>
                    <p className="text-xl font-bold text-green-900 mt-1">
                      ${(expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-700 font-medium">Total This Week</p>
                    <p className="text-xl font-bold text-purple-900 mt-1">
                      ${expenses
                        .filter((e) => {
                          const expenseDate = new Date(e.date);
                          const now = new Date();
                          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                          return expenseDate >= weekAgo;
                        })
                        .reduce((sum, e) => sum + e.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-orange-700 font-medium">Largest Expense</p>
                    <p className="text-xl font-bold text-orange-900 mt-1">
                      ${Math.max(...expenses.map((e) => e.amount)).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expenses List */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">All Expenses</h2>
            <ExpenseList
              expenses={expenses}
              onDelete={handleDeleteExpense}
              onUpdate={handleUpdateExpense}
            />
          </div>
        </div>
      </main>

      {/* Floating Add Button */}
      <AddExpenseButton onClick={() => setShowAddForm(true)} />

      {/* Add Expense Modal */}
      {showAddForm && (
        <ExpenseForm onSubmit={handleAddExpense} onCancel={() => setShowAddForm(false)} />
      )}
    </div>
  );
}
