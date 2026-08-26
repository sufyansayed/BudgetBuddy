import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  PiggyBank, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { SalaryProfile, SavingsGoal } from '../types';
import { MonthlyExpensesSummary, formatCurrency } from '../utils/calculations';

interface BudgetRuleProgressProps {
  salaryProfile: SalaryProfile;
  totalIncome: number;
  caps: { needsCap: number; wantsCap: number; savingsCap: number };
  summary: MonthlyExpensesSummary;
  goals: SavingsGoal[];
  onOpenSalaryConfig: () => void;
  onOpenAddExpense: (defaultType?: 'need' | 'want') => void;
}

export const BudgetRuleProgress: React.FC<BudgetRuleProgressProps> = ({
  salaryProfile,
  totalIncome,
  caps,
  summary,
  goals,
  onOpenSalaryConfig,
  onOpenAddExpense,
}) => {
  const currencySymbol = salaryProfile.currencySymbol;
  const rule = salaryProfile.allocationRule;

  // Needs calculations
  const needsSpent = summary.spentNeeds;
  const needsCap = caps.needsCap;
  const needsPercent = needsCap > 0 ? Math.round((needsSpent / needsCap) * 100) : 0;
  const needsRemaining = needsCap - needsSpent;

  // Wants calculations
  const wantsSpent = summary.spentWants;
  const wantsCap = caps.wantsCap;
  const wantsPercent = wantsCap > 0 ? Math.round((wantsSpent / wantsCap) * 100) : 0;
  const wantsRemaining = wantsCap - wantsSpent;

  // Savings calculations
  const savingsAllocated = goals.reduce((sum, g) => sum + g.monthlyAllocation, 0);
  const savingsCap = caps.savingsCap;
  const savingsPercent = savingsCap > 0 ? Math.round((savingsAllocated / savingsCap) * 100) : 0;
  const savingsRemaining = savingsCap - savingsAllocated;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      
      {/* Header section with rule name and edit shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
            {rule.needsPercent}/{rule.wantsPercent}/{rule.savingsPercent}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Automated Salary Allocation ({rule.ruleName})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Each paycheck is automatically budgeted into Needs, Wants, and Savings pools
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSalaryConfig}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Change formula</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        
        {/* PILLAR 1: NEEDS */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-blue-900">
                  Needs ({rule.needsPercent}%)
                </span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                needsSpent > needsCap 
                  ? 'bg-rose-100 text-rose-700' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {needsPercent}% Spent
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-xl font-extrabold text-slate-900">
                {formatCurrency(needsSpent, currencySymbol)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                of {formatCurrency(needsCap, currencySymbol)} cap
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-blue-200/60 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  needsSpent > needsCap ? 'bg-rose-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, needsPercent)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-blue-100 text-xs">
            <span className={needsRemaining >= 0 ? 'text-slate-600' : 'text-rose-600 font-semibold'}>
              {needsRemaining >= 0 
                ? `${formatCurrency(needsRemaining, currencySymbol)} left`
                : `${formatCurrency(Math.abs(needsRemaining), currencySymbol)} over limit`}
            </span>
            <button
              onClick={() => onOpenAddExpense('need')}
              className="text-[11px] font-bold text-blue-700 hover:underline"
            >
              + Log Need
            </button>
          </div>
        </div>

        {/* PILLAR 2: WANTS */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900">
                  Wants ({rule.wantsPercent}%)
                </span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                wantsSpent > wantsCap 
                  ? 'bg-rose-100 text-rose-700' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {wantsPercent}% Spent
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-xl font-extrabold text-slate-900">
                {formatCurrency(wantsSpent, currencySymbol)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                of {formatCurrency(wantsCap, currencySymbol)} cap
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-amber-200/60 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  wantsSpent > wantsCap ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, wantsPercent)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-xs">
            <span className={wantsRemaining >= 0 ? 'text-slate-600' : 'text-rose-600 font-semibold'}>
              {wantsRemaining >= 0 
                ? `${formatCurrency(wantsRemaining, currencySymbol)} available`
                : `${formatCurrency(Math.abs(wantsRemaining), currencySymbol)} over limit`}
            </span>
            <button
              onClick={() => onOpenAddExpense('want')}
              className="text-[11px] font-bold text-amber-700 hover:underline"
            >
              + Log Want
            </button>
          </div>
        </div>

        {/* PILLAR 3: SAVINGS & GOALS */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <PiggyBank className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900">
                  Savings & Goals ({rule.savingsPercent}%)
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {savingsPercent}% Assigned
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-xl font-extrabold text-slate-900">
                {formatCurrency(savingsAllocated, currencySymbol)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                of {formatCurrency(savingsCap, currencySymbol)} target
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-emerald-200/60 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all"
                style={{ width: `${Math.min(100, savingsPercent)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-100 text-xs">
            <span className="text-emerald-800 font-medium">
              {goals.filter(g => g.isAutomated).length} goals auto-funded
            </span>
            <span className="text-[11px] font-bold text-emerald-700">
              {savingsRemaining > 0 ? `${formatCurrency(savingsRemaining, currencySymbol)} unassigned` : '100% Optimized'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
