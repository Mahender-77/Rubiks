import { ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

import { DashboardStats } from '../../../components/dashboard/DashboardStats';
import { JobSuggestions } from '../../../components/dashboard/JobSuggestions';
import { RecentApplications } from '../../../components/dashboard/RecentApplications';
import Colors from '../../../constants/Colors';

export default function DashboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].background,
      }}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
  scrollView: { flex: 1 },
});
