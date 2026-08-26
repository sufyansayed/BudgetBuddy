import React, { useState } from 'react';
import { 
  X, 
  DollarSign, 
  PieChart, 
  Calendar, 
  Plus, 
  Trash2, 
  Check, 
  Sparkles, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { SalaryProfile, IncomeSource, AllocationRule, PayFrequency } from '../types';
import { ALLOCATION_PRESETS } from '../utils/constants';
import { formatCurrency, calculateTotalMonthlyIncome, calculateAllocationCaps } from '../utils/calculations';

interface SalaryConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  salaryProfile: SalaryProfile;
  onSave: (updatedProfile: SalaryProfile, shouldAutoReallocateGoals: boolean) => void;
}

export const SalaryConfigModal: React.FC<SalaryConfigModalProps> = ({
  isOpen,
  onClose,
  salaryProfile,
  onSave,
}) => {
  if (!isOpen) return null;

  const [baseMonthlyNet, setBaseMonthlyNet] = useState<number>(salaryProfile.baseMonthlyNet);
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(salaryProfile.payFrequency);
  const [nextPayday, setNextPayday] = useState<string>(salaryProfile.nextPayday);
  const [additionalIncomes, setAdditionalIncomes] = useState<IncomeSource[]>(
    salaryProfile.additionalIncomes || []
  );

  const [allocationRule, setAllocationRule] = useState<AllocationRule>(
    salaryProfile.allocationRule || {
      ruleName: '50/30/20 Classic',
      needsPercent: 50,
      wantsPercent: 30,
      savingsPercent: 20,
    }
  );

  const [autoReallocateGoals, setAutoReallocateGoals] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'salary' | 'allocation'>('salary');

  // Draft profile for live calculations
  const draftProfile: SalaryProfile = {
    ...salaryProfile,
    baseMonthlyNet: Number(baseMonthlyNet) || 0,
    payFrequency,
    nextPayday,
    additionalIncomes,
    allocationRule,
  };

  const totalMonthlyIncome = calculateTotalMonthlyIncome(draftProfile);
  const caps = calculateAllocationCaps(totalMonthlyIncome, allocationRule);

  // Handlers for additional income
  const handleAddIncomeStream = () => {
    const newInc: IncomeSource = {
      id: `inc-${Date.now()}`,
      name: 'Side Income',
      amount: 300,
      frequency: 'monthly',
      nextPayDate: nextPayday,
    };
    setAdditionalIncomes([...additionalIncomes, newInc]);
  };

  const handleRemoveIncomeStream = (id: string) => {
    setAdditionalIncomes(additionalIncomes.filter(i => i.id !== id));
  };

  const handleUpdateIncomeStream = (id: string, updates: Partial<IncomeSource>) => {
    setAdditionalIncomes(
      additionalIncomes.map(i => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  // Custom allocation slider update
  const handleCustomSliderChange = (type: 'needs' | 'wants' | 'savings', val: number) => {
    let newNeeds = allocationRule.needsPercent;
    let newWants = allocationRule.wantsPercent;
    let newSavings = allocationRule.savingsPercent;

    if (type === 'needs') {
      newNeeds = val;
      const remaining = 100 - newNeeds;
      // adjust wants and savings proportionally
      const currentOtherSum = newWants + newSavings || 1;
      newWants = Math.round((newWants / currentOtherSum) * remaining);
      newSavings = 100 - newNeeds - newWants;
    } else if (type === 'wants') {
      newWants = val;
      newSavings = Math.max(0, 100 - newNeeds - newWants);
    } else if (type === 'savings') {
      newSavings = val;
      newWants = Math.max(0, 100 - newNeeds - newSavings);
    }

    setAllocationRule({
      ruleName: 'Custom',
      needsPercent: Math.max(0, newNeeds),
      wantsPercent: Math.max(0, newWants),
      savingsPercent: Math.max(0, newSavings),
    });
  };

  const handleApplyPreset = (preset: typeof ALLOCATION_PRESETS[0]) => {
    setAllocationRule({
      ruleName: preset.name,
      needsPercent: preset.needs,
      wantsPercent: preset.wants,
      savingsPercent: preset.savings,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draftProfile, autoReallocateGoals);
    onClose();
  };

  // Days until next payday calculation
  const getDaysUntilPayday = () => {
    if (!nextPayday) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const payDate = new Date(nextPayday);
    payDate.setHours(0, 0, 0, 0);
    const diffTime = payDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilPayday = getDaysUntilPayday();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Salary & Budget Allocation Engine</h2>
              <p className="text-xs text-slate-300">
                Define your income schedule and automated 50/30/20 distribution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('salary')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'salary'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>1. Income & Pay Schedule</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('allocation')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'allocation'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>2. Automated Split (50/30/20)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* TAB 1: SALARY & INCOME */}
          {activeTab === 'salary' && (
            <div className="space-y-5">
              
              {/* Primary Net Salary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Primary Monthly Net Take-Home Salary ({salaryProfile.currencySymbol})
                </label>
                <p className="text-xs text-slate-500 mb-2.5">
                  The actual amount deposited into your bank account after taxes and deductions.
                </p>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-semibold text-sm">
                    {salaryProfile.currencySymbol}
                  </span>
                  <input
                    id="input-base-salary"
                    type="number"
                    min="0"
                    step="10"
                    required
                    value={baseMonthlyNet || ''}
                    onChange={(e) => setBaseMonthlyNet(parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="4500"
                  />
                </div>
              </div>

              {/* Pay Frequency & Next Payday */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pay Frequency
                  </label>
                  <select
                    id="select-pay-frequency"
                    value={payFrequency}
                    onChange={(e) => setPayFrequency(e.target.value as PayFrequency)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="monthly">Monthly (1x / month)</option>
                    <option value="semi-monthly">Semi-Monthly (2x / month)</option>
                    <option value="bi-weekly">Bi-Weekly (Every 2 weeks)</option>
                    <option value="weekly">Weekly (Every week)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Next Payday Date</span>
                    {daysUntilPayday !== null && (
                      <span className="text-[11px] font-bold text-emerald-600">
                        {daysUntilPayday === 0 ? 'Today! 🎉' : daysUntilPayday > 0 ? `In ${daysUntilPayday} days` : 'Past due'}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      id="input-next-payday"
                      type="date"
                      value={nextPayday}
                      onChange={(e) => setNextPayday(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Income Streams */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Additional Income Streams</h3>
                    <p className="text-[11px] text-slate-500">Freelance, bonuses, investments, side gigs</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddIncomeStream}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stream</span>
                  </button>
                </div>

                {additionalIncomes.length === 0 ? (
                  <div className="p-3 text-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                    No extra income sources added yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {additionalIncomes.map((inc) => (
                      <div
                        key={inc.id}
                        className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                      >
                        <input
                          type="text"
                          value={inc.name}
                          onChange={(e) => handleUpdateIncomeStream(inc.id, { name: e.target.value })}
                          className="flex-1 px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-md"
                          placeholder="e.g. Freelance Consulting"
                        />
                        <div className="relative w-28">
                          <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-400 text-xs font-bold">
                            {salaryProfile.currencySymbol}
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={inc.amount || ''}
                            onChange={(e) => handleUpdateIncomeStream(inc.id, { amount: parseFloat(e.target.value) || 0 })}
                            className="w-full pl-6 pr-2 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-md"
                            placeholder="300"
                          />
                        </div>
                        <select
                          value={inc.frequency}
                          onChange={(e) => handleUpdateIncomeStream(inc.id, { frequency: e.target.value as PayFrequency })}
                          className="px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700"
                        >
                          <option value="monthly">/mo</option>
                          <option value="bi-weekly">/2w</option>
                          <option value="weekly">/wk</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveIncomeStream(inc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total Summary Callout */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-800 font-medium">Total Monthly Take-Home Power:</span>
                  <div className="text-lg font-extrabold text-emerald-900">
                    {formatCurrency(totalMonthlyIncome, salaryProfile.currencySymbol)} / month
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('allocation')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <span>Configure Split</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: ALLOCATION SPLIT ENGINE */}
          {activeTab === 'allocation' && (
            <div className="space-y-5">
              
              {/* Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select Budgeting Formula Preset:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {ALLOCATION_PRESETS.map((preset) => {
                    const isSelected = allocationRule.ruleName === preset.name;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">{preset.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <div className="flex gap-1 text-[11px] font-semibold text-slate-600 mb-1">
                          <span className="text-blue-600">{preset.needs}% Needs</span> •
                          <span className="text-amber-600">{preset.wants}% Wants</span> •
                          <span className="text-emerald-600">{preset.savings}% Save</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          {preset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders for Customization */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Fine-Tune Monthly Split:</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    Total: {allocationRule.needsPercent + allocationRule.wantsPercent + allocationRule.savingsPercent}%
                  </span>
                </div>

                {/* Needs Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-blue-700">Essential Needs ({allocationRule.needsPercent}%)</span>
                    <span className="text-slate-900 font-bold">
                      {formatCurrency(caps.needsCap, salaryProfile.currencySymbol)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={allocationRule.needsPercent}
                    onChange={(e) => handleCustomSliderChange('needs', parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-500">Rent, bills, groceries, transit, health, debts</span>
                </div>

                {/* Wants Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-amber-700">Lifestyle Wants ({allocationRule.wantsPercent}%)</span>
                    <span className="text-slate-900 font-bold">
                      {formatCurrency(caps.wantsCap, salaryProfile.currencySymbol)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={allocationRule.wantsPercent}
                    onChange={(e) => handleCustomSliderChange('wants', parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-500">Dining, shopping, entertainment, travel & fun</span>
                </div>

                {/* Savings Slider */}
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-700">Automated Savings & Goals ({allocationRule.savingsPercent}%)</span>
                    <span className="text-slate-900 font-bold">
                      {formatCurrency(caps.savingsCap, salaryProfile.currencySymbol)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={allocationRule.savingsPercent}
                    onChange={(e) => handleCustomSliderChange('savings', parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-500">Emergency fund, investments, trips, purchase goals</span>
                </div>

              </div>

              {/* Automated Goal Allocation Checkbox */}
              <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl flex items-start gap-3">
                <input
                  id="chk-auto-reallocate"
                  type="checkbox"
                  checked={autoReallocateGoals}
                  onChange={(e) => setAutoReallocateGoals(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                />
                <div>
                  <label htmlFor="chk-auto-reallocate" className="text-xs font-bold text-teal-950 cursor-pointer flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Auto-distribute the {formatCurrency(caps.savingsCap, salaryProfile.currencySymbol)} savings pool across my goals</span>
                  </label>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    Calculates priority weights automatically and updates the monthly contribution targets on each of your active savings goals.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save Budget</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
