import React from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  LinearTransition,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTheme } from '@app/providers/ThemeProvider';
import type { Expense } from '../types';
import { DateField } from '@shared/components/DateField';
import { useCheckBudgetViolations } from '@features/budget/hooks';
import { checkBudgetViolations } from '@features/budget/utils/budgetUtils';
import { useBudgetStore } from '@features/budget/store';
import { useExpenseStore } from '../store';

type Props = {
  initial?: Partial<Expense>;
  onSubmit: (payload: {
    title: string;
    category: string;
    amount: number;
    date: string;
    note?: string;
  }) => void;
  onCancel: () => void;
  submitLabel?: string;
};

export const ExpenseForm: React.FC<Props> = ({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}) => {
  const { theme } = useTheme();
  const [title, setTitle] = React.useState(initial?.title ?? '');
  const [category, setCategory] = React.useState(initial?.category ?? '');
  const [amount, setAmount] = React.useState(
    initial?.amount ? String(initial?.amount) : '',
  );
  const [date, setDate] = React.useState(
    initial?.date ?? new Date().toISOString(),
  );
  const [note, setNote] = React.useState(initial?.note ?? '');
  const [budgetWarning, setBudgetWarning] = React.useState<string | null>(null);

  const budgets = useBudgetStore(s => s.budgets);
  const expenses = useExpenseStore(s => s.expenses);

  // Check budget violations when amount or category changes
  React.useEffect(() => {
    const amt = Number(amount);
    if (category.trim() && !isNaN(amt) && amt > 0) {
      const newExpense = {
        title: title.trim(),
        category: category.trim(),
        amount: amt,
        date: new Date(date).toISOString(),
        note: note.trim() || undefined,
      };
      
      const violations = checkBudgetViolations(budgets, expenses, newExpense);
      if (violations.length > 0) {
        const violation = violations[0];
        if (violation.exceeded) {
          setBudgetWarning(`⚠️ This will exceed your ${category} budget by $${(violation.spent - violation.budget).toFixed(2)}!`);
        } else if (violation.percentage >= 90) {
          setBudgetWarning(`⚠️ This will put you at ${violation.percentage.toFixed(1)}% of your ${category} budget!`);
        } else {
          setBudgetWarning(null);
        }
      } else {
        setBudgetWarning(null);
      }
    } else {
      setBudgetWarning(null);
    }
  }, [amount, category, budgets, expenses, title, date, note]);

  const handleSubmit = () => {
    const amt = Number(amount);
    if (!title.trim() || !category.trim() || isNaN(amt)) {
      Alert.alert(
        'Invalid',
        'Please fill title, category, and a valid amount.',
      );
      return;
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      Alert.alert('Invalid', 'Date is not valid.');
      return;
    }
    onSubmit({
      title: title.trim(),
      category: category.trim(),
      amount: amt,
      date: d.toISOString(),
      note: note.trim() || undefined,
    });
  };

  const inputStyle = (extra?: any) => [
    styles.input,
    {
      color: theme.colors.text,
      borderColor: theme.colors.borderMuted,
      backgroundColor: theme.colors.card,
    },
    extra,
  ];

  // --- Tiny press-scale animation for buttons ---
  const saveScale = useSharedValue(1);
  const cancelScale = useSharedValue(1);

  const saveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));
  const cancelStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cancelScale.value }],
  }));

  const pressIn = (sv: typeof saveScale) => () => {
    sv.value = withSpring(0.96, { damping: 18, stiffness: 220 });
  };
  const pressOut = (sv: typeof saveScale) => () => {
    sv.value = withSpring(1, { damping: 18, stiffness: 220 });
  };

  // stagger helper
  const enter = (delay: number) =>
    FadeInDown.duration(180).delay(delay).springify();

  return (
    <Animated.View
      entering={FadeInDown.duration(160)}
      layout={LinearTransition.duration(180)}
      style={styles.wrap}
    >
      {/* Title */}
      <Animated.View
        entering={enter(40)}
        layout={LinearTransition.duration(160)}
      >
        <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
        <TextInput
          style={inputStyle()}
          placeholder="E.g., Lunch with client"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />
      </Animated.View>

      {/* Category */}
      <Animated.View
        entering={enter(90)}
        layout={LinearTransition.duration(160)}
      >
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Category
        </Text>
        <TextInput
          style={inputStyle()}
          placeholder="Food / Travel / Bills"
          placeholderTextColor="#888"
          value={category}
          onChangeText={setCategory}
        />
      </Animated.View>

      {/* Amount */}
      <Animated.View
        entering={enter(140)}
        layout={LinearTransition.duration(160)}
      >
        <Text style={[styles.label, { color: theme.colors.text }]}>Amount</Text>
        <TextInput
          style={inputStyle()}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor="#888"
          value={amount}
          onChangeText={setAmount}
        />
        {budgetWarning && (
          <View style={[styles.warningContainer, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
            <Text style={[styles.warningText, { color: '#92400E' }]}>
              {budgetWarning}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Date */}
      <Animated.View
        entering={enter(190)}
        layout={LinearTransition.duration(160)}
      >
        <DateField
          value={date}
          onChange={(iso: string) => setDate(iso)}
          // maximumDate={new Date()} // optional: prevent future dates
        />
      </Animated.View>

      {/* Note */}
      <Animated.View
        entering={enter(240)}
        layout={LinearTransition.duration(160)}
      >
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Note (optional)
        </Text>
        <TextInput
          style={inputStyle({ height: 90, textAlignVertical: 'top' })}
          multiline
          placeholder="Add a short note…"
          placeholderTextColor="#888"
          value={note}
          onChangeText={setNote}
        />
      </Animated.View>

      {/* Buttons */}
      <Animated.View
        entering={enter(290)}
        layout={LinearTransition.duration(160)}
        style={styles.row}
      >
        <Animated.View style={[styles.btnAnimatedWrap, cancelStyle]}>
          <Pressable
            onPressIn={pressIn(cancelScale)}
            onPressOut={pressOut(cancelScale)}
            onPress={onCancel}
            style={[styles.btn, styles.secondary]}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.btnAnimatedWrap, saveStyle]}>
          <Pressable
            onPressIn={pressIn(saveScale)}
            onPressOut={pressOut(saveScale)}
            onPress={handleSubmit}
            style={[styles.btn, styles.primary]}
          >
            <Text style={styles.btnText}>{submitLabel}</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  label: { fontSize: 12, fontWeight: '700', opacity: 0.8, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14 },
  warningContainer: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btnAnimatedWrap: { flex: 1 ,height:45},
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: '#4F46E5' },
  secondary: { backgroundColor: '#4B5563' },
  btnText: { color: '#fff', fontWeight: '800' },
});
