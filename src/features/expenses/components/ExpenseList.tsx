import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ExpenseItem } from './ExpenseItem';
import type { Expense, SortKey, SortDir } from '../types';

type Props = {
  data: Expense[];
  sortKey: SortKey;
  sortDir: SortDir;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const ExpenseList: React.FC<Props> = ({
  data,
  sortKey,
  sortDir,
  onEdit,
  onDelete,
}) => {
  const sorted = React.useMemo(() => {
    const cpy = [...data];
    cpy.sort((a, b) => {
      if (sortKey === 'date') {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return sortDir === 'asc' ? da - db : db - da;
      } else {
        // category
        const ca = a.category.toLowerCase();
        const cb = b.category.toLowerCase();
        const cmp = ca.localeCompare(cb);
        return sortDir === 'asc' ? cmp : -cmp;
      }
    });
    return cpy;
  }, [data, sortKey, sortDir]);

  const keyExtractor = React.useCallback((item: Expense) => item.id, []);
  const renderItem = React.useCallback(
    ({ item }: { item: Expense }) => (
      <ExpenseItem item={item} onEdit={onEdit} onDelete={onDelete} />
    ),
    [onEdit, onDelete],
  );

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={sorted}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
});
