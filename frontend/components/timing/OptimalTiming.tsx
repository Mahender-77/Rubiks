import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, Clock, Target } from 'lucide-react-native';

export function OptimalTiming() {
  const recommendations = [
    {
      icon: Calendar,
      title: 'Best Application Days',
      description: 'Tuesday - Thursday for highest response rates',
      color: '#3B82F6',
    },
    {
      icon: Clock,
      title: 'Optimal Time',
      description: '10 AM - 2 PM when recruiters are most active',
      color: '#8B5CF6',
    },
    {
      icon: Target,
      title: 'Peak Season',
      description: 'January & September for new hiring cycles',
      color: '#10B981',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Optimal Application Timing</Text>
      <Text style={styles.subtitle}>
        Data-driven insights to maximize your application success
      </Text>
      
      <View style={styles.recommendationsContainer}>
        {recommendations.map((rec, index) => (
          <View key={index} style={styles.recommendationCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${rec.color}15` }]}>
              <rec.icon size={24} color={rec.color} />
            </View>
            <View style={styles.recommendationInfo}>
              <Text style={styles.recommendationTitle}>{rec.title}</Text>
              <Text style={styles.recommendationDescription}>{rec.description}</Text>
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
  recommendationsContainer: {
    gap: 16,
  },
  recommendationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});