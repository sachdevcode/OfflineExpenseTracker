import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useTheme } from '@app/providers/ThemeProvider';
import {
  useExpensesQuery,
  useDeleteExpenseMutation,
  useSyncZustandToRQ,
} from '../hooks';
import { useExpenseStore } from '../store';
import { SortBar } from '../components/SortBar';
import { ExpenseList } from '../components/ExpenseList';
import { Empty } from '../components/Empty';
// import { StoreDebugger } from '../components/StoreDebugger';
// import { testAsyncStorage } from '../utils/asyncStorageTest';
import type { SortKey, SortDir } from '../types';
import { useNavigation } from '@react-navigation/native';

export const ExpensesScreen = () => {
  const { theme } = useTheme();
  const nav = useNavigation();
  useSyncZustandToRQ();

  const [sortKey, setSortKey] = React.useState<SortKey>('date');
  const [sortDir, setSortDir] = React.useState<SortDir>('desc');

  const { data = [], isLoading } = useExpensesQuery();
  console.log('data', data);
  const del = useDeleteExpenseMutation();

  const loadExpenses = useExpenseStore(s => s.loadExpenses);

  // Load expenses on component mount
  React.useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const onEdit = (id: string) =>
    (nav as any).navigate('AddEditExpense', { id });

  const onDelete = (id: string) => del.mutate(id);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.header, { color: theme.colors.text }]}>
        Expenses
      </Text>

      <SortBar
        sortKey={sortKey}
        sortDir={sortDir}
        onChange={(k, d) => {
          setSortKey(k);
          setSortDir(d);
        }}
      />

      {/* <StoreDebugger /> */}

      <View style={{ marginTop: 12, marginBottom: 40 }}>
        {!isLoading && data.length === 0 ? (
          <Empty />
        ) : (
          <ExpenseList
            data={data}
            sortKey={sortKey}
            sortDir={sortDir}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </View>

      <Pressable
        onPress={() => (nav as any).navigate('AddEditExpense', {})}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingBottom: 0 },
  header: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  fabText: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: -1 },
});
