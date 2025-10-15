import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '@app/providers/ThemeProvider';
import { DrawerNavigator } from './DrawerNavigator';

export const RootNavigation = () => {
  const { theme } = useTheme();
  return (
    <NavigationContainer theme={theme}>
      <DrawerNavigator />
    </NavigationContainer>
  );
};
