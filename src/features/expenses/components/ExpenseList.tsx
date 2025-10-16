import React from 'react';
import { FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import { ExpenseItem } from './ExpenseItem';
import type { Expense, SortKey, SortDir } from '../types';
import { SwipeToDeleteRow } from './SwipeToDeleteRow';

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
    ({ item, index }: ListRenderItemInfo<Expense>) => (
      <Animated.View
        entering={FadeInDown.duration(300).delay(index * 50)}
        exiting={FadeOutUp.duration(300)}
        layout={LinearTransition.duration(300)}
      >
        <SwipeToDeleteRow
          id={item.id}
          onDelete={id => onDelete(id)}
        >
          <ExpenseItem item={item} onEdit={onEdit} onDelete={onDelete} />
        </SwipeToDeleteRow>
      </Animated.View>
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
      // Optimize for smooth animations
      removeClippedSubviews={false}
      initialNumToRender={8}
      windowSize={8}
      maxToRenderPerBatch={3}
      updateCellsBatchingPeriod={100}
    />
  );
};

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
});
