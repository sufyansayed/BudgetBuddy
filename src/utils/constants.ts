import { CategoryBudget, ExpenseCategory, SalaryProfile, ExpenseItem, SavingsGoal } from '../types';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' },
];

export const CATEGORY_DEFINITIONS: Record<ExpenseCategory, { name: string; type: 'need' | 'want'; color: string; bgLight: string; icon: string }> = {
  housing: { name: 'Housing & Rent', type: 'need', color: '#3b82f6', bgLight: '#eff6ff', icon: 'Home' },
  utilities: { name: 'Utilities & Power', type: 'need', color: '#06b6d4', bgLight: '#ecfeff', icon: 'Zap' },
  groceries: { name: 'Groceries & Food', type: 'need', color: '#10b981', bgLight: '#ecfdf5', icon: 'ShoppingCart' },
  transport: { name: 'Transport & Fuel', type: 'need', color: '#6366f1', bgLight: '#eef2ff', icon: 'Car' },
  insurance: { name: 'Insurance & Healthcare', type: 'need', color: '#8b5cf6', bgLight: '#f5f3ff', icon: 'ShieldCheck' },
  health: { name: 'Medical & Fitness', type: 'need', color: '#ec4899', bgLight: '#fdf2f8', icon: 'Activity' },
  dining: { name: 'Dining Out & Cafes', type: 'want', color: '#f97316', bgLight: '#fff7ed', icon: 'Utensils' },
  entertainment: { name: 'Entertainment & Hobbies', type: 'want', color: '#eab308', bgLight: '#fefce8', icon: 'Film' },
  shopping: { name: 'Shopping & Gear', type: 'want', color: '#14b8a6', bgLight: '#f0fdfa', icon: 'ShoppingBag' },
  subscriptions: { name: 'Digital Subscriptions', type: 'want', color: '#a855f7', bgLight: '#faf5ff', icon: 'Tv' },
  personal: { name: 'Personal Care & Lifestyle', type: 'want', color: '#f43f5e', bgLight: '#fff1f2', icon: 'Smile' },
  other: { name: 'Miscellaneous', type: 'want', color: '#64748b', bgLight: '#f8fafc', icon: 'MoreHorizontal' },
};

export const ALLOCATION_PRESETS = [
  {
    name: '50/30/20 Classic' as const,
    needs: 50,
    wants: 30,
    savings: 20,
    description: 'The golden standard of balanced personal finance.',
  },
  {
    name: '70/20/10 Aggressive Savings' as const,
    needs: 50,
    wants: 20,
    savings: 30,
    description: 'Turbo-charge your financial freedom and high-priority goals.',
  },
  {
    name: '60/20/20 Balanced' as const,
    needs: 60,
    wants: 20,
    savings: 20,
    description: 'Ideal for metro cities with slightly higher living costs.',
  },
];

export const INITIAL_SALARY_PROFILE: SalaryProfile = {
  baseMonthlyNet: 4600,
  currency: 'USD',
  currencySymbol: '$',
  payFrequency: 'monthly',
  nextPayday: getNextPaydayFormatted(),
  additionalIncomes: [
    {
      id: 'inc-1',
      name: 'Freelance & Side Gig',
      amount: 450,
      frequency: 'monthly',
      nextPayDate: getNextPaydayFormatted(),
    },
  ],
  allocationRule: {
    ruleName: '50/30/20 Classic',
    needsPercent: 50,
    wantsPercent: 30,
    savingsPercent: 20,
  },
};

