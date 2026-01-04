'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, Trash2, Edit2, ChevronDown } from 'lucide-react';
import { Expense, ExpenseCategory, ExpenseFormData } from '@/types/expense';
import { formatCurrency, formatDate, sortExpenses } from '@/lib/utils';
import ExpenseForm from './ExpenseForm';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: ExpenseFormData) => void;
}

const CATEGORIES: (ExpenseCategory | 'All')[] = [
  'All',
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: 'bg-orange-100 text-orange-700 border-orange-200',
  Transportation: 'bg-blue-100 text-blue-700 border-blue-200',
  Entertainment: 'bg-purple-100 text-purple-700 border-purple-200',
  Shopping: 'bg-pink-100 text-pink-700 border-pink-200',
  Bills: 'bg-red-100 text-red-700 border-red-200',
  Other: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function ExpenseList({ expenses, onDelete, onUpdate }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredAndSortedExpenses = sortExpenses(
    expenses.filter((expense) => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (
          !expense.description.toLowerCase().includes(term) &&
          !expense.category.toLowerCase().includes(term)
        ) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && expense.category !== selectedCategory) {
        return false;
      }

      // Date range filter
      if (startDate && expense.date < startDate) {
        return false;
      }
      if (endDate && expense.date > endDate) {
        return false;
      }

      return true;
    }),
    sortOrder
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 300));
    onDelete(id);
    setDeletingId(null);
  };

  const handleUpdate = (data: ExpenseFormData) => {
    if (editingExpense) {
      onUpdate(editingExpense.id, data);
      setEditingExpense(undefined);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || startDate || endDate;

  return (
    <>
      <div className="space-y-4">
        {/* Search and Filter Header */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 border rounded-lg font-medium transition-colors flex items-center gap-2 ${
              hasActiveFilters
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value as ExpenseCategory | 'All')
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Sort Toggle */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredAndSortedExpenses.length === 0
              ? 'No expenses found'
              : `${filteredAndSortedExpenses.length} expense${
                  filteredAndSortedExpenses.length !== 1 ? 's' : ''
                }`}
          </p>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 font-medium"
          >
            Date: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            <ChevronDown className={`w-4 h-4 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expenses List */}
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No expenses found</p>
            {hasActiveFilters && (
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${CATEGORY_COLORS[expense.category]}`}
                      >
                        {expense.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(expense.date)}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 truncate">
                      {expense.description}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(expense.amount)}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit expense"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        disabled={deletingId === expense.id}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={handleUpdate}
          onCancel={() => setEditingExpense(undefined)}
        />
      )}
    </>
  );
}
