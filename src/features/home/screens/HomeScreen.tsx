import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@app/providers/ThemeProvider';

export const HomeScreen = () => {
  const nav = useNavigation();
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Welcome</Text>

      <Pressable
        onPress={() => nav.navigate('Settings' as never)}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.colors.primary,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text style={styles.buttonText}>Go to Settings</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  button: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
