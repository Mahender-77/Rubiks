import { Redirect, Tabs, useRouter } from 'expo-router';
import { Chrome as Home, FileText, Briefcase, TrendingUp, BarChart3 } from 'lucide-react-native';

import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GlobalHeader } from '../../components/GlobalHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

export default function TabLayout() {
  const router = useRouter();
   const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    console.log("👥 TabsLayout: Current state:", {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role
    });
  }, [isLoading, isAuthenticated, user]);

  // Don't redirect while still loading
  if (isLoading) {
    console.log("⏳ TabsLayout: Still loading, not redirecting yet");
    return null; // Let parent handle loading
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    console.log("🔒 TabsLayout: Not authenticated, redirecting to login");
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect admin users away from user tabs
  const userRole = user.role?.toLowerCase().trim();
  if (userRole === "admin") {
    console.log("🔑 TabsLayout: Admin user detected, redirecting to admin panel");
    return <Redirect href="/(admin)" />;
  }

  console.log("👥 TabsLayout: Showing user tabs for regular user");


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
            tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="resume"
          options={{
            title: 'Resume',
            tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            title: 'News',
            tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="timing"
          options={{
            title: 'Timing',
            tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
