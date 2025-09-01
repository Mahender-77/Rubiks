import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { ActivityIndicator, View, Text } from "react-native";
import { useEffect } from "react";

export default function Index() {
  const { user, token, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("🔍 Index page - Current auth state:", {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      userRole: user?.role,
      userEmail: user?.email,
      userId: user?.id
    });
  }, [isLoading, isAuthenticated, user, token]);

  // Show loading spinner while authentication is being initialized
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#ffffff"
      }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ 
          marginTop: 16, 
          fontSize: 16, 
          color: "#666666",
          fontWeight: "500"
        }}>
          Loading...
        </Text>
      </View>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user || !token) {
    return <Redirect href="/(auth)/login" />;
  }

  // Get user role and normalize it
  const userRole = user.role?.toString().toLowerCase().trim();
  // Route based on user role
  if (userRole === "admin") {
    return <Redirect href="/(admin)" />;
  } else {
    return <Redirect href="/(tabs)/home" />;
  }
}