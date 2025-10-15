// src/shared/theme/themes.ts
import { Platform } from 'react-native';
import type { Theme as NavTheme } from '@react-navigation/native';

export type AppTheme = NavTheme & {
  colors: NavTheme['colors'] & {
    surface: string;
    borderMuted: string;
  };
  // add Paper-style fonts so anything expecting fonts.regular works
  fonts: {
    regular: { fontFamily: string; fontWeight: '400' | 'normal' | any };
    medium:  { fontFamily: string; fontWeight: '500' | any };
    light:   { fontFamily: string; fontWeight: '300' | any };
    thin:    { fontFamily: string; fontWeight: '200' | any };
  };
};

const base = {
  animation: { scale: 1.0 },
};

const defaultFont = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
})!;

const fonts = {
  regular: { fontFamily: defaultFont, fontWeight: '400' as const },
  medium:  { fontFamily: defaultFont, fontWeight: '500' as const },
  light:   { fontFamily: defaultFont, fontWeight: '300' as const },
  thin:    { fontFamily: defaultFont, fontWeight: '200' as const },
};

export const LightTheme: AppTheme = {
  dark: false,
  ...base,
  colors: {
    primary: '#0F62FE',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#0A0A0A',
    border: '#E5E7EB',
    notification: '#FF3B30',
    surface: '#F7F8FA',
    borderMuted: '#EDF0F3',
  },
  fonts,
};

export const DarkTheme: AppTheme = {
  dark: true,
  ...base,
  colors: {
    primary: '#78A9FF',
    background: '#0B0B0C',
    card: '#141416',
    text: '#EDEEF1',
    border: '#2A2C31',
    notification: '#FF453A',
    surface: '#1A1B1E',
    borderMuted: '#212329',
  },
  fonts,
};
