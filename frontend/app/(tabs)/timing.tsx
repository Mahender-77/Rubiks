import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HiringTrends } from '../../components/timing/HiringTrends';
import { OptimalTiming } from '../../components/timing/OptimalTiming';
import { IndustryInsights } from '../../components/timing/IndustryInsights';
import { SeasonalPatterns } from '../../components/timing/SeasonalPatterns';

export default function TimingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Economic Timing</Text>
        <Text style={styles.subtitle}>
          Optimize your job search timing
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <HiringTrends />
        <OptimalTiming />
        <IndustryInsights />
        <SeasonalPatterns />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
});