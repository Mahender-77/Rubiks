import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or loader
  }

  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  // Role-based redirect
  if (user.role === "admin") {
    return <Redirect href="/(admin)" />;
  } else {
    return <Redirect href="/(tabs)/home" />;
  }
}


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
        
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="+not-found" />
          {/* <Stack.Screen name="index" options={{ headerShown: false }} /> */}
        </Stack>

        {/* Role-based routing handler */}
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
