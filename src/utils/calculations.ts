import { SalaryProfile, ExpenseItem, SavingsGoal, AllocationRule, BudgetHealthMetrics, ExpenseCategory } from '../types';
import { CATEGORY_DEFINITIONS } from './constants';

export function formatCurrency(amount: number, symbol: string = '$', includeDecimals: boolean = false): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });
  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}

export function calculateTotalMonthlyIncome(salaryProfile: SalaryProfile): number {
  let total = salaryProfile.baseMonthlyNet;
  if (salaryProfile.additionalIncomes && salaryProfile.additionalIncomes.length > 0) {
    for (const inc of salaryProfile.additionalIncomes) {
      let monthlyEquivalent = inc.amount;
      if (inc.frequency === 'weekly') {
        monthlyEquivalent = (inc.amount * 52) / 12;
      } else if (inc.frequency === 'bi-weekly') {
        monthlyEquivalent = (inc.amount * 26) / 12;
      } else if (inc.frequency === 'semi-monthly') {
        monthlyEquivalent = inc.amount * 2;
      }
      total += monthlyEquivalent;
    }
  }
  return Math.round(total);
}

export function calculateAllocationCaps(totalIncome: number, rule: AllocationRule) {
  const needsCap = Math.round(totalIncome * (rule.needsPercent / 100));
  const wantsCap = Math.round(totalIncome * (rule.wantsPercent / 100));
  const savingsCap = Math.round(totalIncome * (rule.savingsPercent / 100));
  return {
    needsCap,
    wantsCap,
    savingsCap,
  };
}

export function filterExpensesByMonth(expenses: ExpenseItem[], yearMonth: string): ExpenseItem[] {
  return expenses.filter(item => item.date.startsWith(yearMonth));
}

export interface MonthlyExpensesSummary {
  totalSpent: number;
  spentNeeds: number;
  spentWants: number;
  fixedRecurringTotal: number;
  fixedRecurringPaid: number;
  fixedRecurringPending: number;
  variableSpent: number;
  byCategory: Record<ExpenseCategory, { total: number; count: number; name: string; type: 'need' | 'want'; color: string }>;
}

export function calculateExpensesSummary(expenses: ExpenseItem[], yearMonth: string): MonthlyExpensesSummary {
  const monthlyItems = filterExpensesByMonth(expenses, yearMonth);
  
  let totalSpent = 0;
  let spentNeeds = 0;
  let spentWants = 0;
  let fixedRecurringTotal = 0;
  let fixedRecurringPaid = 0;
  let fixedRecurringPending = 0;
  let variableSpent = 0;

  const byCategory = Object.keys(CATEGORY_DEFINITIONS).reduce((acc, catKey) => {
    const key = catKey as ExpenseCategory;
    const def = CATEGORY_DEFINITIONS[key];
    acc[key] = {
      total: 0,
      count: 0,
      name: def.name,
      type: def.type,
      color: def.color,
    };
    return acc;
  }, {} as Record<ExpenseCategory, { total: number; count: number; name: string; type: 'need' | 'want'; color: string }>);

  for (const item of monthlyItems) {
    totalSpent += item.amount;

    if (item.type === 'need') {
      spentNeeds += item.amount;
    } else {
      spentWants += item.amount;
    }

    if (item.isRecurring) {
      fixedRecurringTotal += item.amount;
      if (item.isPaidThisMonth) {
        fixedRecurringPaid += item.amount;
      } else {
        fixedRecurringPending += item.amount;
      }
    } else {
      variableSpent += item.amount;
    }

    if (byCategory[item.category]) {
      byCategory[item.category].total += item.amount;
      byCategory[item.category].count += 1;
    }
  }

  return {
    totalSpent,
    spentNeeds,
    spentWants,
    fixedRecurringTotal,
    fixedRecurringPaid,
    fixedRecurringPending,
    variableSpent,
    byCategory,
  };
}

export function autoDistributeSavingsToGoals(savingsBudget: number, goals: SavingsGoal[]): SavingsGoal[] {
  const automatedGoals = goals.filter(g => g.isAutomated && g.currentAmount < g.targetAmount);
  if (automatedGoals.length === 0 || savingsBudget <= 0) {
    return goals;
  }

  // Priority weight multipliers
  const weights: Record<'high' | 'medium' | 'low', number> = {
    high: 4,
    medium: 2,
    low: 1,
  };

  const totalWeight = automatedGoals.reduce((sum, g) => sum + weights[g.priority], 0);

  return goals.map(goal => {
    if (!goal.isAutomated || goal.currentAmount >= goal.targetAmount) {
      return goal;
    }
    const weight = weights[goal.priority];
    const rawAlloc = Math.round((savingsBudget * (weight / totalWeight)));
    const remainingToTarget = Math.max(0, goal.targetAmount - goal.currentAmount);
    const monthlyAllocation = Math.min(rawAlloc, remainingToTarget);
    return {
      ...goal,
      monthlyAllocation,
    };
  });
}

