import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { format } from 'date-fns';
import { useTheme } from '@app/providers/ThemeProvider';
import type { Expense } from '../types';

type Props = {
  item: Expense;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const BaseItem: React.FC<Props> = ({ item, onEdit, onDelete }) => {
  const { theme } = useTheme();

  const dateLabel = React.useMemo(() => format(new Date(item.date), 'dd MMM yyyy'), [item.date]);


  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      exiting={FadeOutUp.duration(150)}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.left}>
          <Text
            style={[styles.title, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={[styles.meta, { color: '#888' }]}>
            {item.category} • {dateLabel}
          </Text>
        </View>
        <Text style={[styles.amount, { color: theme.colors.primary }]}>
          {item.amount.toFixed(2)}
        </Text>
      </View>

      {!!item.note && (
        <Text
          style={[styles.note, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {item.note}
        </Text>
      )}

      <View style={styles.actions}>
        <Pressable onPress={() => onEdit(item.id)} style={styles.btn}>
          <Text style={styles.btnText}>Edit</Text>
        </Pressable>
        <Pressable
          onPress={() => onDelete(item.id)}
          style={[styles.btn, styles.delete]}
        >
          <Text style={styles.btnText}>Delete</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export const ExpenseItem = React.memo(BaseItem);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flex: 1, paddingRight: 8 },
  title: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 12 },
  amount: { fontSize: 16, fontWeight: '800' },
  note: { marginTop: 6, fontSize: 13, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
  },
  delete: { backgroundColor: '#EF4444' },
  btnText: { color: '#fff', fontWeight: '700' },
});
