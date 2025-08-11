import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Building, Users, DollarSign } from 'lucide-react-native';

export function IndustryInsights() {
  const insights = [
    {
      industry: 'Technology',
      icon: Building,
      activeCompanies: 1250,
      avgSalary: '$125k',
      hiringGrowth: '+22%',
      color: '#3B82F6',
    },
    {
      industry: 'Healthcare',
      icon: Users,
      activeCompanies: 890,
      avgSalary: '$95k',
      hiringGrowth: '+15%',
      color: '#10B981',
    },
    {
      industry: 'Finance',
      icon: DollarSign,
      activeCompanies: 650,
      avgSalary: '$110k',
      hiringGrowth: '+8%',
      color: '#F97316',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Industry Insights</Text>
      <Text style={styles.subtitle}>
        Current market conditions across key industries
      </Text>
      
      <View style={styles.insightsContainer}>
        {insights.map((insight, index) => (
          <View key={index} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${insight.color}15` }]}>
                <insight.icon size={20} color={insight.color} />
              </View>
              <Text style={styles.industryName}>{insight.industry}</Text>
            </View>
            
            <View style={styles.metricsContainer}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{insight.activeCompanies}</Text>
                <Text style={styles.metricLabel}>Active Companies</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>{insight.avgSalary}</Text>
                <Text style={styles.metricLabel}>Avg Salary</Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.metricValue, { color: insight.color }]}>
                  {insight.hiringGrowth}
                </Text>
                <Text style={styles.metricLabel}>Growth</Text>
              </View>
            </View>
          </View>
        ))}
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
  insightsContainer: {
    gap: 16,
  },
  insightCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  industryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});