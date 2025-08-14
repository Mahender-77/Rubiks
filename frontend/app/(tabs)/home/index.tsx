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
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Dashboard Stats */}
        <DashboardStats />
         {/* Profile Completion */}
        <ProfileStrength />

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

  
});
