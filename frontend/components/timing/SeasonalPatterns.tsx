import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SeasonalPatterns() {
  const seasons = [
    {
      period: 'January - March',
      activity: 'High',
      description: 'New year budget allocations drive heavy hiring',
      intensity: 85,
      color: '#10B981',
    },
    {
      period: 'April - June',
      activity: 'Medium',
      description: 'Steady hiring with mid-year planning cycles',
      intensity: 65,
      color: '#F97316',
    },
    {
      period: 'July - August',
      activity: 'Low',
      description: 'Summer slowdown due to vacations',
      intensity: 30,
      color: '#EF4444',
    },
    {
      period: 'September - December',
      activity: 'High',
      description: 'Back-to-school hiring and year-end pushes',
      intensity: 90,
      color: '#10B981',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seasonal Hiring Patterns</Text>
      <Text style={styles.subtitle}>
        Understanding when companies hire most actively
      </Text>
      
      <View style={styles.patternsContainer}>
        {seasons.map((season, index) => (
          <View key={index} style={styles.seasonCard}>
            <View style={styles.seasonHeader}>
              <Text style={styles.periodText}>{season.period}</Text>
              <View style={[styles.activityBadge, { backgroundColor: `${season.color}15` }]}>
                <Text style={[styles.activityText, { color: season.color }]}>
                  {season.activity}
                </Text>
              </View>
            </View>
            
            <Text style={styles.description}>{season.description}</Text>
            
            <View style={styles.intensityContainer}>
              <Text style={styles.intensityLabel}>Hiring Intensity</Text>
              <View style={styles.intensityBar}>
                <View 
                  style={[
                    styles.intensityFill, 
                    { 
                      width: `${season.intensity}%`,
                      backgroundColor: season.color
                    }
                  ]} 
                />
              </View>
              <Text style={styles.intensityPercentage}>{season.intensity}%</Text>
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
  patternsContainer: {
    gap: 16,
  },
  seasonCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  seasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  activityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  intensityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  intensityLabel: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    minWidth: 80,
  },
  intensityBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  intensityFill: {
    height: '100%',
    borderRadius: 3,
  },
  intensityPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    minWidth: 35,
    textAlign: 'right',
  },
});