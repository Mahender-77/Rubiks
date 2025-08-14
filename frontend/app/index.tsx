import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const handleNavigation = async () => {
      if (!isLoading) {
        try {
          if (user) {
            // User is logged in, redirect to main app
            router.replace('/(tabs)');
          } else {
            // User is not logged in, redirect to   login
            router.replace('/auth/login');
          }
        } catch (error) {
          console.error('Navigation error:', error);
          // Fallback to login if navigation fails
          router.replace('/auth/login');
        }
      }
    };

    handleNavigation();
  }, [user, isLoading, router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Rubiks</Text>
          <Text style={styles.subtitle}>Your Job Search Companion</Text>
          <ActivityIndicator size="large" color="white" style={styles.loader} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
});
