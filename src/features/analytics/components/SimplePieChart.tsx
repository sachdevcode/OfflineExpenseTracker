import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@app/providers/ThemeProvider';
import { 
  getCategoryData, 
  getChartColor,
  type CategoryData 
} from '../utils/chartUtils';
import type { Expense } from '@features/expenses/types';

const { width } = Dimensions.get('window');
const CHART_SIZE = Math.min(width - 64, 280);
const RADIUS = 80;
const CENTER_X = CHART_SIZE / 2;
const CENTER_Y = CHART_SIZE / 2;

type Props = {
  expenses: Expense[];
};

export const SimplePieChart: React.FC<Props> = ({ expenses }) => {
  const { theme } = useTheme();
  const categoryData = getCategoryData(expenses);

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

  // Create pie slices using Path elements
  const createPieSlice = (startAngle: number, endAngle: number, color: string) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = CENTER_X + RADIUS * Math.cos(startAngleRad);
    const y1 = CENTER_Y + RADIUS * Math.sin(startAngleRad);
    const x2 = CENTER_X + RADIUS * Math.cos(endAngleRad);
    const y2 = CENTER_Y + RADIUS * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${CENTER_X} ${CENTER_Y}`,
      `L ${x1} ${y1}`,
      `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    return pathData;
  };

  let currentAngle = 0;
  const slices = categoryData.map((item, index) => {
    const percentage = item.amount / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle += angle;
    
    return {
      ...item,
      startAngle,
      endAngle,
      angle,
      percentage: percentage * 100,
      color: getChartColor(index),
      pathData: createPieSlice(startAngle, endAngle, getChartColor(index)),
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={CHART_SIZE} height={CHART_SIZE}>
        <G>
          {slices.map((slice, index) => (
            <Path
              key={slice.category}
              d={slice.pathData}
              fill={slice.color}
              stroke={theme.colors.background}
              strokeWidth={2}
            />
          ))}
        </G>
        
        {/* Center text */}
        <SvgText
          x={CENTER_X}
          y={CENTER_Y - 10}
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill={theme.colors.text}
        >
          Total
        </SvgText>
        <SvgText
          x={CENTER_X}
          y={CENTER_Y + 10}
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill={theme.colors.primary}
        >
          {total?.toFixed(0) || 0}
        </SvgText>
      </Svg>
      
      {/* Legend */}
      <View style={styles.legend}>
        {slices.map((slice, index) => (
          <View key={slice.category} style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: slice.color },
              ]}
            />
            <View style={styles.legendTextContainer}>
              <Text style={[styles.legendText, { color: theme.colors.text }]}>
                {slice.category}
              </Text>
              <Text style={[styles.legendPercentage, { color: theme.colors.text }]}>
                {slice.percentage.toFixed(1)}%
              </Text>
            </View>
            <Text style={[styles.legendAmount, { color: theme.colors.primary }]}>
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
