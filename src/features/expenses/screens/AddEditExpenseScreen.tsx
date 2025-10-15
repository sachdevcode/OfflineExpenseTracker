import React from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useTheme } from '@app/providers/ThemeProvider';
import { ExpenseForm } from '../components/ExpenseForm';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import {
  useExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
} from '../hooks';
import type { Expense } from '../types';

type ParamList = { AddEditExpense: { id?: string } };
type Route = RouteProp<ParamList, 'AddEditExpense'>;

const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const AddEditExpenseScreen = () => {
  const { theme } = useTheme();
  const nav = useNavigation();
  const route = useRoute<Route>();
  const { data = [] } = useExpensesQuery();
  const add = useAddExpenseMutation();
  const update = useUpdateExpenseMutation();

  const editing = !!route.params?.id;
  const current = React.useMemo(
    () => data.find(x => x.id === route.params?.id),
    [data, route.params?.id],
  );

  const handleSubmit = (payload: {
    title: string;
    category: string;
    amount: number;
    date: string;
    note?: string;
  }) => {
    if (editing) {
      if (!current) {
        Alert.alert('Not found', 'Expense no longer exists.');
        return;
      }
      const updated: Expense = { ...current, ...payload };
      update.mutate(updated, { onSuccess: () => nav.goBack() });
    } else {
      const created: Expense = { id: uuid(), ...payload };
      add.mutate(created, { onSuccess: () => nav.goBack() });
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.header, { color: theme.colors.text }]}>
        {editing ? 'Edit Expense' : 'Add Expense'}
      </Text>
      <ExpenseForm
        initial={current}
        onSubmit={handleSubmit}
        onCancel={() => nav.goBack()}
        submitLabel={editing ? 'Update' : 'Add'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: '800', marginBottom: 12 },
});
