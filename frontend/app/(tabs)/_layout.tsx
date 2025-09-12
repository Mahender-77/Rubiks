import { Redirect, Tabs, useRouter } from 'expo-router';
import {
  Home,
  FileText,
  Briefcase,
  TrendingUp,
  BarChart3,
} from 'lucide-react-native';

import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GlobalHeader } from '../../components/GlobalHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';

  if (isLoading) {
    return null; // Let parent handle loading
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  const userRole = user.role?.toLowerCase().trim();
  if (userRole === 'admin') {
    return <Redirect href="/(admin)" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
      {/* Global Header with profile click navigation */}
      <GlobalHeader />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor:
            colorScheme === 'light' ? '#000000' : '#FFFFFF',
          tabBarInactiveTintColor:
            colorScheme === 'light' ? '#adb6c4ff' : '#888888',
          tabBarStyle: {
            backgroundColor: Colors[colorScheme].darkText,
            // borderTopWidth: 1,
            borderTopColor: Colors[colorScheme].borderColor,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'Jobs',
            tabBarIcon: ({ color, size }) => (
              <Briefcase size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="resume"
          options={{
            title: 'Resume',
            tabBarIcon: ({ color, size }) => (
              <FileText size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            title: 'News',
            tabBarIcon: ({ color, size }) => (
              <TrendingUp size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="timing"
          options={{
            title: 'Timing',
            tabBarIcon: ({ color, size }) => (
              <BarChart3 size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
