import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@app/providers/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { useBudgetsQuery, useBudgetAlertsQuery, useSyncBudgetToRQ } from '../hooks';
import { getAllBudgetStatuses } from '../utils/budgetUtils';
import { useExpenseStore } from '@features/expenses/store';

export const BudgetOverview: React.FC = () => {
  const { theme } = useTheme();
  const nav = useNavigation();
  useSyncBudgetToRQ();

  const { data: budgets = [] } = useBudgetsQuery();
  const { data: alerts = [] } = useBudgetAlertsQuery();
  const expenses = useExpenseStore(s => s.expenses);

  if (budgets.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Budget Tracking
          </Text>
          <Pressable
            onPress={() => (nav as any).navigate('BudgetSettings')}
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.addButtonText}>+ Add Budget</Text>
          </Pressable>
        </View>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          Set up budgets to track your spending limits
        </Text>
      </View>
    );
  }

  const budgetStatuses = getAllBudgetStatuses(budgets, expenses);
  const exceededBudgets = budgetStatuses.filter(status => status.exceeded);
  const warningBudgets = budgetStatuses.filter(status => status.status === 'warning' || status.status === 'danger');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Budget Overview
        </Text>
        <Pressable
          onPress={() => (nav as any).navigate('BudgetSettings')}
          style={[styles.settingsButton, { borderColor: theme.colors.border }]}
        >
          <Text style={[styles.settingsButtonText, { color: theme.colors.text }]}>
            Settings
          </Text>
        </Pressable>
      </View>

      {exceededBudgets.length > 0 && (
        <View style={[styles.alertContainer, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
          <Text style={[styles.alertTitle, { color: '#DC2626' }]}>
            🚨 {exceededBudgets.length} Budget{exceededBudgets.length > 1 ? 's' : ''} Exceeded
          </Text>
          {exceededBudgets.slice(0, 2).map((status) => (
            <Text key={status.budget.id} style={[styles.alertText, { color: '#DC2626' }]}>
              • {status.budget.category}: ${status.spent.toFixed(2)} / ${status.budget.amount.toFixed(2)}
            </Text>
          ))}
        </View>
      )}

      {warningBudgets.length > 0 && exceededBudgets.length === 0 && (
        <View style={[styles.alertContainer, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
          <Text style={[styles.alertTitle, { color: '#D97706' }]}>
            ⚠️ {warningBudgets.length} Budget{warningBudgets.length > 1 ? 's' : ''} at Risk
          </Text>
          {warningBudgets.slice(0, 2).map((status) => (
            <Text key={status.budget.id} style={[styles.alertText, { color: '#D97706' }]}>
              • {status.budget.category}: {status.percentage.toFixed(1)}% used
            </Text>
          ))}
        </View>
      )}

      <View style={styles.budgetList}>
        {budgetStatuses.slice(0, 3).map((status) => (
          <View key={status.budget.id} style={styles.budgetItem}>
            <View style={styles.budgetInfo}>
              <Text style={[styles.budgetCategory, { color: theme.colors.text }]}>
                {status.budget.category}
              </Text>
              <Text style={[styles.budgetAmount, { color: theme.colors.text }]}>
                ${status.spent.toFixed(2)} / ${status.budget.amount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(status.percentage, 100)}%`,
                    backgroundColor: status.exceeded ? '#DC2626' : 
                                   status.percentage >= 90 ? '#EF4444' : 
                                   status.percentage >= 75 ? '#F59E0B' : '#10B981',
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {budgetStatuses.length > 3 && (
        <Pressable
          onPress={() => (nav as any).navigate('BudgetSettings')}
          style={styles.viewAllButton}
        >
          <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
            View All Budgets ({budgetStatuses.length})
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3B40',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  settingsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  settingsButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    paddingVertical: 20,
  },
  alertContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 12,
    lineHeight: 16,
  },
  budgetList: {
    gap: 8,
  },
  budgetItem: {
    gap: 4,
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetCategory: {
    fontSize: 14,
    fontWeight: '600',
  },
  budgetAmount: {
    fontSize: 12,
    opacity: 0.7,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  viewAllButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