export function calculateDaysRemainingInMonth(currentDate: Date = new Date()): { daysInMonth: number; currentDay: number; daysRemaining: number } {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = currentDate.getDate();
  const daysRemaining = Math.max(1, daysInMonth - currentDay + 1);
  return { daysInMonth, currentDay, daysRemaining };
}

export function calculateBudgetHealth(
  totalIncome: number,
  caps: { needsCap: number; wantsCap: number; savingsCap: number },
  summary: MonthlyExpensesSummary,
  goals: SavingsGoal[],
  daysRemaining: number
): BudgetHealthMetrics {
  const remainingWants = Math.max(0, caps.wantsCap - summary.spentWants);
  const safeToSpendDaily = Math.round(remainingWants / daysRemaining);

  const totalCommittedSavings = goals.reduce((sum, g) => sum + g.monthlyAllocation, 0);
  const totalAllocatedOut = summary.spentNeeds + summary.spentWants + totalCommittedSavings;
  const projectedMonthEndBalance = totalIncome - totalAllocatedOut;

  // 1. Savings component (max 25 pts)
  const savingsRate = totalIncome > 0 ? (totalCommittedSavings / totalIncome) * 100 : 0;
  const targetSavingsRate = totalIncome > 0 ? (caps.savingsCap / totalIncome) * 100 : 20;
  const savingsScore = Math.min(25, (savingsRate / (targetSavingsRate || 1)) * 25);

  // 2. Needs discipline (max 25 pts)
  const needsRatio = totalIncome > 0 ? (summary.spentNeeds / caps.needsCap) * 100 : 0;
  let needsScore = 25;
  if (needsRatio > 100) {
    needsScore = Math.max(0, 25 - (needsRatio - 100) * 1.2);
  } else {
    needsScore = 25;
  }

  // 3. Wants discipline (max 25 pts)
  const wantsRatio = totalIncome > 0 ? (summary.spentWants / caps.wantsCap) * 100 : 0;
  let wantsScore = 25;
  if (wantsRatio > 100) {
    wantsScore = Math.max(0, 25 - (wantsRatio - 100) * 1.2);
  } else {
    wantsScore = 25;
  }

  // 4. Emergency fund & coverage (max 25 pts)
  const emergencyGoal = goals.find(g => g.category === 'emergency');
  const monthlyEssential = summary.spentNeeds || (totalIncome * 0.5);
  const emergencyFundMonths = emergencyGoal && monthlyEssential > 0 ? emergencyGoal.currentAmount / monthlyEssential : 0;
  const emergencyScore = Math.min(25, (emergencyFundMonths / 3) * 25);

  const totalScore = Math.round(Math.min(100, Math.max(0, savingsScore + needsScore + wantsScore + emergencyScore)));

  let grade: BudgetHealthMetrics['grade'] = 'Needs Attention';
  if (totalScore >= 90) grade = 'A+';
  else if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 68) grade = 'B';
  else if (totalScore >= 50) grade = 'C';

  const burnRatePercent = totalIncome > 0 ? Math.round((summary.totalSpent / totalIncome) * 100) : 0;

  return {
    score: totalScore,
    grade,
    savingsRate: Math.round(savingsRate),
    needsRatio: Math.round(needsRatio),
    wantsRatio: Math.round(wantsRatio),
    safeToSpendDaily,
    projectedMonthEndBalance,
    burnRatePercent,
    daysRemainingInMonth: daysRemaining,
  };
}

export function estimateGoalCompletion(goal: SavingsGoal): { monthsRemaining: number; estimatedCompletionDate: string; onTrack: boolean } {
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  if (remaining === 0) {
    return { monthsRemaining: 0, estimatedCompletionDate: 'Completed', onTrack: true };
  }

  if (!goal.monthlyAllocation || goal.monthlyAllocation <= 0) {
    return { monthsRemaining: 999, estimatedCompletionDate: 'No allocation', onTrack: false };
  }

  const monthsRemaining = Math.ceil(remaining / goal.monthlyAllocation);
  const now = new Date();
  const completionDate = new Date(now.getFullYear(), now.getMonth() + monthsRemaining, 1);
  const yyyy = completionDate.getFullYear();
  const mm = String(completionDate.getMonth() + 1).padStart(2, '0');
  const formattedDate = `${yyyy}-${mm}`;

  let onTrack = true;
  if (goal.targetDate) {
    onTrack = formattedDate <= goal.targetDate;
  }

  return {
    monthsRemaining,
    estimatedCompletionDate: formattedDate,
    onTrack,
  };
}
