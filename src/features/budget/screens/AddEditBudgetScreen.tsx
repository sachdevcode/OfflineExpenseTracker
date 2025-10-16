import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '@app/providers/ThemeProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useAddBudgetMutation,
  useUpdateBudgetMutation,
} from '../hooks';
import { Budget } from '../store';

const BUDGET_PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
] as const;

export const AddEditBudgetScreen = () => {
  const { theme } = useTheme();
  const nav = useNavigation();
  const route = useRoute();
  const budget = (route.params as any)?.budget as Budget | undefined;

  const [category, setCategory] = React.useState(budget?.category || '');
  const [amount, setAmount] = React.useState(budget?.amount?.toString() || '');
  const [period, setPeriod] = React.useState<Budget['period']>(budget?.period || 'monthly');

  const addBudget = useAddBudgetMutation();
  const updateBudget = useUpdateBudgetMutation();

  const isEditing = !!budget;

  const handleSave = () => {
    // Validation
    if (!category.trim()) {
      Alert.alert('Error', 'Please enter a category');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const budgetData = {
      category: category.trim(),
      amount: amountNum,
      period,
    };

    if (isEditing) {
      updateBudget.mutate(
        { id: budget.id, budget: budgetData },
        {
          onSuccess: () => {
            Alert.alert('Success', 'Budget updated successfully', [
              { text: 'OK', onPress: () => nav.goBack() },
            ]);
          },
          onError: () => {
            Alert.alert('Error', 'Failed to update budget');
          },
        }
      );
    } else {
      addBudget.mutate(budgetData, {
        onSuccess: () => {
          Alert.alert('Success', 'Budget created successfully', [
            { text: 'OK', onPress: () => nav.goBack() },
          ]);
        },
        onError: () => {
          Alert.alert('Error', 'Failed to create budget');
        },
      });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {isEditing ? 'Edit Budget' : 'Add Budget'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          {isEditing ? 'Update your spending limit' : 'Set a spending limit for a category'}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Category
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={category}
            onChangeText={setCategory}
            placeholder="e.g., Food, Transportation, Entertainment"
            placeholderTextColor={theme.colors.text + '80'}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Amount
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={theme.colors.text + '80'}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Period
          </Text>
          <View style={styles.periodButtons}>
            {BUDGET_PERIODS.map((p) => (
              <Pressable
                key={p.value}
                onPress={() => setPeriod(p.value as Budget['period'])}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: period === p.value ? theme.colors.primary : theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    {
                      color: period === p.value ? '#fff' : theme.colors.text,
                    },
                  ]}
                >
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            💡 You'll receive notifications when you approach or exceed your budget limit.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={() => nav.goBack()}
          style={[styles.cancelButton, { borderColor: theme.colors.border }]}
        >
          <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>
            Cancel
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          disabled={addBudget.isPending || updateBudget.isPending}
        >
          <Text style={styles.saveButtonText}>
            {addBudget.isPending || updateBudget.isPending
              ? 'Saving...'
              : isEditing
              ? 'Update Budget'
              : 'Create Budget'}
          </Text>
        </Pressable>
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
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  periodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
