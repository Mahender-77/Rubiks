import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

export function HiringTrends() {
  const trends = [
    { industry: 'Technology', trend: 'up', percentage: '+15%', color: '#10B981' },
    { industry: 'Healthcare', trend: 'up', percentage: '+8%', color: '#10B981' },
    { industry: 'Finance', trend: 'down', percentage: '-3%', color: '#EF4444' },
    { industry: 'Retail', trend: 'stable', percentage: '0%', color: '#6B7280' },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Current Hiring Trends</Text>
      <Text style={styles.subtitle}>Industry-wise hiring activity this month</Text>
      
      <View style={styles.trendsContainer}>
        {trends.map((trend, index) => {
          const TrendIcon = getTrendIcon(trend.trend);
          return (
            <View key={index} style={styles.trendCard}>
              <View style={styles.trendInfo}>
                <Text style={styles.industryName}>{trend.industry}</Text>
                <View style={styles.trendIndicator}>
                  <TrendIcon size={16} color={trend.color} />
                  <Text style={[styles.percentage, { color: trend.color }]}>
                    {trend.percentage}
                  </Text>
                </View>
              </View>
              <View style={[styles.trendBar, { backgroundColor: `${trend.color}20` }]}>
                <View 
                  style={[
                    styles.trendBarFill, 
                    { 
                      backgroundColor: trend.color,
                      width: trend.trend === 'up' ? '75%' : trend.trend === 'down' ? '30%' : '50%'
                    }
                  ]} 
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  trendsContainer: {
    gap: 16,
  },
  trendCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  trendInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  industryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  trendBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  trendBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});