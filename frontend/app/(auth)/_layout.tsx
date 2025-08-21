import { Stack } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { Redirect } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    console.log("🔐 AuthLayout: Current state:", {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role
    });
  }, [isLoading, isAuthenticated, user]);

  // Don't redirect while still loading
  if (isLoading) {
    console.log("⏳ AuthLayout: Still loading, not redirecting yet");
    return null; // Let parent handle loading
  }

  // Don't show auth screens if user is already authenticated
  if (isAuthenticated && user) {
    console.log("🔄 AuthLayout: User already authenticated, redirecting to main app");
    return <Redirect href="/" />;
  }

  console.log("🔐 AuthLayout: Showing auth screens");

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}