function getNextPaydayFormatted(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const yyyy = nextMonth.getFullYear();
  const mm = String(nextMonth.getMonth() + 1).padStart(2, '0');
  const dd = '01';
  return `${yyyy}-${mm}-${dd}`;
}

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: '6-Month Emergency Fund',
    targetAmount: 15000,
    currentAmount: 9400,
    monthlyAllocation: 450,
    targetDate: '2026-12',
    priority: 'high',
    category: 'emergency',
    color: '#10b981', // Emerald
    iconName: 'ShieldCheck',
    isAutomated: true,
  },
  {
    id: 'goal-2',
    title: 'Japan Summer Trip',
    targetAmount: 4200,
    currentAmount: 2600,
    monthlyAllocation: 350,
    targetDate: '2027-06',
    priority: 'medium',
    category: 'travel',
    color: '#3b82f6', // Blue
    iconName: 'Plane',
    isAutomated: true,
  },
  {
    id: 'goal-3',
    title: 'Home Tech & Office Upgrade',
    targetAmount: 2200,
    currentAmount: 1450,
    monthlyAllocation: 210,
    targetDate: '2026-11',
    priority: 'low',
    category: 'purchase',
    color: '#8b5cf6', // Purple
    iconName: 'Laptop',
    isAutomated: true,
  },
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  // Recurring Fixed Bills (Needs)
  {
    id: 'exp-1',
    title: 'Apartment Rent / Lease',
    amount: 1450,
    category: 'housing',
    type: 'need',
    date: '2026-08-01',
    isRecurring: true,
    recurringDueDay: 1,
    isPaidThisMonth: true,
    notes: 'Auto-debit from checking',
  },
  {
    id: 'exp-2',
    title: 'High-speed Fiber Internet',
    amount: 75,
    category: 'utilities',
    type: 'need',
    date: '2026-08-05',
    isRecurring: true,
    recurringDueDay: 5,
    isPaidThisMonth: true,
    notes: 'Work-from-home essential',
  },
  {
    id: 'exp-3',
    title: 'Electricity & Gas Grid',
    amount: 110,
    category: 'utilities',
    type: 'need',
    date: '2026-08-12',
    isRecurring: true,
    recurringDueDay: 12,
    isPaidThisMonth: true,
  },
  {
    id: 'exp-4',
    title: 'Health & Dental Insurance',
    amount: 195,
    category: 'insurance',
    type: 'need',
    date: '2026-08-15',
    isRecurring: true,
    recurringDueDay: 15,
    isPaidThisMonth: true,
  },
  {
    id: 'exp-5',
    title: 'Car Loan & Comprehensive Insurance',
    amount: 320,
    category: 'transport',
    type: 'need',
    date: '2026-08-18',
    isRecurring: true,
    recurringDueDay: 18,
    isPaidThisMonth: true,
  },
  {
    id: 'exp-6',
    title: 'Streaming & Cloud Storage Bundle',
    amount: 38,
    category: 'subscriptions',
    type: 'want',
    date: '2026-08-20',
    isRecurring: true,
    recurringDueDay: 20,
    isPaidThisMonth: true,
  },
  {
    id: 'exp-7',
    title: 'Gym & Climbing Pass',
    amount: 65,
    category: 'health',
    type: 'want',
    date: '2026-08-22',
    isRecurring: true,
    recurringDueDay: 22,
    isPaidThisMonth: true,
  },

  // Variable & Daily Expenses logged this month
  {
    id: 'exp-8',
    title: 'Weekly Trader Joe’s Groceries',
    amount: 142,
    category: 'groceries',
    type: 'need',
    date: '2026-08-03',
    notes: 'Pantry staples and fresh organic produce',
  },
  {
    id: 'exp-9',
    title: 'Subway & Fuel Fill-up',
    amount: 54,
    category: 'transport',
    type: 'need',
    date: '2026-08-07',
  },
  {
    id: 'exp-10',
    title: 'Dinner at Osteria Italiana',
    amount: 88,
    category: 'dining',
    type: 'want',
    date: '2026-08-09',
    notes: 'Weekend dinner with friends',
  },
  {
    id: 'exp-11',
    title: 'Whole Foods Market run',
    amount: 118,
    category: 'groceries',
    type: 'need',
    date: '2026-08-14',
  },
  {
    id: 'exp-12',
    title: 'Specialty Espresso & Bakery',
    amount: 28,
    category: 'dining',
    type: 'want',
    date: '2026-08-17',
  },
  {
    id: 'exp-13',
    title: 'Concert Tickets & Entry',
    amount: 120,
    category: 'entertainment',
    type: 'want',
    date: '2026-08-21',
  },
  {
    id: 'exp-14',
    title: 'Farmers Market Groceries',
    amount: 85,
    category: 'groceries',
    type: 'need',
    date: '2026-08-24',
  },
  {
    id: 'exp-15',
    title: 'Wireless Ergonomic Mouse',
    amount: 79,
    category: 'shopping',
    type: 'want',
    date: '2026-08-25',
  },
];
