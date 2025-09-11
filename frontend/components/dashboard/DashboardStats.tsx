import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Briefcase, TrendingUp, Search, User, Star, Sparkles, Target, Zap, Globe } from 'lucide-react-native';
import { router } from 'expo-router';

export function DashboardStats() {
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
    "You've got what it takes! 🎯",
  ];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <>
      {isNewUser && (
        <View style={styles.motivationalContainer}>
          <View style={styles.motivationalCard}>
            {/* Floating Decorative Icons */}
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
                  <User size={16} color="#1E293B" /> 
                  <Text style={styles.secondaryButtonText}>Complete Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Freelancing Opportunities Section */}
      <View style={styles.freelanceContainer}>
        <View style={styles.freelanceCard}>
          <View style={styles.freelanceHeader}>
            <Text style={styles.freelanceTitle}>Freelancing Opportunities</Text>
          </View>
          <Text style={styles.freelanceSubtitle}>
            Showcase your skills and earn from global clients. Work on projects, grow your portfolio, and build your independent career.
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: '#1E293B' }]} // dark gray button
              onPress={() => router.push('/(tabs)/jobs')}
            >
              <Globe size={16} color="white" />
              <Text style={styles.primaryButtonText}>Explore</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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

  motivationalTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#1E293B', // soft black
    marginBottom: 12, 
    textAlign: 'center' 
  },
  motivationalQuote: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#334155', // medium gray-black
    marginBottom: 16, 
    textAlign: 'center', 
    fontStyle: 'italic' 
  },
  motivationalSubtitle: { 
    fontSize: 14, 
    color: '#475569', // lighter black-gray
    lineHeight: 20, 
    textAlign: 'center', 
    marginBottom: 24 
  },

  actionButtons: { flexDirection: 'row', gap: 12 },

  primaryButton: {
    flex: 1,
    backgroundColor: '#1E293B', // dark gray instead of pure black
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: { 
    color: 'white', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155', // medium gray border
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: { 
    color: '#1E293B', // softer black
    fontSize: 14, 
    fontWeight: '600' 
  },

  freelanceContainer: { paddingHorizontal: 20, paddingTop: 24 },
  freelanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  freelanceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  freelanceTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#0F172A' // very dark slate
  },
  freelanceSubtitle: { 
    fontSize: 14, 
    color: '#475569', // lighter gray-black
    lineHeight: 20, 
    marginBottom: 20 
  },
});
