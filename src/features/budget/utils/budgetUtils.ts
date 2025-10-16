import { Budget, BudgetAlert } from '../store';
import { Expense } from '@features/expenses/types';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';

export type BudgetStatus = {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  exceeded: boolean;
  status: 'safe' | 'warning' | 'danger' | 'exceeded';
};

export const getBudgetPeriodDates = (period: Budget['period'], date: Date = new Date()) => {
  switch (period) {
    case 'daily':
      return { start: startOfDay(date), end: endOfDay(date) };
    case 'weekly':
      return { start: startOfWeek(date), end: endOfWeek(date) };
    case 'monthly':
      return { start: startOfMonth(date), end: endOfMonth(date) };
    case 'yearly':
      return { start: startOfYear(date), end: endOfYear(date) };
    default:
      return { start: startOfMonth(date), end: endOfMonth(date) };
  }
};

export const getExpensesForPeriod = (expenses: Expense[], period: Budget['period'], date: Date = new Date()) => {
  const { start, end } = getBudgetPeriodDates(period, date);
  
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return isWithinInterval(expenseDate, { start, end });
  });
};

export const calculateBudgetStatus = (
  budget: Budget,
  expenses: Expense[],
  date: Date = new Date()
): BudgetStatus => {
  const periodExpenses = getExpensesForPeriod(expenses, budget.period, date);
  const categoryExpenses = periodExpenses.filter(expense => expense.category === budget.category);
  
  const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budget.amount - spent;
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const exceeded = spent > budget.amount;
  
  let status: BudgetStatus['status'] = 'safe';
  if (exceeded) {
    status = 'exceeded';
  } else if (percentage >= 90) {
    status = 'danger';
  } else if (percentage >= 75) {
    status = 'warning';
  }
  
  return {
    budget,
    spent,
    remaining,
    percentage,
    exceeded,
    status,
  };
};

export const getAllBudgetStatuses = (
  budgets: Budget[],
  expenses: Expense[],
  date: Date = new Date()
): BudgetStatus[] => {
  return budgets.map(budget => calculateBudgetStatus(budget, expenses, date));
};

export const checkBudgetViolations = (
  budgets: Budget[],
  expenses: Expense[],
  newExpense: Expense
): BudgetAlert[] => {
  const alerts: BudgetAlert[] = [];
  
  budgets.forEach(budget => {
    if (budget.category === newExpense.category) {
      const status = calculateBudgetStatus(budget, expenses);
      const newSpent = status.spent + newExpense.amount;
      const newPercentage = (newSpent / budget.amount) * 100;
      const willExceed = newSpent > budget.amount;
      
      // Create alert if budget will be exceeded or is already exceeded
      if (willExceed || newPercentage >= 100) {
        alerts.push({
          id: Date.now().toString(),
          budgetId: budget.id,
          category: budget.category,
          spent: newSpent,
          budget: budget.amount,
          percentage: newPercentage,
          exceeded: willExceed,
          createdAt: new Date().toISOString(),
        });
      }
    }
  });
  
  return alerts;
};

export const getBudgetStatusColor = (status: BudgetStatus['status']) => {
  switch (status) {
    case 'safe':
      return '#10B981'; // Green
    case 'warning':
      return '#F59E0B'; // Amber
    case 'danger':
      return '#EF4444'; // Red
    case 'exceeded':
      return '#DC2626'; // Dark Red
    default:
      return '#6B7280'; // Gray
  }
};

export const getBudgetStatusText = (status: BudgetStatus['status']) => {
  switch (status) {
    case 'safe':
      return 'On Track';
    case 'warning':
      return 'Warning';
    case 'danger':
      return 'Danger';
    case 'exceeded':
      return 'Exceeded';
    default:
      return 'Unknown';
  }
};

export const formatBudgetPeriod = (period: Budget['period']) => {
  switch (period) {
    case 'daily':
      return 'Daily';
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
    case 'yearly':
      return 'Yearly';
    default:
      return 'Monthly';
  }
};

export const getBudgetProgressColor = (percentage: number) => {
  if (percentage >= 100) return '#DC2626'; // Dark Red
  if (percentage >= 90) return '#EF4444'; // Red
  if (percentage >= 75) return '#F59E0B'; // Amber
  return '#10B981'; // Green
};
