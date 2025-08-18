import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { User, Bell } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';

interface GlobalHeaderProps {
  title?: string;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ title }) => {
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [role, setRole] = React.useState(user?.role || 'user');

  const handlePress = () => {
    if (isLoading) return; // Prevent navigation if loading
    if (user?.role === 'admin') {
      return;
    }
    return handleProfilePress;
  };

  const handleProfilePress = () => {
    router.push('/home/profile');
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.leftSection}>
        <Text style={styles.appName}>Rubiks</Text>
      </View>

      {title && (
        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={role === 'admin' ? undefined : handleProfilePress}
        >
          <View style={styles.profileContainer}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            {user?.profile?.avatar ? (
              <Image
                source={{ uri: user.profile.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={16} color="#60A5FA" />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2FE',
  },
  leftSection: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0EA5E9',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  notificationButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    padding: 4,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
});
