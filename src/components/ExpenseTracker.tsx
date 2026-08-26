import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Trash2, 
  Receipt, 
  Repeat, 
  ArrowDownRight,
  TrendingDown,
  Layers,
  Check
} from 'lucide-react';
import { ExpenseItem, ExpenseCategory, SalaryProfile } from '../types';
import { CATEGORY_DEFINITIONS } from '../utils/constants';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, MonthlyExpensesSummary } from '../utils/calculations';

interface ExpenseTrackerProps {
  expenses: ExpenseItem[];
  salaryProfile: SalaryProfile;
  selectedMonth: string; // YYYY-MM
  summary: MonthlyExpensesSummary;
  onAddExpense: (defaultType?: 'need' | 'want', isRecurring?: boolean) => void;
  onDeleteExpense: (id: string) => void;
  onToggleRecurringPaid: (id: string) => void;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  salaryProfile,
  selectedMonth,
  summary,
  onAddExpense,
  onDeleteExpense,
  onToggleRecurringPaid,
}) => {
  const currencySymbol = salaryProfile.currencySymbol;
  const [activeTab, setActiveTab] = useState<'all' | 'recurring' | 'categories'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter expenses for selected month
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));

  // Search and filter logic
  const filteredExpenses = monthlyExpenses.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Recurring bills subset
  const recurringBills = monthlyExpenses.filter(e => e.isRecurring);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Monthly Expenses & Recurring Bills
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {monthlyExpenses.length} Logged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track daily variable expenses and automated fixed subscriptions
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            id="tab-all-expenses"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Expenses ({monthlyExpenses.length})
          </button>
          
          <button
            id="tab-recurring-bills"
            onClick={() => setActiveTab('recurring')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'recurring'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Repeat className="w-3 h-3 text-blue-600" />
            <span>Fixed Bills ({recurringBills.length})</span>
          </button>

          <button
            id="tab-category-breakdown"
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'categories'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3 h-3 text-teal-600" />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ALL EXPENSES (SEARCHABLE & FILTERABLE) */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="input-expense-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search expense by title or note..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                id="select-filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_DEFINITIONS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.name}
                  </option>
                ))}
              </select>

              <select
                id="select-filter-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="need">Essential Needs</option>
                <option value="want">Lifestyle Wants</option>
              </select>

              <button
                id="btn-add-expense-quick"
                onClick={() => onAddExpense()}
                className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </div>

          {/* List of expenses */}
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No matching expenses found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try clearing filters or logging a new transaction.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {filteredExpenses
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item) => {
                  const catDef = CATEGORY_DEFINITIONS[item.category] || CATEGORY_DEFINITIONS.other;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 group"
                    >
                      {/* Left: Category Icon & Title */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: catDef.color }}
                        >
                          <CategoryIcon category={item.category} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {item.title}
                            </span>
                            {item.isRecurring && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded border border-blue-200 shrink-0">
                                <Repeat className="w-2.5 h-2.5" /> Recurring
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>{catDef.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {item.date}
                            </span>
                            {item.notes && (
                              <>
                                <span>•</span>
                                <span className="text-slate-400 italic truncate max-w-[150px] sm:max-w-xs">
                                  "{item.notes}"
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount, Type Badge & Delete */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize hidden sm:inline-block ${
                          item.type === 'need'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {item.type}
                        </span>

                        <span className="text-sm font-extrabold text-slate-900">
                          {formatCurrency(item.amount, currencySymbol)}
                        </span>

                        <button
                          onClick={() => onDeleteExpense(item.id)}
                          className="p-1 text-slate-300 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors opacity-80 group-hover:opacity-100"
                          title="Delete Expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: FIXED MONTHLY BILLS & SUBSCRIPTIONS */}
      {activeTab === 'recurring' && (
        <div className="space-y-4">
          
          {/* Recurring Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            <div>
              <span className="text-xs text-blue-900 font-semibold">Total Monthly Fixed Obligations:</span>
              <div className="text-lg font-extrabold text-blue-950 mt-0.5">
                {formatCurrency(summary.fixedRecurringTotal, currencySymbol)}
              </div>
            </div>
            <div>
              <span className="text-xs text-emerald-800 font-semibold">Paid / Cleared:</span>
              <div className="text-lg font-extrabold text-emerald-900 mt-0.5">
                {formatCurrency(summary.fixedRecurringPaid, currencySymbol)}
              </div>
            </div>
            <div>
              <span className="text-xs text-amber-800 font-semibold">Pending Due:</span>
              <div className="text-lg font-extrabold text-amber-900 mt-0.5">
                {formatCurrency(summary.fixedRecurringPending, currencySymbol)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Recurring Subscriptions & Bills Schedule
            </span>
            <button
              onClick={() => onAddExpense('need', true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Recurring Bill</span>
            </button>
          </div>

          {recurringBills.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Repeat className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No recurring bills added</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Add rent, subscriptions, insurance, and utilities.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recurringBills
                .sort((a, b) => (a.recurringDueDay || 1) - (b.recurringDueDay || 1))
                .map((bill) => {
                  const catDef = CATEGORY_DEFINITIONS[bill.category] || CATEGORY_DEFINITIONS.other;
                  const isPaid = bill.isPaidThisMonth;

                  return (
                    <div
                      key={bill.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isPaid
                          ? 'bg-slate-50/60 border-slate-200 opacity-90'
                          : 'bg-white border-amber-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => onToggleRecurringPaid(bill.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            isPaid
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-slate-300 text-transparent hover:border-emerald-500'
                          }`}
                          title={isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold truncate ${isPaid ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                              {bill.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                              Day {bill.recurringDueDay || bill.date.split('-')[2]}
                            </span>
                            <span>{catDef.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-xs font-extrabold text-slate-900">
                            {formatCurrency(bill.amount, currencySymbol)}
                          </div>
                          <span className={`text-[10px] font-bold ${isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {isPaid ? 'Paid' : 'Due this month'}
                          </span>
                        </div>

                        <button
                          onClick={() => onDeleteExpense(bill.id)}
                          className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                          title="Delete Bill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

        </div>
      )}

      {/* TAB 3: CATEGORY SPENDING BREAKDOWN */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.entries(summary.byCategory) as [ExpenseCategory, { total: number; count: number; name: string; type: 'need' | 'want'; color: string }][])
              .filter(([_, data]) => data.total > 0)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([catKey, data]) => {
                const categoryPercent = summary.totalSpent > 0 
                  ? Math.round((data.total / summary.totalSpent) * 100) 
                  : 0;

                return (
                  <div
                    key={catKey}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-xs"
                            style={{ backgroundColor: data.color }}
                          >
                            <CategoryIcon category={catKey} className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900">{data.name}</span>
                            <span className="text-[10px] text-slate-500 ml-1.5 font-medium">({data.count} items)</span>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatCurrency(data.total, currencySymbol)}
                        </span>
                      </div>

                      {/* Bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1.5">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${categoryPercent}%`,
                            backgroundColor: data.color,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="capitalize">{data.type} obligation</span>
                      <span className="font-bold text-slate-700">{categoryPercent}% of month spend</span>
                    </div>
                  </div>
                );
              })}
          </div>

          {summary.totalSpent === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
              No category spending recorded for this month yet.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
