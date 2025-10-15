import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@app/providers/ThemeProvider';

export const Empty = () => {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[styles.text, { color: theme.colors.text }]}>
        No expenses yet. Add your first one.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingVertical: 40, alignItems: 'center' },
  text: { fontSize: 14, opacity: 0.7 },
});
