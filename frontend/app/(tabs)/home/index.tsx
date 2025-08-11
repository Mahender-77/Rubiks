import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import { User, Briefcase, TrendingUp, Search, Star, Sparkles, Target, Zap } from 'lucide-react-native';
import { useAuth } from '../../../contexts/AuthContext';
import {ProfileStrength} from '../../../components/dashboard/ProfileStrength'
import { DashboardStats } from '../../../components/dashboard/DashboardStats';
import { JobSuggestions } from '../../../components/dashboard/JobSuggestions';
import { RecentApplications } from '../../../components/dashboard/RecentApplications';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const userStatusItems = [
    {
      id: 'applications',
      title: 'Applications',
      count: '0',
      icon: <Briefcase size={16} color="#0EA5E9" />,
      onPress: () => router.push('/(tabs)/jobs'),
    },
    {
      id: 'alerts',
      title: 'Alerts',
      count: '0',
      icon: <TrendingUp size={16} color="#10B981" />,
      onPress: () => router.push('/(tabs)/news'),
    },
    {
      id: 'saved',
      title: 'Saved',
      count: '0',
      icon: <Search size={16} color="#F59E0B" />,
      onPress: () => router.push('/(tabs)/jobs'),
    },
    {
      id: 'views',
      title: 'Views',
      count: '0',
      icon: <User size={16} color="#8B5CF6" />,
      onPress: () => router.push('/home/profile'),
    },
  ];

  const isNewUser = userStatusItems.every(item => item.count === '0');

  const motivationalQuotes = [
    "Your dream job is waiting for you! 🚀",
    "Every application brings you closer to success! 💼",
    "Your skills are your superpower! ⚡",
    "Today's effort is tomorrow's achievement! 🌟",
    "You've got what it takes! 🎯"
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>My Status</Text>
          <View style={styles.statusCard}>
            {userStatusItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.statusItem}
                onPress={item.onPress}
              >
                <View style={styles.statusIcon}>
                  {item.icon}
                </View>
                <Text style={styles.statusCount}>{item.count}</Text>
                <Text style={styles.statusLabel}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Motivational Section for New Users */}
        {isNewUser && (
          <View style={styles.motivationalContainer}>
            <View style={styles.motivationalCard}>
              {/* Floating Objects */}
              <View style={styles.floatingObjects}>
                <View style={[styles.floatingObject, styles.floatingStar]}>
                  <Star size={16} color="#FBBF24" />
                </View>
                <View style={[styles.floatingObject, styles.floatingSparkle]}>
                  <Sparkles size={14} color="#8B5CF6" />
                </View>
                <View style={[styles.floatingObject, styles.floatingTarget]}>
                  <Target size={16} color="#EF4444" />
                </View>
                <View style={[styles.floatingObject, styles.floatingZap]}>
                  <Zap size={14} color="#10B981" />
                </View>
              </View>
              
              {/* Motivational Content */}
              <View style={styles.motivationalContent}>
                <Text style={styles.motivationalTitle}>Welcome to Your Career Journey! 🎉</Text>
                <Text style={styles.motivationalQuote}>{randomQuote}</Text>
                <Text style={styles.motivationalSubtitle}>
                  Start by exploring jobs, building your profile, and connecting with opportunities that match your skills.
                </Text>
                
                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.primaryButton}
                    onPress={() => router.push('/(tabs)/jobs')}
                  >
                    <Briefcase size={16} color="white" />
                    <Text style={styles.primaryButtonText}>Explore Jobs</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={() => router.push('/home/profile')}
                  >
                    <User size={16} color="#0EA5E9" />
                    <Text style={styles.secondaryButtonText}>Complete Profile</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Profile Completion */}
        <ProfileStrength />

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Job Recommendations */}
        <JobSuggestions />

        {/* Recent Applications */}
        <RecentApplications />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollView: { flex: 1 },
  statusContainer: { paddingHorizontal: 20, paddingTop: 20 },
  statusTitle: { fontSize: 18, fontWeight: '600', color: '#0F172A', marginBottom: 16 },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  statusItem: { alignItems: 'center', flex: 1 },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusCount: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  statusLabel: { fontSize: 11, color: '#64748B', textAlign: 'center', fontWeight: '500' },
  motivationalContainer: { paddingHorizontal: 20, paddingTop: 20 },
  motivationalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  floatingObjects: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 },
  floatingObject: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  floatingStar: { top: 20, right: 30 },
  floatingSparkle: { top: 60, left: 20 },
  floatingTarget: { bottom: 40, right: 20 },
  floatingZap: { bottom: 80, left: 40 },
  motivationalContent: { zIndex: 2, position: 'relative' },
  motivationalTitle: { fontSize: 22, fontWeight: '700', color: '#0F172A', marginBottom: 12, textAlign: 'center' },
  motivationalQuote: { fontSize: 16, fontWeight: '600', color: '#0EA5E9', marginBottom: 16, textAlign: 'center', fontStyle: 'italic' },
  motivationalSubtitle: { fontSize: 14, color: '#64748B', lineHeight: 20, textAlign: 'center', marginBottom: 24 },
  actionButtons: { flexDirection: 'row', gap: 12 },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0EA5E9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0F2FE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: { color: '#0EA5E9', fontSize: 14, fontWeight: '600' },
});
