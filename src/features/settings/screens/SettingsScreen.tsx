import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ThemeToggle } from '@shared/components/ThemeToggle';
import { useTheme } from '@app/providers/ThemeProvider';

export const SettingsScreen = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.header, { color: theme.colors.text }]}>
        Appearance
      </Text>
      <ThemeToggle />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },
  header: { fontSize: 20, fontWeight: '700' },
});
