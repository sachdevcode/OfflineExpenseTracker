import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@app/providers/ThemeProvider';

type Props = {
  // value is an ISO string in your store
  value: string;
  onChange: (iso: string) => void;
  label?: string;
  // optional min/max if you want constraints
  minimumDate?: Date;
  maximumDate?: Date;
};

export const DateField: React.FC<Props> = ({
  value,
  onChange,
  label = 'Date',
  minimumDate,
  maximumDate,
}) => {
  const { theme, isDark } = useTheme();
  const [open, setOpen] = React.useState(false);
  const date = React.useMemo(() => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [value]);

  const display = React.useMemo(() => format(date, 'dd MMM yyyy'), [date]);

  return (
    <Animated.View entering={FadeInDown.duration(160)} style={styles.wrap}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>

      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.borderMuted,
          },
        ]}
      >
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {display}
        </Text>
      </Pressable>

      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        theme={isDark ? 'dark' : 'light'}
        onConfirm={d => {
          setOpen(false);
          onChange(d.toISOString()); // keep ISO in store
        }}
        onCancel={() => setOpen(false)}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 12, fontWeight: '700', opacity: 0.8 },
  field: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  value: { fontSize: 14, fontWeight: '600' },
});
