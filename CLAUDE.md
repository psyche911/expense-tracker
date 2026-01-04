# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Dependencies
npm install          # Install all dependencies
```

## Architecture Overview

This is a client-side expense tracking application using Next.js 14 App Router. All data persistence is handled via browser localStorage - no backend or database is required.

### Data Flow Architecture

1. **State Management**: React hooks (useState, useEffect) in the main page component (`src/app/page.tsx`)
2. **Data Layer**: `expenseStorage` utilities in `src/lib/storage.ts` handle all localStorage CRUD operations
3. **Component Layer**: Components are stateless and receive data via props + callback functions

Key pattern: The main page (`src/app/page.tsx`) is the single source of truth. All expense operations flow through it:
- On mount: loads expenses from localStorage via `expenseStorage.getExpenses()`
- Add: receives form data, calls `expenseStorage.addExpense()`, updates local state
- Update: receives updated data, calls `expenseStorage.updateExpense()`, updates local state
- Delete: receives ID, calls `expenseStorage.deleteExpense()`, updates local state

### Component Organization

- **Dashboard components** (`src/components/dashboard/`): Read-only visualizations that receive expense arrays as props
- **Expense components** (`src/components/expenses/`): Interactive components that call callbacks to modify data
- **No shared state**: Components don't manage their own state - all mutations flow up to the parent

### Type System

All expense types are defined in `src/types/expense.ts`. The `ExpenseFormData` type is used for form submissions (amount as string), while `Expense` type is for stored data (amount as number).

### Important Implementation Details

1. **Hydration Safety**: The main page uses a `mounted` state pattern to prevent localStorage access during SSR, avoiding hydration mismatches

2. **Filtering Logic**: `ExpenseList` component handles all filtering/sorting internally on the expense array it receives (doesn't modify the original data)

3. **Category Consistency**: When adding new categories, you must update:
   - `src/types/expense.ts` (ExpenseCategory type)
   - `src/components/expenses/ExpenseList.tsx` (CATEGORIES array and CATEGORY_COLORS)
   - `src/components/dashboard/CategoryChart.tsx` (CATEGORY_COLORS)

4. **Date Handling**: All dates are stored as ISO date strings (YYYY-MM-DD) for consistency

5. **Chart Library**: Uses Recharts - the CustomTooltip component needs proper typing as Recharts types can be tricky

### Storage Key

The localStorage key is hardcoded as `'expense-tracker-data'` in `src/lib/storage.ts`. If you change this, existing user data will be lost.

### Styling Approach

- Tailwind CSS with a custom gradient background (`bg-gradient-to-br from-gray-50 to-gray-100`)
- Color-coded categories with consistent styling across components
- Responsive grid layouts using `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` pattern
