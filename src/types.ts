export type PayFrequency = 'monthly' | 'bi-weekly' | 'semi-monthly' | 'weekly';

export type ExpenseType = 'need' | 'want' | 'recurring_bill';

export type ExpenseCategory = 
  | 'housing' 
  | 'utilities' 
  | 'groceries' 
  | 'transport' 
  | 'insurance' 
  | 'health' 
  | 'dining' 
  | 'entertainment' 
  | 'shopping' 
  | 'subscriptions' 
  | 'personal' 
  | 'other';

export interface CategoryBudget {
  category: ExpenseCategory;
  name: string;
  type: 'need' | 'want';
  monthlyCap: number;
  iconName: string;
  color: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  type: ExpenseType;
  date: string; // YYYY-MM-DD
  notes?: string;
  isRecurring?: boolean;
  recurringDueDay?: number; // 1-31
  isPaidThisMonth?: boolean;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  monthlyAllocation: number; // Auto-calculated or customized
  targetDate: string; // YYYY-MM
  priority: 'high' | 'medium' | 'low';
  category: 'emergency' | 'travel' | 'purchase' | 'investment' | 'education' | 'other';
  color: string;
  iconName: string;
  isAutomated: boolean; // Auto-receive slice of monthly savings
}

export interface AllocationRule {
  needsPercent: number; // e.g. 50
  wantsPercent: number; // e.g. 30
  savingsPercent: number; // e.g. 20
  ruleName: '50/30/20 Classic' | '70/20/10 Aggressive Savings' | '60/20/20 Balanced' | 'Custom';
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: PayFrequency;
  nextPayDate: string; // YYYY-MM-DD
}

export interface SalaryProfile {
  baseMonthlyNet: number;
  currency: string;
  currencySymbol: string;
  payFrequency: PayFrequency;
  nextPayday: string; // YYYY-MM-DD
  additionalIncomes: IncomeSource[];
  allocationRule: AllocationRule;
}

export interface BudgetHealthMetrics {
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'Needs Attention';
  savingsRate: number; // percentage
  needsRatio: number; // percentage
  wantsRatio: number; // percentage
  safeToSpendDaily: number;
  projectedMonthEndBalance: number;
  burnRatePercent: number;
  daysRemainingInMonth: number;
}
