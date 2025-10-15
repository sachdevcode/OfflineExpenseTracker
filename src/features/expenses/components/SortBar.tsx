import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
  LinearTransition,
} from 'react-native-reanimated';
import { useTheme } from '@app/providers/ThemeProvider';
import type { SortKey, SortDir } from '../types';

type Props = {
  sortKey: SortKey;
  sortDir: SortDir;
  onChange: (key: SortKey, dir: SortDir) => void;
};

export const SortBar: React.FC<Props> = ({ sortKey, sortDir, onChange }) => {
  const { theme } = useTheme();

  // Arrow rotation for ASC/DESC (0deg = ASC; 180deg = DESC)
  const rot = useSharedValue(sortDir === 'asc' ? 0 : 180);
  React.useEffect(() => {
    rot.value = withTiming(sortDir === 'asc' ? 0 : 180, { duration: 160 });
  }, [sortDir]);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value}deg` }],
  }));

  const toggleDir = () => onChange(sortKey, sortDir === 'asc' ? 'desc' : 'asc');

  return (
    <Animated.View
      entering={FadeInDown.springify().duration(220)}
      layout={LinearTransition.duration(160)}
      style={[
        styles.wrap,
        {
          borderColor: theme.colors.borderMuted,
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.text,
        },
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Sort by</Text>
        <Segmented
          options={[
            { key: 'date' as SortKey, label: 'Date' },
            { key: 'category' as SortKey, label: 'Category' },
          ]}
          value={sortKey}
          onChange={(k) => onChange(k, sortDir)}
        />
      </View>

      <AnimatedPressable
        onPress={toggleDir}
        style={[
          styles.dirBtn,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        ]}
        scaleTo={0.96}
        accessibilityRole="button"
        accessibilityLabel="Toggle sort direction"
      >
        <View style={styles.dirInner}>
          <Text style={[styles.dirText, { color: theme.colors.text }]}>
            {sortDir === 'asc' ? 'Ascending' : 'Descending'}
          </Text>
          <Animated.Text style={[styles.arrow,{ color: theme.colors.text }, arrowStyle]}>
            ▲
          </Animated.Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

/** Segmented control with animated thumb */
const Segmented: React.FC<{
  options: { key: SortKey; label: string }[];
  value: SortKey;
  onChange: (k: SortKey) => void;
}> = ({ options, value, onChange }) => {
  const { theme } = useTheme();

  // Animated thumb position (0 or 1 index)
  const index = options.findIndex((o) => o.key === value);
  const x = useSharedValue(index);

  React.useEffect(() => {
    x.value = withSpring(options.findIndex((o) => o.key === value), {
      damping: 16,
      stiffness: 240,
    });
  }, [value]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (x.value || 0) * 96 }], // 96 = approx button width
  }));

  return (
    <View
      style={[
        styles.segmented,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.thumb,
          thumbStyle,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      />
      {options.map((opt, i) => {
        const active = opt.key === value;
        return (
          <AnimatedPressable
            key={opt.key}
            scaleTo={0.98}
            onPress={() => onChange(opt.key)}
            style={styles.segmentBtn}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Sort by ${opt.label}`}
          >
            <Text
              style={[
                styles.segmentLabel,
                { color: active ? theme.colors.primary : '#888' },
              ]}
            >
              {opt.label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
};

/** Tiny reusable press-scale wrapper */
const AnimatedPressable: React.FC<
  React.PropsWithChildren<{
    onPress?: () => void;
    style?: any;
    scaleTo?: number;
    accessibilityRole?: any;
    accessibilityLabel?: string;
    accessibilityState?: any;
  }>
> = ({ children, onPress, style, scaleTo = 0.96, ...a11y }) => {
  const s = useSharedValue(1);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Animated.View style={[st]}>
      <Pressable
        onPressIn={() => (s.value = withSpring(scaleTo))}
        onPressOut={() => (s.value = withSpring(1))}
        onPress={onPress}
        style={style}
        {...a11y}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: 14, fontWeight: '700' },

  /** Segmented */
  segmented: {
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  segmentBtn: {
    width: 96,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentLabel: { fontWeight: '700' },
  thumb: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 96,
    height: '100%',
    borderRadius: 999,
    borderWidth: 1,
  },

  /** Direction button */
  dirBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  dirInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dirText: { fontWeight: '700' },
  arrow: { fontSize: 12, lineHeight: 12, marginTop: 1 },
});
