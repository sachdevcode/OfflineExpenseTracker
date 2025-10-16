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
import { SimplePieChart, BarChart } from '../components';

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

      {/* Category Distribution Pie Chart */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Category Distribution
        </Text>
        <SimplePieChart expenses={expenses} />
      </View>

      {/* Top Categories Bar Chart */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Top Categories
        </Text>
        <BarChart expenses={expenses} limit={5} />
      </View>
    </ScrollView>
  );
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
