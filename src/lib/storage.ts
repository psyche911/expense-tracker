import { Expense, ExpenseFormData } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-data';

export const expenseStorage = {
  getExpenses: (): Expense[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  addExpense: (expenseData: ExpenseFormData): Expense => {
    const expenses = expenseStorage.getExpenses();
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      description: expenseData.description.trim(),
      date: expenseData.date,
      createdAt: new Date().toISOString(),
    };
    expenses.push(newExpense);
    expenseStorage.saveExpenses(expenses);
    return newExpense;
  },

  updateExpense: (id: string, expenseData: ExpenseFormData): Expense | null => {
    const expenses = expenseStorage.getExpenses();
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const updatedExpense: Expense = {
      ...expenses[index],
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      description: expenseData.description.trim(),
      date: expenseData.date,
    };
    expenses[index] = updatedExpense;
    expenseStorage.saveExpenses(expenses);
    return updatedExpense;
  },

  deleteExpense: (id: string): boolean => {
    const expenses = expenseStorage.getExpenses();
    const filteredExpenses = expenses.filter((e) => e.id !== id);
    if (filteredExpenses.length === expenses.length) return false;
    expenseStorage.saveExpenses(filteredExpenses);
    return true;
  },

  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
