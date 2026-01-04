'use client';

import { Download } from 'lucide-react';
import { Expense } from '@/types/expense';
import { downloadCSV } from '@/lib/utils';

interface ExportButtonProps {
  expenses: Expense[];
  filename?: string;
}

export default function ExportButton({ expenses, filename = 'expenses.csv' }: ExportButtonProps) {
  const handleExport = () => {
    downloadCSV(expenses, filename);
  };

  return (
    <button
      onClick={handleExport}
      disabled={expenses.length === 0}
      className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
}
