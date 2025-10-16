import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, G, Text as SvgText, Line } from 'react-native-svg';
import { useTheme } from '@app/providers/ThemeProvider';
import { 
  getTopCategories, 
  calculateBarDimensions,
  getChartColor 
} from '../utils/chartUtils';
import type { Expense } from '@features/expenses/types';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 64;
const CHART_HEIGHT = 250;

type Props = {
  expenses: Expense[];
  limit?: number;
};

export const BarChart: React.FC<Props> = ({ expenses, limit = 5 }) => {
  const { theme } = useTheme();
  const topCategories = getTopCategories(expenses, limit);

  if (topCategories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          No data available
        </Text>
      </View>
    );
  }

  // Validate data before rendering
  const validCategories = topCategories.filter(cat => 
    !isNaN(cat.amount) && cat.amount >= 0
  );
  
  if (validCategories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          No valid data to display
        </Text>
      </View>
    );
  }

  const dimensions = calculateBarDimensions(validCategories, CHART_WIDTH, CHART_HEIGHT);

  // Generate Y-axis labels
  const yAxisLabels = [];
  const numLabels = 5;
  for (let i = 0; i <= numLabels; i++) {
    const value = (dimensions.maxValue * i) / numLabels;
    const y = dimensions.padding + dimensions.chartHeight - (i / numLabels) * dimensions.chartHeight;
    yAxisLabels.push({ value, y });
  }

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* Grid lines */}
        {yAxisLabels.map((label, index) => (
          <Line
            key={index}
            x1={dimensions.padding}
            y1={label.y}
            x2={dimensions.padding + dimensions.chartWidth}
            y2={label.y}
            stroke={theme.colors.borderMuted}
            strokeWidth={1}
            strokeDasharray="2,2"
            opacity={0.5}
          />
        ))}

        {/* Y-axis labels */}
        {yAxisLabels.map((label, index) => (
          <SvgText
            key={index}
            x={dimensions.padding - 10}
            y={label.y + 4}
            textAnchor="end"
            fontSize="10"
            fontWeight="600"
            fill={theme.colors.text}
          >
            {label?.value?.toFixed(0) || 0}
          </SvgText>
        ))}

        {/* Bars */}
        {validCategories.map((item, index) => {
          const barHeight = (item.amount / dimensions.maxValue) * dimensions.chartHeight;
          const x = dimensions.padding + index * (dimensions.barWidth + dimensions.barSpacing);
          const y = dimensions.padding + dimensions.chartHeight - barHeight;
          
          return (
            <G key={item.category}>
              <Rect
                x={x}
                y={y}
                width={dimensions.barWidth}
                height={barHeight}
                fill={getChartColor(index)}
                rx={4}
                ry={4}
              />
              
              {/* Value label on top of bar */}
              <SvgText
                x={x + dimensions.barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={theme.colors.text}
              >
                {item.amount.toFixed(0)}
              </SvgText>
            </G>
          );
        })}

        {/* X-axis labels */}
        {validCategories.map((item, index) => {
          const x = dimensions.padding + index * (dimensions.barWidth + dimensions.barSpacing) + dimensions.barWidth / 2;
          return (
            <SvgText
              key={index}
              x={x}
              y={CHART_HEIGHT - 10}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={theme.colors.text}
            >
              {item.category.length > 8 ? item.category.substring(0, 8) + '...' : item.category}
            </SvgText>
          );
        })}

        {/* Axes */}
        <Line
          x1={dimensions.padding}
          y1={dimensions.padding}
          x2={dimensions.padding}
          y2={dimensions.padding + dimensions.chartHeight}
          stroke={theme.colors.border}
          strokeWidth={1}
        />
        <Line
          x1={dimensions.padding}
          y1={dimensions.padding + dimensions.chartHeight}
          x2={dimensions.padding + dimensions.chartWidth}
          y2={dimensions.padding + dimensions.chartHeight}
          stroke={theme.colors.border}
          strokeWidth={1}
        />
      </Svg>
      
      {/* Category Details */}
      <View style={styles.details}>
        {validCategories.map((item, index) => (
          <View key={item.category} style={styles.detailItem}>
            <View style={styles.detailLeft}>
              <View
                style={[
                  styles.detailColor,
                  { backgroundColor: getChartColor(index) },
                ]}
              />
              <Text style={[styles.detailCategory, { color: theme.colors.text }]}>
                {item.category}
              </Text>
            </View>
            <View style={styles.detailRight}>
              <Text style={[styles.detailAmount, { color: theme.colors.primary }]}>
                ${item.amount.toFixed(2)}
              </Text>
              <Text style={[styles.detailCount, { color: theme.colors.text }]}>
                {item.count} {item.count === 1 ? 'expense' : 'expenses'}
              </Text>
            </View>
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
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
  details: {
    width: '100%',
    marginTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  detailCategory: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  detailRight: {
    alignItems: 'flex-end',
  },
  detailAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  detailCount: {
    fontSize: 12,
    opacity: 0.7,
  },
});
