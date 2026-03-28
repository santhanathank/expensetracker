# 💰 Expense Tracker - Mobile Web App

A comprehensive monthly expense tracking application built with React and TypeScript. Manage your expenses, set budgets, track recurring costs, and visualize your spending patterns with beautiful charts.

## ✨ Features

### 📊 Dashboard
- Monthly expense summary with total spent
- Budget status overview
- Daily expense trends
- Spending analysis by category
- Visual charts and statistics

### 📝 Expense Management
- Add, edit, and delete expenses
- Categorize expenses (Food, Transport, Entertainment, Utilities, Health, Shopping, Education, Other)
- Sort and filter expenses by date, amount, or category
- Add notes to transactions
- View detailed expense history

### 🎯 Budget Tracking
- Set monthly budgets for each category
- Real-time budget vs. actual spending comparison
- Visual progress bars showing budget utilization
- Status indicators (On Track, At Risk, Exceeded)
- Track remaining budget in each category

### 🔄 Recurring Expenses
- Set up monthly, weekly, or yearly recurring expenses
- Track subscriptions and regular payments
- View total monthly commitment
- Easily manage recurring expense list

### 📱 Responsive Design
- Fully responsive mobile-first design
- Works seamlessly on phones, tablets, and desktops
- Touch-friendly interface
- Optimized for all screen sizes

### 💾 Data Persistence
- All data saved to browser's local storage
- Automatic saving of expenses, budgets, and recurring expenses
- No backend required, completely client-side

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:
```bash
cd "e:\Learning\AI\AI _APPS"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Available Scripts

### Development
```bash
npm run dev     # Start Vite development server with hot reload
```

### Production Build
```bash
npm run build   # Build for production
npm run preview # Preview production build locally
```

### Linting
```bash
npm run lint    # Run ESLint to check code quality
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2
- **Language**: TypeScript
- **Build Tool**: Vite
- **Charts & Visualization**: Recharts
- **Icons**: React Icons
- **Styling**: CSS3 with custom styles
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: Browser LocalStorage API

## 📂 Project Structure

```
src/
├── components/          # React components
│   ├── AddExpense.tsx          # Form for adding expenses
│   ├── AddExpense.css
│   ├── ExpenseList.tsx         # Display and manage expenses
│   ├── ExpenseList.css
│   ├── ExpenseChart.tsx        # Visual charts and analytics
│   ├── ExpenseChart.css
│   ├── MonthlySummary.tsx      # Monthly statistics
│   ├── MonthlySummary.css
│   ├── BudgetTracker.tsx       # Budget management
│   ├── BudgetTracker.css
│   ├── RecurringExpenses.tsx   # Recurring expenses
│   └── RecurringExpenses.css
├── App.tsx             # Main app component
├── App.css
├── types.ts            # TypeScript interfaces
├── main.tsx            # Entry point
└── index.css           # Global styles

public/
└── vite.svg           # Vite logo

index.html             # HTML template
vite.config.ts         # Vite configuration
tsconfig.json          # TypeScript configuration
package.json           # Dependencies and scripts
```

## 💡 Usage Guide

### Adding an Expense
1. Go to the "Expenses" tab
2. Fill in the "Add Expense" form with:
   - Description (required)
   - Amount in dollars (required)
   - Category (required)
   - Date (required)
   - Notes (optional)
3. Click "Add Expense"

### Setting a Budget
1. Navigate to the "Budget" tab
2. Select a category from the dropdown
3. Enter your monthly limit
4. Click "Add Budget"
5. Monitor spending against your budget

### Tracking Recurring Expenses
1. Go to the "Recurring" tab
2. Enter expense details:
   - Description (e.g., "Netflix subscription")
   - Amount
   - Category
   - Frequency (Weekly, Monthly, or Yearly)
   - Start date
3. Click "Add Recurring Expense"

### Viewing Analytics
1. Return to the "Dashboard" tab
2. Select the month you want to analyze
3. View:
   - Total spending and budget status
   - Category breakdown pie chart
   - Daily expense trends
   - Budget status summary

### Filtering and Sorting Expenses
1. In the "Expenses" tab, use the controls at the top:
   - **Sort by**: Date, Amount, or Category
   - **Filter by**: Specific category or all expenses

### Editing an Expense
1. Find the expense in the list
2. Click the ✏️ edit button
3. Update the details inline
4. Click "Save" to confirm or "Cancel" to discard

## 🎨 Design Features

- **Color Palette**: Modern gradient-based design with purple and blue tones
- **User Experience**: Intuitive navigation with emoji indicators
- **Visual Feedback**: Smooth transitions and hover effects
- **Status Indicators**: Color-coded status (green for on-track, yellow for at-risk, red for exceeded)
- **Responsive Grid**: Flexible layouts that adapt to screen size

## 📝 Notes

- Data is stored in your browser's local storage
- Clearing browser cache will delete all data
- For backing up data, consider exporting to a JSON file (feature can be added)
- Works offline once loaded

## 🔒 Privacy

- No data is sent to any server
- All information is stored locally in your browser
- No tracking or analytics

## 🐛 Known Limitations

- Data is not synced across devices
- Limited to browser's local storage capacity
- No user authentication or accounts

## 🚀 Future Enhancements

- Export data to CSV/PDF
- Cloud synchronization
- Multiple currency support
- Advanced recurring expense logic (every other week, custom intervals)
- Expense tagging
- Search functionality
- Dark mode toggle

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork, modify, and improve this application for your needs.

---

**Happy Tracking!** 💰📊
