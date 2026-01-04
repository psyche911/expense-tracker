'use client';

import { Plus } from 'lucide-react';

interface AddExpenseButtonProps {
  onClick: () => void;
}

export default function AddExpenseButton({ onClick }: AddExpenseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 group z-40"
      aria-label="Add new expense"
    >
      <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
    </button>
  );
}
