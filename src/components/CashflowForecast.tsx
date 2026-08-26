import React from 'react';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SalaryProfile, ExpenseItem, SavingsGoal } from '../types';
import { formatCurrency, MonthlyExpensesSummary } from '../utils/calculations';
import { CategoryIcon } from './CategoryIcon';

interface CashflowForecastProps {
  salaryProfile: SalaryProfile;
  totalIncome: number;
  summary: MonthlyExpensesSummary;
  expenses: ExpenseItem[];
  selectedMonth: string;
  daysRemaining: number;
  projectedMonthEndBalance: number;
}

export const CashflowForecast: React.FC<CashflowForecastProps> = ({
  salaryProfile,
  totalIncome,
  summary,
  expenses,
  selectedMonth,
  daysRemaining,
  projectedMonthEndBalance,
}) => {
  const currencySymbol = salaryProfile.currencySymbol;
  
  // Find upcoming unpaid recurring bills this month
  const today = new Date();
  const currentDay = today.getDate();

  const monthlyItems = expenses.filter(e => e.date.startsWith(selectedMonth));
  const upcomingBills = monthlyItems
    .filter(e => e.isRecurring && !e.isPaidThisMonth)
    .sort((a, b) => (a.recurringDueDay || 0) - (b.recurringDueDay || 0));

  const totalUpcomingBills = upcomingBills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Cashflow Timeline & Pacing Forecast
            </h2>
            <p className="text-xs text-slate-500">
              Projected liquidity before the next paycheck arrives
            </p>
          </div>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
          projectedMonthEndBalance >= 0 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {projectedMonthEndBalance >= 0 ? 'Surplus Expected' : 'Deficit Risk'}
        </span>
      </div>

      {/* Trajectory Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Step 1: Starting Inflow */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            1. Total Month Inflow
          </span>
          <div className="text-lg font-extrabold text-slate-900 my-1">
            {formatCurrency(totalIncome, currencySymbol)}
          </div>
          <span className="text-[11px] text-slate-500">
            Net salary + side streams
          </span>
        </div>

        {/* Step 2: Outflow committed */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            2. Spent & Bills Due
          </span>
          <div className="text-lg font-extrabold text-blue-900 my-1">
            -{formatCurrency(summary.totalSpent + totalUpcomingBills, currencySymbol)}
          </div>
          <span className="text-[11px] text-slate-500">
            {formatCurrency(summary.totalSpent, currencySymbol)} spent + {formatCurrency(totalUpcomingBills, currencySymbol)} due
          </span>
        </div>

        {/* Step 3: Projected Net Surplus */}
        <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
          projectedMonthEndBalance >= 0 
            ? 'bg-emerald-50/70 border-emerald-200' 
            : 'bg-rose-50/70 border-rose-200'
        }`}>
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            3. Projected End Balance
          </span>
          <div className={`text-lg font-extrabold my-1 ${
            projectedMonthEndBalance >= 0 ? 'text-emerald-900' : 'text-rose-900'
          }`}>
            {formatCurrency(projectedMonthEndBalance, currencySymbol)}
          </div>
          <span className="text-[11px] font-medium text-slate-600">
            {daysRemaining} days until month close
          </span>
        </div>

      </div>

      {/* Upcoming Scheduled Bills Alert */}
      {upcomingBills.length > 0 ? (
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="text-xs text-amber-900">
              <strong className="font-bold">{upcomingBills.length} Upcoming Fixed Bills:</strong>{' '}
              {upcomingBills.map(b => `${b.title} (${formatCurrency(b.amount, currencySymbol)})`).join(', ')}
            </div>
          </div>
          <span className="text-xs font-extrabold text-amber-950 shrink-0">
            Total {formatCurrency(totalUpcomingBills, currencySymbol)}
          </span>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All recurring fixed bills for this month have been marked paid!</span>
        </div>
      )}

    </div>
  );
};
