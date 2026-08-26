import { SalaryProfile, ExpenseItem, SavingsGoal } from '../types';
import { INITIAL_SALARY_PROFILE, INITIAL_EXPENSES, INITIAL_SAVINGS_GOALS } from './constants';

const STORAGE_KEYS = {
  SALARY: 'budgetbuddy_salary_profile',
  EXPENSES: 'budgetbuddy_expenses',
  GOALS: 'budgetbuddy_savings_goals',
};

export interface AppState {
  salaryProfile: SalaryProfile;
  expenses: ExpenseItem[];
  savingsGoals: SavingsGoal[];
}

export function loadAppState(): AppState {
  try {
    const rawSalary = localStorage.getItem(STORAGE_KEYS.SALARY);
    const rawExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const rawGoals = localStorage.getItem(STORAGE_KEYS.GOALS);

    const salaryProfile: SalaryProfile = rawSalary ? JSON.parse(rawSalary) : INITIAL_SALARY_PROFILE;
    const expenses: ExpenseItem[] = rawExpenses ? JSON.parse(rawExpenses) : INITIAL_EXPENSES;
    const savingsGoals: SavingsGoal[] = rawGoals ? JSON.parse(rawGoals) : INITIAL_SAVINGS_GOALS;

    return { salaryProfile, expenses, savingsGoals };
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return {
      salaryProfile: INITIAL_SALARY_PROFILE,
      expenses: INITIAL_EXPENSES,
      savingsGoals: INITIAL_SAVINGS_GOALS,
    };
  }
}

export function saveSalaryProfile(salaryProfile: SalaryProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.SALARY, JSON.stringify(salaryProfile));
  } catch (err) {
    console.error('Failed to save salary profile:', err);
  }
}

export function saveExpenses(expenses: ExpenseItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses:', err);
  }
}

export function saveSavingsGoals(goals: SavingsGoal[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (err) {
    console.error('Failed to save savings goals:', err);
  }
}

export function resetToDefaults(): AppState {
  localStorage.removeItem(STORAGE_KEYS.SALARY);
  localStorage.removeItem(STORAGE_KEYS.EXPENSES);
  localStorage.removeItem(STORAGE_KEYS.GOALS);
  return {
    salaryProfile: INITIAL_SALARY_PROFILE,
    expenses: INITIAL_EXPENSES,
    savingsGoals: INITIAL_SAVINGS_GOALS,
  };
}

export function exportBackupJSON(state: AppState) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `BudgetBuddy_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
