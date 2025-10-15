import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@app/providers/ThemeProvider';
import { useExpensesQuery, useSyncZustandToRQ } from '@features/expenses/hooks';

export const AnalyticsScreen = () => {
  const { theme } = useTheme();
  useSyncZustandToRQ();

  const { data: expenses = [], isLoading, refetch } = useExpensesQuery();

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const totalCount = expenses.length;
  const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;

  // Get unique categories
  const categories = [...new Set(expenses.map(expense => expense.category))];

  // Calculate category totals
  const categoryTotals = categories
    .map(category => {
      const categoryExpenses = expenses.filter(
        expense => expense.category === category,
      );
      const total = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );
      return { category, total, count: categoryExpenses.length };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.header, { color: theme.colors.text }]}>
        Analytics
      </Text>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View
          style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
            ${totalAmount.toFixed(2)}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
            Total Spent
          </Text>
        </View>

        <View
          style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
            {totalCount}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
            Transactions
          </Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View
          style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
            ${averageAmount.toFixed(2)}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
            Average
          </Text>
        </View>

        <View
          style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
            {categories.length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
            Categories
          </Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Category Breakdown
        </Text>

        {categoryTotals.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No expenses yet
          </Text>
        ) : (
          categoryTotals.map((item, index) => (
            <View key={item.category} style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View
                  style={[
                    styles.categoryDot,
                    { backgroundColor: getCategoryColor(index) },
                  ]}
                />
                <Text
                  style={[styles.categoryName, { color: theme.colors.text }]}
                >
                  {item.category}
                </Text>
              </View>
              <View style={styles.categoryRight}>
                <Text
                  style={[
                    styles.categoryAmount,
                    { color: theme.colors.primary },
                  ]}
                >
                  ${item.total.toFixed(2)}
                </Text>
                <Text
                  style={[styles.categoryCount, { color: theme.colors.text }]}
                >
                  {item.count} {item.count === 1 ? 'expense' : 'expenses'}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Coming Soon Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Coming Soon
        </Text>
        <Text style={[styles.comingSoonText, { color: theme.colors.text }]}>
          📊 Interactive Charts{'\n'}
          📈 Monthly Trends{'\n'}
          💰 Spending Insights{'\n'}
          🎯 Budget Tracking
        </Text>
      </View>
    </ScrollView>
  );
};

// Simple color palette for categories
const getCategoryColor = (index: number) => {
  const colors = [
    '#4F46E5',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#06B6D4',
  ];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryCount: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
    paddingVertical: 20,
  },
  comingSoonText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
});
