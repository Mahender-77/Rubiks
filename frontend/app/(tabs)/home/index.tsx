import { ScrollView, StyleSheet, View } from 'react-native';

import { DashboardStats } from '../../../components/dashboard/DashboardStats';
import { JobSuggestions } from '../../../components/dashboard/JobSuggestions';
import { RecentApplications } from '../../../components/dashboard/RecentApplications';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Dashboard Stats */}
        <DashboardStats />
         {/* Profile Completion */}
        {/* <ProfileStrength /> */}

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
