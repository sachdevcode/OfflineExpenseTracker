import { format, startOfMonth, endOfMonth, eachMonthOfInterval, parseISO } from 'date-fns';
import type { Expense } from '@features/expenses/types';

export interface CategoryData {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  amount: number;
  count: number;
}

export interface ChartTheme {
  primary: string;
  background: string;
  text: string;
  border: string;
  borderMuted: string;
  card: string;
  surface: string;
}

// Color palette that works well in both light and dark modes
export const CHART_COLORS = [
  '#4F46E5', // Indigo
  '#EF4444', // Red
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6B7280', // Gray
];

export const getChartColor = (index: number): string => {
  return CHART_COLORS[index % CHART_COLORS.length];
};

export const getCategoryData = (expenses: Expense[]): CategoryData[] => {
  const categoryMap = new Map<string, { amount: number; count: number }>();
  
  expenses.forEach(expense => {
    // Validate expense data
    const amount = Number(expense.amount);
    if (isNaN(amount) || amount < 0) return; // Skip invalid expenses
    
    const existing = categoryMap.get(expense.category) || { amount: 0, count: 0 };
    categoryMap.set(expense.category, {
      amount: existing.amount + amount,
      count: existing.count + 1,
    });
  });

  const totalAmount = expenses.reduce((sum, expense) => {
    const amount = Number(expense.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      amount: Math.max(0, data.amount), // Ensure non-negative
      count: data.count,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const getMonthlyData = (expenses: Expense[]): MonthlyData[] => {
  if (expenses.length === 0) return [];

  const monthlyMap = new Map<string, { amount: number; count: number }>();
  
  expenses.forEach(expense => {
    // Validate expense data
    const amount = Number(expense.amount);
    if (isNaN(amount) || amount < 0) return; // Skip invalid expenses
    
    const date = parseISO(expense.date);
    if (isNaN(date.getTime())) return; // Skip invalid dates
    
    const monthKey = format(date, 'yyyy-MM');
    const existing = monthlyMap.get(monthKey) || { amount: 0, count: 0 };
    monthlyMap.set(monthKey, {
      amount: existing.amount + amount,
      count: existing.count + 1,
    });
  });

  // Get valid dates only
  const validDates = expenses
    .map(expense => parseISO(expense.date))
    .filter(date => !isNaN(date.getTime()));
    
  if (validDates.length === 0) return [];
  
  const minDate = new Date(Math.min(...validDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...validDates.map(d => d.getTime())));
  
  // Generate all months in range
  const months = eachMonthOfInterval({ start: minDate, end: maxDate });
  
  return months.map(month => {
    const monthKey = format(month, 'yyyy-MM');
    const data = monthlyMap.get(monthKey) || { amount: 0, count: 0 };
    return {
      month: format(month, 'MMM yyyy'),
      amount: Math.max(0, data.amount), // Ensure non-negative
      count: data.count,
    };
  });
};

export const getTopCategories = (expenses: Expense[], limit: number = 5): CategoryData[] => {
  return getCategoryData(expenses).slice(0, limit);
};

// Chart dimension helpers
export const getChartDimensions = (containerWidth: number) => {
  const padding = 40;
  const chartWidth = containerWidth - (padding * 2);
  const chartHeight = 200;
  
  return {
    width: chartWidth,
    height: chartHeight,
    padding,
    centerX: chartWidth / 2 + padding,
    centerY: chartHeight / 2 + padding,
  };
};

// Pie chart helpers
export const calculatePieSlices = (data: CategoryData[], radius: number) => {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  
  // Handle edge case where total is 0 or invalid
  if (total <= 0 || isNaN(total)) {
    return [];
  }
  
  let currentAngle = 0;
  
  return data.map((item, index) => {
    const percentage = item.amount / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle += angle;
    
    // Validate all calculated values
    const validatedPercentage = Math.max(0, Math.min(100, percentage * 100));
    const validatedAngle = Math.max(0, Math.min(360, angle));
    const validatedStartAngle = Math.max(0, Math.min(360, startAngle));
    const validatedEndAngle = Math.max(0, Math.min(360, endAngle));
    
    return {
      ...item,
      startAngle: validatedStartAngle,
      endAngle: validatedEndAngle,
      angle: validatedAngle,
      percentage: validatedPercentage,
      color: getChartColor(index),
    };
  });
};

// Bar chart helpers
export const calculateBarDimensions = (
  data: CategoryData[],
  containerWidth: number,
  containerHeight: number
) => {
  const padding = 40;
  const chartWidth = containerWidth - (padding * 2);
  const chartHeight = containerHeight - (padding * 2);
  const barSpacing = 8;
  const barWidth = (chartWidth - (data.length - 1) * barSpacing) / data.length;
  const maxValue = Math.max(...data.map(item => item.amount));
  
  return {
    chartWidth,
    chartHeight,
    padding,
    barWidth,
    barSpacing,
    maxValue,
  };
};

// Line chart helpers
export const calculateLinePoints = (
  data: MonthlyData[],
  containerWidth: number,
  containerHeight: number
) => {
  const padding = 40;
  const chartWidth = containerWidth - (padding * 2);
  const chartHeight = containerHeight - (padding * 2);
  const maxValue = Math.max(...data.map(item => item.amount));
  const minValue = Math.min(...data.map(item => item.amount));
  const valueRange = maxValue - minValue || 1;
  
  return data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((item.amount - minValue) / valueRange) * chartHeight;
    return { x, y, ...item };
  });
};
