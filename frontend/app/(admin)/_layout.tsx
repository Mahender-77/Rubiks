import { Tabs, useRouter } from 'expo-router';
import { Chrome as Home, FileText, Briefcase, TrendingUp, BarChart3 } from 'lucide-react-native';

import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GlobalHeader } from '../../components/GlobalHeader';

export default function AdminLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Global Header with profile click navigation */}
      <GlobalHeader />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#0EA5E9',
          tabBarInactiveTintColor: '#64748B',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E0F2FE',
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="adminDashboard"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="mangeUsers"
          options={{
            title: 'Jobs',
            tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
          }}
        />
   
      </Tabs>
    </View>
  );
}
