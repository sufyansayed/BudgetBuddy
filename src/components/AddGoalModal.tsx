import React, { useState, useEffect } from 'react';
import { 
  X, 
  Target, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  Check, 
  Palette,
  ShieldCheck,
  Plane,
  Laptop,
  GraduationCap,
  TrendingUp,
  PiggyBank
} from 'lucide-react';
import { SavingsGoal, SalaryProfile } from '../types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  salaryProfile: SalaryProfile;
  initialGoal?: SavingsGoal | null;
  onSaveGoal: (goal: SavingsGoal) => void;
}

const PRESET_COLORS = [
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#14b8a6', // Teal
];

const PRESET_ICONS = [
  { name: 'ShieldCheck', label: 'Safety / Emergency', icon: ShieldCheck },
  { name: 'Plane', label: 'Travel & Vacation', icon: Plane },
  { name: 'Laptop', label: 'Tech & Purchase', icon: Laptop },
  { name: 'TrendingUp', label: 'Investments & Growth', icon: TrendingUp },
  { name: 'GraduationCap', label: 'Education & Career', icon: GraduationCap },
  { name: 'PiggyBank', label: 'General Savings', icon: PiggyBank },
];

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  salaryProfile,
  initialGoal,
  onSaveGoal,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialGoal?.title || '');
  const [targetAmount, setTargetAmount] = useState(initialGoal ? String(initialGoal.targetAmount) : '3000');
  const [currentAmount, setCurrentAmount] = useState(initialGoal ? String(initialGoal.currentAmount) : '500');
  const [monthlyAllocation, setMonthlyAllocation] = useState(initialGoal ? String(initialGoal.monthlyAllocation) : '250');
  const [targetDate, setTargetDate] = useState(initialGoal?.targetDate || '2027-01');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(initialGoal?.priority || 'high');
  const [category, setCategory] = useState<SavingsGoal['category']>(initialGoal?.category || 'emergency');
  const [color, setColor] = useState(initialGoal?.color || '#10b981');
  const [iconName, setIconName] = useState(initialGoal?.iconName || 'ShieldCheck');
  const [isAutomated, setIsAutomated] = useState(initialGoal ? initialGoal.isAutomated : true);

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title);
      setTargetAmount(String(initialGoal.targetAmount));
      setCurrentAmount(String(initialGoal.currentAmount));
      setMonthlyAllocation(String(initialGoal.monthlyAllocation));
      setTargetDate(initialGoal.targetDate);
      setPriority(initialGoal.priority);
      setCategory(initialGoal.category);
      setColor(initialGoal.color);
      setIconName(initialGoal.iconName);
      setIsAutomated(initialGoal.isAutomated);
    }
  }, [initialGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;
    const monthly = parseFloat(monthlyAllocation) || 0;

    if (isNaN(target) || target <= 0) return;

    const goal: SavingsGoal = {
      id: initialGoal ? initialGoal.id : `goal-${Date.now()}`,
      title: title.trim() || 'New Goal',
      targetAmount: target,
      currentAmount: current,
      monthlyAllocation: monthly,
      targetDate,
      priority,
      category,
      color,
      iconName,
      isAutomated,
    };

    onSaveGoal(goal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {initialGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
              </h2>
              <p className="text-[11px] text-slate-300">
                Automate monthly contributions from your salary
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
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Goal Name / Objective
            </label>
            <input
              id="input-goal-title"
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 6-Month Emergency Fund, Japan Trip"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Target Amount and Initial Saved */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Target ({salaryProfile.currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs">
                  {salaryProfile.currencySymbol}
                </span>
                <input
                  id="input-goal-target"
                  type="number"
                  min="1"
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Already Saved ({salaryProfile.currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-bold text-xs">
                  {salaryProfile.currencySymbol}
                </span>
                <input
                  id="input-goal-current"
                  type="number"
                  min="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Target Completion Month & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Target Month
              </label>
              <input
                id="input-goal-target-date"
                type="month"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Priority Weight
              </label>
              <select
                id="select-goal-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
              >
                <option value="high">High Priority (4x allocation)</option>
                <option value="medium">Medium Priority (2x allocation)</option>
                <option value="low">Low Priority (1x allocation)</option>
              </select>
            </div>
          </div>

          {/* Visual Icon Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Goal Icon & Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_ICONS.map((item) => {
                const isSelected = iconName === item.name;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setIconName(item.name);
                      if (item.name === 'ShieldCheck') setCategory('emergency');
                      if (item.name === 'Plane') setCategory('travel');
                      if (item.name === 'Laptop') setCategory('purchase');
                      if (item.name === 'TrendingUp') setCategory('investment');
                      if (item.name === 'GraduationCap') setCategory('education');
                      if (item.name === 'PiggyBank') setCategory('other');
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-semibold truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                    color === c ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Contribution Toggle */}
          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-start gap-2.5">
            <input
              id="chk-goal-automated"
              type="checkbox"
              checked={isAutomated}
              onChange={(e) => setIsAutomated(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
            />
            <div>
              <label htmlFor="chk-goal-automated" className="text-xs font-bold text-teal-950 cursor-pointer flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Include in Automatic Monthly Salary Distribution</span>
              </label>
              <p className="text-[11px] text-teal-800 mt-0.5">
                Automatically receives a share of your monthly savings budget based on priority weight.
              </p>
            </div>
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
              <span>{initialGoal ? 'Update Goal' : 'Create Goal'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
