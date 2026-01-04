# Expense Tracker

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS. Track your personal finances with an intuitive interface, powerful analytics, and local data persistence.

![Expense Tracker](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)

## Features

- **Add Expenses** - Easily log expenses with amount, category, description, and date
- **Expense Management** - Edit and delete existing expenses with a simple, intuitive interface
- **Advanced Filtering** - Filter expenses by category, date range, and search terms
- **Visual Analytics** - Beautiful pie charts showing spending distribution by category
- **Summary Dashboard** - View total spending, monthly totals, averages, and trends
- **Quick Insights** - Most active categories, weekly totals, and largest expenses
- **CSV Export** - Export your expense data to CSV for spreadsheet analysis
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Data Persistence** - All data stored locally in your browser (localStorage)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Storage**: Browser localStorage

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository (or extract the project files)

2. Navigate to the project directory:
   ```bash
   cd expense-tracker
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### Adding an Expense

1. Click the blue **+** button in the bottom-right corner
2. Fill in the expense details:
   - **Amount**: Enter the expense amount (e.g., 25.50)
   - **Category**: Select from Food, Transportation, Entertainment, Shopping, Bills, or Other
   - **Description**: Add a brief description (e.g., "Lunch with colleagues")
   - **Date**: Select the expense date (defaults to today)
3. Click **Add Expense** to save

### Viewing Expenses

- **All Expenses**: Scroll through the complete list of expenses
- **Search**: Use the search bar to find specific expenses by description or category
- **Filter**: Click the **Filters** button to filter by:
  - Category
  - Date range (from/to dates)
- **Sort**: Toggle between newest and oldest dates

### Editing an Expense

1. Find the expense you want to edit in the list
2. Click the **Edit** icon (pencil) button
3. Modify the details
4. Click **Update Expense** to save changes

### Deleting an Expense

1. Find the expense in the list
2. Click the **Trash** icon button
3. The expense will be immediately deleted

### Exporting Data

1. Click the **Export CSV** button in the header
2. A CSV file named `expenses.csv` will download automatically
3. Open in Excel, Google Sheets, or any spreadsheet application

### Understanding Analytics

**Summary Cards** (top of dashboard):
- **Total Spending**: Sum of all recorded expenses
- **This Month**: Current month's spending with trend comparison
- **Average Expense**: Mean expense amount across all entries
- **Total Expenses**: Count of all recorded expenses

**Spending by Category** (pie chart):
- Visual breakdown of spending by category
- Hover over sections for detailed information
- Color-coded for easy identification

**Quick Insights**:
- **Most Active Category**: Category with the most transactions
- **Average per Expense**: Mean transaction amount
- **Total This Week**: Last 7 days of spending
- **Largest Expense**: Highest single transaction

## Project Structure

```
expense-tracker/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx             # Main application page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── SummaryCards.tsx     # Summary statistics cards
│   │   │   └── CategoryChart.tsx    # Pie chart visualization
│   │   └── expenses/
│   │       ├── ExpenseForm.tsx      # Add/edit expense modal
│   │       ├── ExpenseList.tsx      # Expense list with filters
│   │       ├── AddExpenseButton.tsx # Floating add button
│   │       └── ExportButton.tsx     # CSV export button
│   ├── lib/
│   │   ├── storage.ts           # localStorage utilities
│   │   └── utils.ts             # Helper functions
│   └── types/
│       └── expense.ts           # TypeScript type definitions
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tailwind.config.ts           # Tailwind configuration
└── tsconfig.json                # TypeScript configuration
```

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Data Storage

All expense data is stored locally in your browser's localStorage. This means:

- ✅ No account or internet connection required
- ✅ Data persists across browser sessions
- ✅ Complete privacy - data never leaves your device
- ⚠️ Clearing browser data will delete your expenses
- ⚠️ Data is not synced across devices or browsers

For backup purposes, use the **Export CSV** feature regularly.

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires modern browser with localStorage support.

## Customization

### Adding New Categories

Edit `src/types/expense.ts` and `src/components/expenses/ExpenseList.tsx` to add new expense categories:

```typescript
export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other'
  | 'YourNewCategory';  // Add here
```

### Changing Currency

Update the currency in `src/lib/utils.ts`:

```typescript
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',  // Change to EUR, GBP, etc.
  }).format(amount);
};
```

### Theme Colors

Modify colors in `tailwind.config.ts` or component files to match your preferred color scheme.

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted with Node.js

Build command: `npm run build`
Start command: `npm start`

## Performance

- Static page generation for instant loading
- Optimized bundle size (~196 KB First Load JS)
- Efficient state management with React hooks
- Smooth animations and transitions

## License

This project is open source and available for personal and commercial use.

## Support

For issues, questions, or suggestions, please refer to the project repository or create an issue.

---

**Built with ❤️ using Next.js and TypeScript**
