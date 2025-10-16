import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@app/providers/ThemeProvider';
import { BudgetAlert as BudgetAlertType } from '../store';
import { getBudgetStatusColor, getBudgetStatusText } from '../utils/budgetUtils';

type Props = {
  alert: BudgetAlertType;
  onDismiss?: () => void;
};

export const BudgetAlert: React.FC<Props> = ({ alert, onDismiss }) => {
  const { theme } = useTheme();

  const getAlertIcon = () => {
    if (alert.exceeded) return '🚨';
    if (alert.percentage >= 90) return '⚠️';
    if (alert.percentage >= 75) return '⚡';
    return '💰';
  };

  const getAlertMessage = () => {
    if (alert.exceeded) {
      return `You've exceeded your ${alert.category} budget by $${(alert.spent - alert.budget).toFixed(2)}!`;
    }
    if (alert.percentage >= 90) {
      return `You're at ${alert.percentage.toFixed(1)}% of your ${alert.category} budget!`;
    }
    if (alert.percentage >= 75) {
      return `You're approaching your ${alert.category} budget limit (${alert.percentage.toFixed(1)}%)`;
    }
    return `Budget update for ${alert.category}`;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: alert.exceeded ? '#FEF2F2' : '#FFFBEB',
          borderColor: alert.exceeded ? '#FECACA' : '#FDE68A',
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getAlertIcon()}</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {getBudgetStatusText(alert.exceeded ? 'exceeded' : 'warning')}
          </Text>
          <Text style={[styles.message, { color: theme.colors.text }]}>
            {getAlertMessage()}
          </Text>
          <View style={styles.details}>
            <Text style={[styles.detail, { color: theme.colors.text }]}>
              Spent: ${alert.spent.toFixed(2)}
            </Text>
            <Text style={[styles.detail, { color: theme.colors.text }]}>
              Budget: ${alert.budget.toFixed(2)}
            </Text>
            <Text style={[styles.detail, { color: theme.colors.text }]}>
              {alert.percentage.toFixed(1)}%
            </Text>
          </View>
        </View>

        {onDismiss && (
          <Pressable onPress={onDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissText}>×</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${Math.min(alert.percentage, 100)}%`,
              backgroundColor: getBudgetStatusColor(
                alert.exceeded ? 'exceeded' : alert.percentage >= 90 ? 'danger' : 'warning'
              ),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    gap: 12,
  },
  detail: {
    fontSize: 12,
    opacity: 0.7,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  dismissText: {
    fontSize: 20,
    color: '#6B7280',
    fontWeight: '600',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
  },
  progressBar: {
    height: '100%',
  },
});
