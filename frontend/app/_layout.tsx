import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { ActivityIndicator, View, Text } from "react-native";
import { useEffect } from "react";

function AppStack() {
  const { isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.log("🏗️ AppStack: Current state:", {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role
    });
  }, [isLoading, isAuthenticated, user]);

  // Show loading screen while authentication is being restored/initialized
  if (isLoading) {
    console.log("⏳ AppStack: Showing loading screen");
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
          fontSize: 18, 
          color: "#333333",
          fontWeight: "600"
        }}>
          Initializing App...
        </Text>
        <Text style={{ 
          marginTop: 8, 
          fontSize: 14, 
          color: "#666666"
        }}>
          Please wait while we set things up
        </Text>
      </View>
    );
  }

  console.log("🏗️ AppStack: Rendering navigation stack");

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Main entry point - handles routing logic */}
      <Stack.Screen 
        name="index" 
        options={{
          gestureEnabled: false,
        }}
      />
      
      {/* Authentication screens */}
      <Stack.Screen 
        name="(auth)" 
        options={{ 
          presentation: 'card',
          gestureEnabled: false,
          animationTypeForReplace: 'push'
        }} 
      />
      
      {/* User tab navigation */}
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          gestureEnabled: false,
          animationTypeForReplace: 'push'
        }} 
      />
      
      {/* Admin navigation */}
      <Stack.Screen 
        name="(admin)" 
        options={{ 
          gestureEnabled: false,
          animationTypeForReplace: 'push'
        }} 
      />
      
      {/* 404 Not found page */}
      <Stack.Screen 
        name="+not-found" 
        options={{ 
          title: "Page Not Found",
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  console.log("🚀 RootLayout: Starting app initialization...");
  
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar 
          style="dark" 
          backgroundColor="#FFFFFF" 
          translucent={false} 
        />
        <AppStack />
      </AuthProvider>
    </SafeAreaProvider>
  );
}