import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@app/providers/ThemeProvider';
import {
  getCategoryData,
  calculatePieSlices,
  getChartDimensions,
} from '../utils/chartUtils';
import type { Expense } from '@features/expenses/types';

const { width } = Dimensions.get('window');
const CHART_SIZE = Math.min(width - 64, 280);
const RADIUS = 80;

type Props = {
  expenses: Expense[];
};

export const PieChart: React.FC<Props> = ({ expenses }) => {
  const { theme } = useTheme();
  const categoryData = getCategoryData(expenses);
  const dimensions = getChartDimensions(CHART_SIZE);

  if (categoryData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          No data available
        </Text>
      </View>
    );
  }

  const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

  // Handle edge case where total is 0 or invalid
  if (total <= 0 || isNaN(total)) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          No valid data to display
        </Text>
      </View>
    );
  }

  const slices = calculatePieSlices(categoryData, RADIUS);

  return (
    <View style={styles.container}>
      <Svg width={CHART_SIZE} height={CHART_SIZE}>
        <G>
          {slices.map((slice, index) => {
            // Calculate values safely
            const startAngle = slices
              .slice(0, index)
              .reduce((sum, s) => sum + s.percentage * 3.6, 0);
            const circumference = 2 * Math.PI * RADIUS;
            const strokeDashLength = (slice.percentage / 100) * circumference;
            const strokeDasharray = `${Math.max(
              0,
              strokeDashLength,
            )} ${circumference}`;
            const strokeDashoffset = -slices
              .slice(0, index)
              .reduce((sum, s) => (s.percentage / 100) * circumference, 0);

            // Validate all values before rendering
            if (
              isNaN(strokeDashLength) ||
              isNaN(strokeDashoffset) ||
              strokeDashLength < 0
            ) {
              return null;
            }

            return (
              <Circle
                key={slice.category}
                cx={dimensions.centerX}
                cy={dimensions.centerY}
                r={RADIUS}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={40}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${startAngle} ${dimensions.centerX} ${dimensions.centerY})`}
              />
            );
          })}
        </G>

        {/* Center text */}
        <SvgText
          x={dimensions.centerX}
          y={dimensions.centerY - 10}
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill={theme.colors.text}
        >
          Total
        </SvgText>
        <SvgText
          x={dimensions.centerX}
          y={dimensions.centerY + 10}
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill={theme.colors.primary}
        >
          ${total.toFixed(0)}
        </SvgText>
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        {slices.map((slice, index) => (
          <View key={slice.category + ' - ' + index} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: slice.color }]}
            />
            <View style={styles.legendTextContainer}>
              <Text style={[styles.legendText, { color: theme.colors.text }]}>
                {slice.category}
              </Text>
              <Text
                style={[styles.legendPercentage, { color: theme.colors.text }]}
              >
                {slice.percentage.toFixed(1)}%
              </Text>
            </View>
            <Text
              style={[styles.legendAmount, { color: theme.colors.primary }]}
            >
              ${slice.amount.toFixed(0)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyContainer: {
    height: CHART_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  legendPercentage: {
    fontSize: 12,
    opacity: 0.7,
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
});
