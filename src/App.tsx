import React, { useState, useEffect } from 'react';
import { 
  loadAppState, 
  saveSalaryProfile, 
  saveExpenses, 
  saveSavingsGoals, 
  resetToDefaults, 
  exportBackupJSON 
} from './utils/storage';
import { 
  calculateTotalMonthlyIncome, 
  calculateAllocationCaps, 
  calculateExpensesSummary, 
  calculateBudgetHealth, 
  calculateDaysRemainingInMonth,
  autoDistributeSavingsToGoals,
  formatCurrency
} from './utils/calculations';
import { SalaryProfile, ExpenseItem, SavingsGoal, ExpenseType } from './types';
import { Header } from './components/Header';
import { BudgetOverviewCards } from './components/BudgetOverviewCards';
import { BudgetRuleProgress } from './components/BudgetRuleProgress';
import { SavingsGoalsTracker } from './components/SavingsGoalsTracker';
import { ExpenseTracker } from './components/ExpenseTracker';
import { CashflowForecast } from './components/CashflowForecast';
import { BudgetInsights } from './components/BudgetInsights';
import { SalaryConfigModal } from './components/SalaryConfigModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { AddGoalModal } from './components/AddGoalModal';

export default function App() {
  // Load initial persisted state
  const [appState, setAppState] = useState(() => loadAppState());
  const { salaryProfile, expenses, savingsGoals } = appState;

  // Selected Month (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
  });

  // Modals state
  const [isSalaryConfigOpen, setIsSalaryConfigOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [expenseDefaultType, setExpenseDefaultType] = useState<'need' | 'want'>('need');
  const [expenseIsRecurringDefault, setExpenseIsRecurringDefault] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveSalaryProfile(salaryProfile);
  }, [salaryProfile]);

  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    saveSavingsGoals(savingsGoals);
  }, [savingsGoals]);

  // Derived Budget calculations
  const totalIncome = calculateTotalMonthlyIncome(salaryProfile);
  const caps = calculateAllocationCaps(totalIncome, salaryProfile.allocationRule);
  const summary = calculateExpensesSummary(expenses, selectedMonth);
  const { daysRemaining } = calculateDaysRemainingInMonth();
  const health = calculateBudgetHealth(totalIncome, caps, summary, savingsGoals, daysRemaining);

  // Handlers
  const handleSaveSalaryProfile = (updatedProfile: SalaryProfile, shouldAutoReallocateGoals: boolean) => {
    let updatedGoals = savingsGoals;
    if (shouldAutoReallocateGoals) {
      const newIncome = calculateTotalMonthlyIncome(updatedProfile);
      const newCaps = calculateAllocationCaps(newIncome, updatedProfile.allocationRule);
      updatedGoals = autoDistributeSavingsToGoals(newCaps.savingsCap, savingsGoals);
    }

    setAppState({
      ...appState,
      salaryProfile: updatedProfile,
      savingsGoals: updatedGoals,
    });
  };

  const handleCurrencyChange = (code: string, symbol: string) => {
    const updatedProfile: SalaryProfile = {
      ...salaryProfile,
      currency: code,
      currencySymbol: symbol,
    };
    setAppState({
      ...appState,
      salaryProfile: updatedProfile,
    });
  };

  const handleAddExpense = (expenseData: Omit<ExpenseItem, 'id'>) => {
    const newExpense: ExpenseItem = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setAppState({
      ...appState,
      expenses: [newExpense, ...expenses],
    });
  };

  const handleDeleteExpense = (id: string) => {
    setAppState({
      ...appState,
      expenses: expenses.filter(e => e.id !== id),
    });
  };

  const handleToggleRecurringPaid = (id: string) => {
    setAppState({
      ...appState,
      expenses: expenses.map(e => (e.id === id ? { ...e, isPaidThisMonth: !e.isPaidThisMonth } : e)),
    });
  };

  const handleSaveGoal = (goal: SavingsGoal) => {
    const exists = savingsGoals.some(g => g.id === goal.id);
    let newGoals: SavingsGoal[];
    if (exists) {
      newGoals = savingsGoals.map(g => (g.id === goal.id ? goal : g));
    } else {
      newGoals = [...savingsGoals, goal];
    }

    // Auto-distribute if automated
    const distributedGoals = autoDistributeSavingsToGoals(caps.savingsCap, newGoals);

    setAppState({
      ...appState,
      savingsGoals: distributedGoals,
    });
    setEditingGoal(null);
  };

  const handleDeleteGoal = (id: string) => {
    const remaining = savingsGoals.filter(g => g.id !== id);
    const redistributed = autoDistributeSavingsToGoals(caps.savingsCap, remaining);
    setAppState({
      ...appState,
      savingsGoals: redistributed,
    });
  };

  const handleDepositToGoal = (goalId: string, amount: number) => {
    const updated = savingsGoals.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: g.currentAmount + amount,
        };
      }
      return g;
    });
    setAppState({
      ...appState,
      savingsGoals: updated,
    });
  };

  const handleAutoDistributeSavings = () => {
    const redistributed = autoDistributeSavingsToGoals(caps.savingsCap, savingsGoals);
    setAppState({
      ...appState,
      savingsGoals: redistributed,
    });
  };

  const handleResetData = () => {
    const freshState = resetToDefaults();
    setAppState(freshState);
  };

  const handleExportData = () => {
    exportBackupJSON(appState);
  };

  const openAddExpenseModal = (defaultType: 'need' | 'want' = 'need', isRecurring: boolean = false) => {
    setExpenseDefaultType(defaultType);
    setExpenseIsRecurringDefault(isRecurring);
    setIsAddExpenseOpen(true);
  };

  const openEditGoalModal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setIsAddGoalOpen(true);
  };

  const openNewGoalModal = () => {
    setEditingGoal(null);
    setIsAddGoalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Top Application Header */}
      <Header
        salaryProfile={salaryProfile}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onOpenSalaryConfig={() => setIsSalaryConfigOpen(true)}
        onOpenAddExpense={() => openAddExpenseModal('need')}
        onOpenAddGoal={openNewGoalModal}
        onCurrencyChange={handleCurrencyChange}
        onResetData={handleResetData}
        onExportData={handleExportData}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* High-Level Budget Overview Metrics */}
        <section aria-label="Budget Overview">
          <BudgetOverviewCards
            salaryProfile={salaryProfile}
            totalIncome={totalIncome}
            caps={caps}
            summary={summary}
            health={health}
            daysRemaining={daysRemaining}
            onOpenSalaryConfig={() => setIsSalaryConfigOpen(true)}
          />
        </section>

        {/* 50/30/20 Automated Salary Allocation Progress */}
        <section aria-label="50/30/20 Allocation Progress">
          <BudgetRuleProgress
            salaryProfile={salaryProfile}
            totalIncome={totalIncome}
            caps={caps}
            summary={summary}
            goals={savingsGoals}
            onOpenSalaryConfig={() => setIsSalaryConfigOpen(true)}
            onOpenAddExpense={(type) => openAddExpenseModal(type || 'need')}
          />
        </section>

        {/* Automated Savings Goals & Milestone Tracker */}
        <section aria-label="Savings Goals">
          <SavingsGoalsTracker
            goals={savingsGoals}
            salaryProfile={salaryProfile}
            savingsBudget={caps.savingsCap}
            onAddGoal={openNewGoalModal}
            onEditGoal={openEditGoalModal}
            onDeleteGoal={handleDeleteGoal}
            onDeposit={handleDepositToGoal}
            onAutoDistribute={handleAutoDistributeSavings}
          />
        </section>

        {/* Monthly Expenses & Recurring Subscriptions */}
        <section aria-label="Monthly Expenses">
          <ExpenseTracker
            expenses={expenses}
            salaryProfile={salaryProfile}
            selectedMonth={selectedMonth}
            summary={summary}
            onAddExpense={openAddExpenseModal}
            onDeleteExpense={handleDeleteExpense}
            onToggleRecurringPaid={handleToggleRecurringPaid}
          />
        </section>

        {/* Cashflow Trajectory & Smart Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section aria-label="Cashflow Forecast">
            <CashflowForecast
              salaryProfile={salaryProfile}
              totalIncome={totalIncome}
              summary={summary}
              expenses={expenses}
              selectedMonth={selectedMonth}
              daysRemaining={daysRemaining}
              projectedMonthEndBalance={health.projectedMonthEndBalance}
            />
          </section>

          <section aria-label="Smart Insights">
            <BudgetInsights
              salaryProfile={salaryProfile}
              totalIncome={totalIncome}
              caps={caps}
              summary={summary}
              health={health}
              goals={savingsGoals}
              daysRemaining={daysRemaining}
              onOpenSalaryConfig={() => setIsSalaryConfigOpen(true)}
              onOpenAddGoal={openNewGoalModal}
            />
          </section>
        </div>

      </main>

      {/* Salary & Allocation Configuration Modal */}
      <SalaryConfigModal
        isOpen={isSalaryConfigOpen}
        onClose={() => setIsSalaryConfigOpen(false)}
        salaryProfile={salaryProfile}
        onSave={handleSaveSalaryProfile}
      />

      {/* Log Expense / Bill Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        salaryProfile={salaryProfile}
        defaultType={expenseDefaultType}
        isRecurringDefault={expenseIsRecurringDefault}
        onSaveExpense={handleAddExpense}
      />

      {/* Add / Edit Savings Goal Modal */}
      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => {
          setIsAddGoalOpen(false);
          setEditingGoal(null);
        }}
        salaryProfile={salaryProfile}
        initialGoal={editingGoal}
        onSaveGoal={handleSaveGoal}
      />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-slate-400 border-t border-slate-200 mt-12">
        <p className="font-medium text-slate-500">
          BudgetBuddy • Automated Salary Budgeting & Goal Allocation
        </p>
        <p className="mt-1 text-[11px]">
          All budget calculations, recurring schedules, and savings goals are computed and stored locally in real time.
        </p>
      </footer>

    </div>
  );
}
