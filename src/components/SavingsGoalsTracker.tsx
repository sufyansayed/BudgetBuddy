import React, { useState } from 'react';
import { 
  PiggyBank, 
  Plus, 
  Sparkles, 
  Target, 
  Calendar, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreVertical,
  Trash2,
  Edit2,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavingsGoal, SalaryProfile } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { formatCurrency, estimateGoalCompletion } from '../utils/calculations';

interface SavingsGoalsTrackerProps {
  goals: SavingsGoal[];
  salaryProfile: SalaryProfile;
  savingsBudget: number; // total monthly savings cap from salary split
  onAddGoal: () => void;
  onEditGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (goalId: string) => void;
  onDeposit: (goalId: string, amount: number) => void;
  onAutoDistribute: () => void;
}

export const SavingsGoalsTracker: React.FC<SavingsGoalsTrackerProps> = ({
  goals,
  salaryProfile,
  savingsBudget,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onDeposit,
  onAutoDistribute,
}) => {
  const currencySymbol = salaryProfile.currencySymbol;
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('100');

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalMonthlyCommitted = goals.reduce((sum, g) => sum + g.monthlyAllocation, 0);
  const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  const handleDepositSubmit = (goal: SavingsGoal) => {
    const amt = parseFloat(depositAmount);
    if (!isNaN(amt) && amt > 0) {
      const willComplete = goal.currentAmount + amt >= goal.targetAmount;
      onDeposit(goal.id, amt);
      setDepositGoalId(null);
      setDepositAmount('100');

      // Trigger celebratory confetti
      if (willComplete) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              Automated Savings Goals
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
              {goals.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Your monthly savings pool of <span className="font-bold text-slate-800">{formatCurrency(savingsBudget, currencySymbol)}</span> is automatically apportioned to your goals
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            id="btn-auto-distribute-savings"
            onClick={onAutoDistribute}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all"
            title="Auto-calculate goal contributions based on priorities"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Re-balance Split</span>
          </button>

          <button
            id="btn-add-goal"
            onClick={onAddGoal}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* Aggregate Savings Progress Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-700">Cumulative Savings Vault</span>
          <span className="text-xs font-extrabold text-slate-900">
            {formatCurrency(totalSaved, currencySymbol)} of {formatCurrency(totalTarget, currencySymbol)} ({overallProgress}%)
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <span>Monthly savings velocity: <strong className="text-emerald-700 font-semibold">+{formatCurrency(totalMonthlyCommitted, currencySymbol)}/mo</strong></span>
          <span>Remaining to reach all targets: <strong className="text-slate-700">{formatCurrency(Math.max(0, totalTarget - totalSaved), currencySymbol)}</strong></span>
        </div>
      </div>

      {/* Goals Cards Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <PiggyBank className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No savings goals created yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Create goals like an Emergency Fund, Travel Vacation, or Big Purchase to automatically allocate your monthly savings.
          </p>
          <button
            onClick={onAddGoal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const projection = estimateGoalCompletion(goal);

            return (
              <div
                key={goal.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between relative group"
              >
                <div>
                  
                  {/* Top Bar: Icon, Title, Priority */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: goal.color || '#10b981' }}
                      >
                        <CategoryIcon iconName={goal.iconName} category={goal.category} className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                          {goal.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                          <span className={`font-semibold capitalize px-1.5 py-0.2 rounded ${
                            goal.priority === 'high' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : goal.priority === 'medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {goal.priority} priority
                          </span>
                          {goal.isAutomated && (
                            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5" /> Auto
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditGoal(goal)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit Goal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Amounts & Percent */}
                  <div className="flex items-baseline justify-between mb-1.5">
                    <div>
                      <span className="text-lg font-extrabold text-slate-900">
                        {formatCurrency(goal.currentAmount, currencySymbol)}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 ml-1">
                        / {formatCurrency(goal.targetAmount, currencySymbol)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: goal.color || '#10b981',
                      }}
                    />
                  </div>

                  {/* Monthly Auto-Allocation Tag */}
                  <div className="bg-slate-50 p-2 rounded-lg text-xs space-y-1 mb-3">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Monthly Auto-Contribution:</span>
                      <strong className="text-emerald-700 font-bold">
                        +{formatCurrency(goal.monthlyAllocation, currencySymbol)}/mo
                      </strong>
                    </div>

                    {/* Milestone Projection */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Target: {goal.targetDate || 'Ongoing'}
                      </span>
                      <span className={`font-semibold ${
                        isCompleted
                          ? 'text-emerald-600'
                          : projection.onTrack
                          ? 'text-teal-700'
                          : 'text-amber-600'
                      }`}>
                        {isCompleted
                          ? 'Goal Achieved! 🎉'
                          : projection.monthsRemaining <= 12
                          ? `Ready in ~${projection.monthsRemaining} mos`
                          : 'In progress'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Deposit CTA */}
                <div>
                  {depositGoalId === goal.id ? (
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-xs text-slate-400 font-bold">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          min="1"
                          autoFocus
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="w-full pl-5 pr-2 py-1 text-xs font-bold border border-emerald-400 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="Amount"
                        />
                      </div>
                      <button
                        onClick={() => handleDepositSubmit(goal)}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setDepositGoalId(null)}
                        className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {remaining > 0 ? `${formatCurrency(remaining, currencySymbol)} needed` : 'Goal reached'}
                      </span>
                      <button
                        onClick={() => setDepositGoalId(goal.id)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Quick Deposit</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
