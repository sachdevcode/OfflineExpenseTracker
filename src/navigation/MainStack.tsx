import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@features/home/screens/HomeScreen';
import { SettingsScreen } from '@features/settings/screens/SettingsScreen';
import { ExpensesScreen } from '@features/expenses/screens/ExpensesScreen';
import { AddEditExpenseScreen } from '@features/expenses/screens/AddEditExpenseScreen';
import { useTheme } from '@app/providers/ThemeProvider';

export type MainStackParamList = {
  Home: undefined;
  Settings: undefined;
  Expenses: undefined;
  AddEditExpense: { id?: string } | undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTitleStyle: { color: theme.colors.text },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      {/* <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      /> */}
      <Stack.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{ title: 'Expenses' }}
      />
      <Stack.Screen
        name="AddEditExpense"
        component={AddEditExpenseScreen}
        options={{ title: 'Expense' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};
