import React from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '@app/providers/ThemeProvider';
import { CustomDrawerContent } from '@navigation/CustomDrawerContent';
import { ExpensesScreen } from '@features/expenses/screens/ExpensesScreen';
import { SettingsScreen } from '@features/settings/screens/SettingsScreen';
import { AddEditExpenseScreen } from '@features/expenses/screens/AddEditExpenseScreen';
import { AnalyticsScreen } from '@features/analytics/screens/AnalyticsScreen';

export type DrawerParamList = {
  Expenses: undefined;
  Settings: undefined;
  AddEditExpense: { id?: string } | undefined;
  Analytics: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator = () => {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTitleStyle: { color: theme.colors.text },
        headerTintColor: theme.colors.text,
        drawerStyle: { backgroundColor: theme.colors.card },
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.text,
        drawerLabelStyle: { fontWeight: '600' },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
    >
      <Drawer.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          title: 'Expenses',
          drawerIcon: ({ color, size }) => (
            <Icon name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
          drawerIcon: ({ color, size }) => (
            <Icon name="analytics" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="AddEditExpense"
        component={AddEditExpenseScreen}
        options={{
          title: 'Expense',
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
    </Drawer.Navigator>
  );
};

// Simple icon component (you can replace with react-native-vector-icons later)
const Icon = ({ name, size, color }: { name: string; size: number; color: string }) => {
  const getIconSymbol = (iconName: string) => {
    switch (iconName) {
      case 'receipt': return '📄';
      case 'settings': return '⚙️';
      case 'analytics': return '📊';
      default: return '📄';
    }
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {getIconSymbol(name)}
    </Text>
  );
};

