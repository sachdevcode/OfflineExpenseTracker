import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();

import React from 'react';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import { QueryProvider } from '@app/providers/QueryProvider';
import { RootNavigation } from '@navigation/index';

export default function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <RootNavigation />
      </QueryProvider>
    </ThemeProvider>
  );
}
