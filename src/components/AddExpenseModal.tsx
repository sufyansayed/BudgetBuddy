import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Receipt, 
  DollarSign, 
  Calendar, 
  Repeat, 
  Check, 
  Tag, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ExpenseItem, ExpenseCategory, ExpenseType, SalaryProfile } from '../types';
import { CATEGORY_DEFINITIONS } from '../utils/constants';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  salaryProfile: SalaryProfile;
  defaultType?: 'need' | 'want';
  isRecurringDefault?: boolean;
  onSaveExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  salaryProfile,
  defaultType = 'need',
  isRecurringDefault = false,
  onSaveExpense,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('groceries');
  const [type, setType] = useState<ExpenseType>(defaultType);
  const [date, setDate] = useState(todayStr);
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(isRecurringDefault);
  const [recurringDueDay, setRecurringDueDay] = useState(new Date().getDate());

  const handleCategoryChange = (newCat: ExpenseCategory) => {
    setCategory(newCat);
    // Auto sync type based on category definition
    const catDef = CATEGORY_DEFINITIONS[newCat];
    if (catDef) {
      setType(catDef.type);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onSaveExpense({
      title: title.trim() || 'Expense',
      amount: numAmount,
      category,
      type,
      date,
      notes: notes.trim() || undefined,
      isRecurring,
      recurringDueDay: isRecurring ? Number(recurringDueDay) : undefined,
      isPaidThisMonth: isRecurring ? true : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Log Expense / Bill</h2>
              <p className="text-[11px] text-slate-300">
                Track your monthly cash outflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Amount input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Amount ({salaryProfile.currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-base">
                {salaryProfile.currencySymbol}
              </span>
              <input
                id="input-expense-amount"
                type="number"
                min="0.01"
                step="any"
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Title / Vendor
            </label>
            <input
              id="input-expense-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trader Joe's, Electricity, Netflix"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category
            </label>
            <select
              id="select-expense-category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
            >
              {Object.entries(CATEGORY_DEFINITIONS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.name} ({val.type === 'need' ? 'Need' : 'Want'})
                </option>
              ))}
            </select>
          </div>

          {/* Type Switcher: Need vs Want */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Budget Classification
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('need')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  type === 'need'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Essential Need (50%)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('want')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  type === 'want'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lifestyle Want (30%)</span>
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Transaction Date
            </label>
            <input
              id="input-expense-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Recurring Toggle */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label htmlFor="chk-is-recurring" className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-blue-600" />
                <span>Repeat Every Month (Fixed Bill)</span>
              </label>
              <input
                id="chk-is-recurring"
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
              />
            </div>

            {isRecurring && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Due on Day of Month:</span>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={recurringDueDay}
                  onChange={(e) => setRecurringDueDay(parseInt(e.target.value, 10) || 1)}
                  className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Optional Notes / Receipt Reference
            </label>
            <input
              id="input-expense-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Split with room-mate"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Transaction</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
