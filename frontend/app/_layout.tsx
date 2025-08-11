import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';


export default function RootLayout() {


  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
        
        <Stack screenOptions={{ headerShown: false }}>
          {/* Main tabs */}
          <Stack.Screen name="(tabs)" />

        

          {/* Auth screens */}
          <Stack.Screen name="auth" />

          {/* Not found */}
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

