import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useTheme } from '@app/providers/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import {
  useBudgetsQuery,
  useDeleteBudgetMutation,
  useSyncBudgetToRQ,
} from '../hooks';
import { Budget } from '../store';
import { formatBudgetPeriod, getBudgetStatusColor } from '../utils/budgetUtils';

export const BudgetSettingsScreen = () => {
  const { theme } = useTheme();
  const nav = useNavigation();
  useSyncBudgetToRQ();

  const { data: budgets = [], isLoading } = useBudgetsQuery();
  const deleteBudget = useDeleteBudgetMutation();

  const handleDeleteBudget = (budget: Budget) => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete the budget for ${budget.category}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteBudget.mutate(budget.id),
        },
      ]
    );
  };

  const handleAddBudget = () => {
    (nav as any).navigate('AddEditBudget', {});
  };

  const handleEditBudget = (budget: Budget) => {
    (nav as any).navigate('AddEditBudget', { budget });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Budget Settings
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Set spending limits for different categories
        </Text>
      </View>

      {budgets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No Budgets Set
          </Text>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Create your first budget to start tracking your spending limits
          </Text>
        </View>
      ) : (
        <View style={styles.budgetsList}>
          {budgets.map((budget) => (
            <View
              key={budget.id}
              style={[styles.budgetCard, { backgroundColor: theme.colors.card }]}
            >
              <View style={styles.budgetHeader}>
                <View style={styles.budgetInfo}>
                  <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                    {budget.category}
                  </Text>
                  <Text style={[styles.budgetAmount, { color: theme.colors.primary }]}>
                    ${budget.amount.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.budgetActions}>
                  <Pressable
                    onPress={() => handleEditBudget(budget)}
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                  >
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleDeleteBudget(budget)}
                    style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
              
              <View style={styles.budgetDetails}>
                <View style={styles.budgetDetail}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                    Period
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                    {formatBudgetPeriod(budget.period)}
                  </Text>
                </View>
                <View style={styles.budgetDetail}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                    Created
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                    {new Date(budget.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <Pressable
        onPress={handleAddBudget}
        style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={styles.addButtonText}>+ Add Budget</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 24,
  },
  budgetsList: {
    marginBottom: 24,
  },
  budgetCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3A3B40',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  budgetActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetDetail: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
