import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@app/providers/ThemeProvider';

const Chip: React.FC<{
  active: boolean;
  label: string;
  onPress: () => void;
}> = ({ active, label, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          opacity: pressed ? 0.8 : 1,
          borderColor: active ? '#4F46E5' : '#3A3B40',
        },
      ]}
    >
      <Text style={[styles.chipText, { color: active ? '#4F46E5' : '#888' }]}>
        {label}
      </Text>
    </Pressable>
  );
};

export const ThemeToggle = () => {
  const { mode, setMode, toggle, isDark, theme } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.borderMuted,
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Theme</Text>
      <View style={styles.row}>
        <Chip
          active={mode === 'system'}
          label="System"
          onPress={() => setMode('system')}
        />
        <Chip
          active={mode === 'light'}
          label="Light"
          onPress={() => setMode('light')}
        />
        <Chip
          active={mode === 'dark'}
          label="Dark"
          onPress={() => setMode('dark')}
        />
      </View>
      <Pressable
        onPress={toggle}
        style={({ pressed }) => [
          styles.quickToggle,
          { backgroundColor: theme.colors.card, opacity: pressed ? 0.9 : 1 },
        ]}
      >
        <Text style={{ color: theme.colors.text, fontWeight: '600' }}>
          Quick toggle (now {isDark ? 'Dark' : 'Light'})
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { padding: 16, borderRadius: 14, borderWidth: 1, gap: 14 },
  title: { fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 10 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontWeight: '700' },
  quickToggle: { padding: 12, borderRadius: 12, alignItems: 'center' },
});
