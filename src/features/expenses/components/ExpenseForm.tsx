import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@app/providers/ThemeProvider';
import type { Expense } from '../types';
import { DateField } from '@shared/components/DateField';

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

  return (
    <Animated.View entering={FadeInDown.duration(180)} style={styles.wrap}>
      <Text style={[styles.label, { color: theme.colors.text }]}>Title</Text>
      <TextInput
        style={inputStyle()}
        placeholder="E.g., Lunch with client"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Category</Text>
      <TextInput
        style={inputStyle()}
        placeholder="Food / Travel / Bills"
        placeholderTextColor="#888"
        value={category}
        onChangeText={setCategory}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Amount</Text>
      <TextInput
        style={inputStyle()}
        keyboardType="numeric"
        placeholder="0.00"
        placeholderTextColor="#888"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>
        Date (ISO or YYYY-MM-DD)
      </Text>

      <DateField
        value={date}
        onChange={(iso: string) => setDate(iso)}
        // optional: lock future dates if you want
        // maximumDate={new Date()}
      />

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

      <View style={styles.row}>
        <Pressable onPress={onCancel} style={[styles.btn, styles.secondary]}>
          <Text style={styles.btnText}>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleSubmit} style={[styles.btn, styles.primary]}>
          <Text style={styles.btnText}>{submitLabel}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  label: { fontSize: 12, fontWeight: '700', opacity: 0.8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 14 },
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: '#2563EB' },
  secondary: { backgroundColor: '#4B5563' },
  btnText: { color: '#fff', fontWeight: '800' },
});
