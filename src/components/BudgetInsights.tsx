import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  Target,
  ArrowRight
} from 'lucide-react';
import { SalaryProfile, SavingsGoal, BudgetHealthMetrics } from '../types';
import { MonthlyExpensesSummary, formatCurrency } from '../utils/calculations';

interface BudgetInsightsProps {
  salaryProfile: SalaryProfile;
  totalIncome: number;
  caps: { needsCap: number; wantsCap: number; savingsCap: number };
  summary: MonthlyExpensesSummary;
  health: BudgetHealthMetrics;
  goals: SavingsGoal[];
  daysRemaining: number;
  onOpenSalaryConfig: () => void;
  onOpenAddGoal: () => void;
}

export const BudgetInsights: React.FC<BudgetInsightsProps> = ({
  salaryProfile,
  totalIncome,
  caps,
  summary,
  health,
  goals,
  daysRemaining,
  onOpenSalaryConfig,
  onOpenAddGoal,
}) => {
  const currencySymbol = salaryProfile.currencySymbol;

  // Generate dynamic automated insights
  const insights: Array<{
    type: 'success' | 'warning' | 'tip' | 'info';
    title: string;
    description: string;
    icon: React.ReactNode;
  }> = [];

  // 1. Savings velocity insight
  const totalCommittedSavings = goals.reduce((sum, g) => sum + g.monthlyAllocation, 0);
  if (health.savingsRate >= 20) {
    insights.push({
      type: 'success',
      title: `High Savings Rate (${health.savingsRate}%)`,
      description: `You are automatically putting away ${formatCurrency(totalCommittedSavings, currencySymbol)} each month, fulfilling your ${salaryProfile.allocationRule.savingsPercent}% savings milestone!`,
      icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
    });
  } else {
    insights.push({
      type: 'warning',
      title: `Savings Rate is ${health.savingsRate}%`,
      description: `Your target allocation is ${salaryProfile.allocationRule.savingsPercent}%. Consider boosting your automatic goal contributions by ${formatCurrency(Math.max(0, caps.savingsCap - totalCommittedSavings), currencySymbol)}/mo.`,
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
    });
  }

  // 2. Safe-to-spend pacing
  const remainingWants = caps.wantsCap - summary.spentWants;
  if (remainingWants >= 0) {
    insights.push({
      type: 'info',
      title: `Safe Daily Allowance: ${formatCurrency(health.safeToSpendDaily, currencySymbol)} / day`,
      description: `With ${daysRemaining} days left in the month and ${formatCurrency(remainingWants, currencySymbol)} remaining in your Wants budget, you're in great shape!`,
      icon: <Sparkles className="w-4 h-4 text-teal-600" />,
    });
  } else {
    insights.push({
      type: 'warning',
      title: `Wants Budget Exceeded by ${formatCurrency(Math.abs(remainingWants), currencySymbol)}`,
      description: `You've spent more than your ${salaryProfile.allocationRule.wantsPercent}% lifestyle allowance. Try slowing down non-essential purchases for the rest of the month.`,
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
    });
  }

  // 3. Emergency fund coverage
  const emergencyGoal = goals.find(g => g.category === 'emergency');
  if (emergencyGoal) {
    const essentialSpend = summary.spentNeeds || (totalIncome * 0.5);
    const monthsCovered = essentialSpend > 0 ? (emergencyGoal.currentAmount / essentialSpend).toFixed(1) : '0';
    insights.push({
      type: 'tip',
      title: `Emergency Cushion: ${monthsCovered} Months`,
      description: `Your emergency savings of ${formatCurrency(emergencyGoal.currentAmount, currencySymbol)} can cover approximately ${monthsCovered} months of essential needs. Financial experts recommend 3 to 6 months.`,
      icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Automated Budget Coach & Insights
            </h2>
            <p className="text-xs text-slate-500">
              Live recommendations based on your real-time spend velocity
            </p>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((ins, index) => {
          let bgClass = 'bg-slate-50 border-slate-200';
          if (ins.type === 'success') bgClass = 'bg-emerald-50/60 border-emerald-200';
          if (ins.type === 'warning') bgClass = 'bg-amber-50/60 border-amber-200';
          if (ins.type === 'tip') bgClass = 'bg-blue-50/60 border-blue-200';
          if (ins.type === 'info') bgClass = 'bg-teal-50/60 border-teal-200';

          return (
            <div
              key={index}
              className={`p-3.5 rounded-xl border ${bgClass} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {ins.icon}
                  <h3 className="text-xs font-bold text-slate-900">{ins.title}</h3>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {ins.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
