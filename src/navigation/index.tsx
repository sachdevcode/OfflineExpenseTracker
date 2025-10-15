import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MainStack } from '@navigation/MainStack';
import { useTheme } from '@app/providers/ThemeProvider';

export const RootNavigation = () => {
  const { theme } = useTheme();
  return (
    <NavigationContainer theme={theme}>
      <MainStack />
    </NavigationContainer>
  );
};
