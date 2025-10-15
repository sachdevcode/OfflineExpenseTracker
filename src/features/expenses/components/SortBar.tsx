import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@app/providers/ThemeProvider';
import type { SortKey, SortDir } from '../types';

type Props = {
  sortKey: SortKey;
  sortDir: SortDir;
  onChange: (key: SortKey, dir: SortDir) => void;
};

export const SortBar: React.FC<Props> = ({ sortKey, sortDir, onChange }) => {
  const { theme } = useTheme();

  const toggleDir = () => onChange(sortKey, sortDir === 'asc' ? 'desc' : 'asc');

  return (
    <View
      style={[
        styles.wrap,
        {
          borderColor: theme.colors.borderMuted,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Sort by:
        </Text>
        <View style={styles.chips}>
          <Chip
            label="Date"
            active={sortKey === 'date'}
            onPress={() => onChange('date', sortDir)}
          />
          <Chip
            label="Category"
            active={sortKey === 'category'}
            onPress={() => onChange('category', sortDir)}
          />
        </View>
      </View>
      <Pressable
        onPress={toggleDir}
        style={[styles.dirBtn, { backgroundColor: theme.colors.card }]}
      >
        <Text style={{ color: theme.colors.text, fontWeight: '700' }}>
          {sortDir.toUpperCase()}
        </Text>
      </Pressable>
    </View>
  );
};

const Chip: React.FC<{
  label: string;
  active: boolean;
  onPress: () => void;
}> = ({ label, active, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[styles.chip, { borderColor: active ? '#4F46E5' : '#3A3B40' }]}
  >
    <Text style={[styles.chipText, { color: active ? '#4F46E5' : '#888' }]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  wrap: { borderWidth: 1, borderRadius: 14, padding: 12, gap: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: 14, fontWeight: '700' },
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 999,
  },
  chipText: { fontWeight: '700' },
  dirBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
});
