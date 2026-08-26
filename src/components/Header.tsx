import React, { useState } from 'react';
import { 
  Wallet, 
  ChevronLeft, 
  ChevronRight, 
  Settings2, 
  Plus, 
  Download, 
  RotateCcw, 
  Calendar,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { SalaryProfile } from '../types';
import { CURRENCIES } from '../utils/constants';
import { formatCurrency, calculateTotalMonthlyIncome } from '../utils/calculations';

interface HeaderProps {
  salaryProfile: SalaryProfile;
  selectedMonth: string; // YYYY-MM
  onMonthChange: (month: string) => void;
  onOpenSalaryConfig: () => void;
  onOpenAddExpense: () => void;
  onOpenAddGoal: () => void;
  onCurrencyChange: (code: string, symbol: string) => void;
  onResetData: () => void;
  onExportData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  salaryProfile,
  selectedMonth,
  onMonthChange,
  onOpenSalaryConfig,
  onOpenAddExpense,
  onOpenAddGoal,
  onCurrencyChange,
  onResetData,
  onExportData,
}) => {
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Month navigation helpers
  const [yearStr, monthStr] = selectedMonth.split('-');
  const currentDate = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const yyyy = prevDate.getFullYear();
    const mm = String(prevDate.getMonth() + 1).padStart(2, '0');
    onMonthChange(`${yyyy}-${mm}`);
  };

  const handleNextMonth = () => {
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const yyyy = nextDate.getFullYear();
    const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
    onMonthChange(`${yyyy}-${mm}`);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    onMonthChange(`${yyyy}-${mm}`);
  };

  const totalMonthlyIncome = calculateTotalMonthlyIncome(salaryProfile);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3.5">
          
          {/* Brand Logo and Subtitle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Budget<span className="text-emerald-600">Buddy</span>
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Auto-Budgeting
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Smart salary allocation & automated goal tracking
                </p>
              </div>
            </div>

            {/* Mobile Actions Dropdown Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                id="btn-mobile-add-expense"
                onClick={onOpenAddExpense}
                className="p-2 rounded-lg bg-emerald-600 text-white font-medium text-xs flex items-center gap-1"
                aria-label="Add Expense"
              >
                <Plus className="w-4 h-4" />
                <span>Log</span>
              </button>
            </div>
          </div>

          {/* Month Selector & Payday widget */}
          <div className="flex items-center justify-between sm:justify-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button
              id="btn-prev-month"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              id="btn-current-month-label"
              onClick={handleCurrentMonth}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-semibold text-slate-800 hover:bg-white hover:shadow-xs transition-all"
              title="Click to jump to current month"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{monthName}</span>
            </button>

            <button
              id="btn-next-month"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-xs transition-all"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Controls: Currency, Salary Config, Add Actions */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
            
            {/* Currency Picker */}
            <div className="relative">
              <select
                id="select-currency"
                value={salaryProfile.currency}
                onChange={(e) => {
                  const curr = CURRENCIES.find(c => c.code === e.target.value);
                  if (curr) onCurrencyChange(curr.code, curr.symbol);
                }}
                className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg px-2.5 py-2 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                title="Select Currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary Setup Button */}
            <button
              id="btn-open-salary-config"
              onClick={onOpenSalaryConfig}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all shadow-xs"
              title="Configure salary and 50/30/20 allocation rules"
            >
              <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Salary & Rules:</span>
              <span className="font-bold text-emerald-400">
                {formatCurrency(totalMonthlyIncome, salaryProfile.currencySymbol)}/mo
              </span>
            </button>

            {/* Action Buttons: Add Expense and Add Goal */}
            <div className="flex items-center gap-1.5">
              <button
                id="btn-header-add-goal"
                onClick={onOpenAddGoal}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-teal-600" />
                <span>New Goal</span>
              </button>

              <button
                id="btn-header-add-expense"
                onClick={onOpenAddExpense}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Expense</span>
              </button>

              {/* Utility Dropdown (Export, Reset) */}
              <div className="relative">
                <button
                  id="btn-more-options"
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs transition-all"
                  title="Data & Backup Options"
                >
                  <Download className="w-4 h-4" />
                </button>

                {showMoreActions && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowMoreActions(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs text-slate-700">
                      <button
                        id="btn-export-backup"
                        onClick={() => {
                          onExportData();
                          setShowMoreActions(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 font-medium"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Export Backup JSON</span>
                      </button>
                      <button
                        id="btn-reset-demo"
                        onClick={() => {
                          if (window.confirm('Reset all budget, expenses, and goals to demo defaults?')) {
                            onResetData();
                          }
                          setShowMoreActions(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Demo Data</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
