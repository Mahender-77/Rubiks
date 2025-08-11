import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp } from 'lucide-react-native';

export function TrendingTopics() {
  const trendingTopics = [
    { topic: 'AI & Machine Learning', growth: '+25%' },
    { topic: 'Remote Work', growth: '+18%' },
    { topic: 'Data Science', growth: '+22%' },
    { topic: 'Cloud Engineering', growth: '+30%' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={20} color="#F97316" />
        <Text style={styles.title}>Trending This Week</Text>
      </View>
      
      <View style={styles.topicsContainer}>
        {trendingTopics.map((item, index) => (
          <TouchableOpacity key={index} style={styles.topicCard}>
            <Text style={styles.topicName}>{item.topic}</Text>
            <View style={styles.growthContainer}>
              <Text style={styles.growthText}>{item.growth}</Text>
              <TrendingUp size={14} color="#10B981" />
            </View>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: '48%',
  },
  topicName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginRight: 4,
  },
});