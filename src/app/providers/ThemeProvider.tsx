import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, ColorSchemeName, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, LightTheme, type AppTheme } from '@shared/theme/themes';

type Mode = 'system' | 'light' | 'dark';

type ThemeContextType = {
  mode: Mode;
  setMode: (m: Mode) => void;
  theme: AppTheme;
  isDark: boolean;
  toggle: () => void; // cycles light/dark (ignores system)
};

const ThemeContext = createContext<ThemeContextType | null>(null);
const KEY = 'ui.theme.mode';

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const systemScheme = Appearance.getColorScheme() as ColorSchemeName;

  const [mode, setModeState] = useState<Mode>('system');
  const [system, setSystem] = useState<ColorSchemeName>(systemScheme);

  // hydrate saved mode
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setModeState(saved);
        }
      } catch {}
    })();
  }, []);

  // listen to system changes
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) =>
      setSystem(colorScheme),
    );
    return () => sub.remove();
  }, []);

  const effective = mode === 'system' ? system ?? 'light' : mode;
  const isDark = effective === 'dark';

  const theme = useMemo(() => (isDark ? DarkTheme : LightTheme), [isDark]);

  const setMode = useCallback(async (m: Mode) => {
    setModeState(m);
    try {
      await AsyncStorage.setItem(KEY, m);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setModeState(prev => {
      const next =
        prev === 'dark' || (prev === 'system' && system === 'dark')
          ? 'light'
          : 'dark';
      AsyncStorage.setItem(KEY, next).catch(() => {});
      return next;
    });
  }, [system]);

  const value = useMemo(
    () => ({ mode, setMode, theme, isDark, toggle }),
    [mode, setMode, theme, isDark, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.card}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
