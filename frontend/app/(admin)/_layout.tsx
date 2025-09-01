import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { GlobalHeader } from "../../components/GlobalHeader";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

export default function AdminLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // useEffect(() => {
  //   console.log("🔑 AdminLayout: Current state:", {
  //     isLoading,
  //     isAuthenticated,
  //     hasUser: !!user,
  //     userRole: user?.role,
  //     userEmail: user?.email
  //   });
  // }, [isLoading, isAuthenticated, user]);

  // Don't redirect while still loading
  if (isLoading) {
    return null; // Let parent handle loading
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect non-admin users away from admin area
  const userRole = user.role?.toLowerCase().trim();
  if (userRole !== "admin") {
    return <Redirect href="/(tabs)/home" />;
  }
  return (
       <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
          {/* Global Header with profile click navigation */}
          <GlobalHeader />
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
        />
        <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mangeUsers"
        options={{
          title: "Users",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
    </View>
  );
}
