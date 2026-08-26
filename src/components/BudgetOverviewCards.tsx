import React from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  PiggyBank, 
  Zap, 
  Calendar, 
  Activity,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { SalaryProfile, BudgetHealthMetrics } from '../types';
import { MonthlyExpensesSummary, formatCurrency } from '../utils/calculations';

interface BudgetOverviewCardsProps {
  salaryProfile: SalaryProfile;
  totalIncome: number;
  caps: { needsCap: number; wantsCap: number; savingsCap: number };
  summary: MonthlyExpensesSummary;
  health: BudgetHealthMetrics;
  daysRemaining: number;
  onOpenSalaryConfig: () => void;
}

export const BudgetOverviewCards: React.FC<BudgetOverviewCardsProps> = ({
  salaryProfile,
  totalIncome,
  caps,
  summary,
  health,
  daysRemaining,
  onOpenSalaryConfig,
}) => {
  const currencySymbol = salaryProfile.currencySymbol;
  const remainingTotalBudget = Math.max(0, totalIncome - summary.totalSpent);
  const remainingWants = Math.max(0, caps.wantsCap - summary.spentWants);
  const spentPercent = totalIncome > 0 ? Math.min(100, Math.round((summary.totalSpent / totalIncome) * 100)) : 0;

  // Grade color helper
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-emerald-700 bg-emerald-100 border-emerald-300';
      case 'B':
        return 'text-blue-700 bg-blue-100 border-blue-300';
      case 'C':
        return 'text-amber-700 bg-amber-100 border-amber-300';
      default:
        return 'text-rose-700 bg-rose-100 border-rose-300';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* CARD 1: TOTAL MONTHLY INCOME */}
      <div 
        id="card-total-income"
        onClick={onOpenSalaryConfig}
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Monthly Net Income
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(totalIncome, currencySymbol)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="truncate">
            Base: {formatCurrency(salaryProfile.baseMonthlyNet, currencySymbol)}
            {salaryProfile.additionalIncomes && salaryProfile.additionalIncomes.length > 0 && (
              <span className="text-emerald-600 font-semibold ml-1">
                +{formatCurrency(totalIncome - salaryProfile.baseMonthlyNet, currencySymbol)} side
              </span>
            )}
          </span>
          <span className="text-emerald-700 font-semibold text-[11px] group-hover:underline flex items-center gap-0.5">
            Rules <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* CARD 2: MONTHLY SPENT & BURN RATE */}
      <div 
        id="card-total-spent"
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Spent This Month
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(summary.totalSpent, currencySymbol)}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            / {formatCurrency(totalIncome, currencySymbol)}
          </span>
        </div>

        {/* Burn bar */}
        <div className="space-y-1 pt-1">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                spentPercent > 90 ? 'bg-rose-500' : spentPercent > 75 ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, spentPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{spentPercent}% of salary spent</span>
            <span className="font-semibold text-slate-700">
              {formatCurrency(remainingTotalBudget, currencySymbol)} left
            </span>
          </div>
        </div>
      </div>

      {/* CARD 3: DAILY SAFE-TO-SPEND */}
      <div 
        id="card-safe-to-spend"
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Safe-To-Spend Daily
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(health.safeToSpendDaily, currencySymbol)}
          </span>
          <span className="text-xs font-semibold text-amber-700">
            / day
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>{daysRemaining} days left in month</span>
          <span className="font-semibold text-slate-700">
            {formatCurrency(remainingWants, currencySymbol)} wants pool
          </span>
        </div>
      </div>

      {/* CARD 4: AUTOMATED SAVINGS & HEALTH SCORE */}
      <div 
        id="card-budget-health"
        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Savings & Health Score
          </span>
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(caps.savingsCap, currencySymbol)}
              <span className="text-xs font-normal text-slate-500 ml-1">/mo</span>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border ${getGradeColor(health.grade)} flex items-center gap-1`}>
            <span>Grade {health.grade}</span>
            <span className="text-[10px] font-bold opacity-80">({health.score}/100)</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            {health.savingsRate}% savings target
          </span>
          <span className="text-slate-600 font-medium">
            Auto-allocated
          </span>
        </div>
      </div>

    </div>
  );
};
