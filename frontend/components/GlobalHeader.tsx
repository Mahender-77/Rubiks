import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { User, Bell } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import Colors from '../constants/Colors';

interface GlobalHeaderProps {
  title?: string;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ title }) => {
  const insets = useSafeAreaInsets();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
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
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top,
          backgroundColor: Colors[colorScheme].background,
          borderBottomColor: Colors[colorScheme].borderColor,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <Text style={[styles.appName, { color: Colors[colorScheme].text }]}>
          Rubiks
        </Text>
      </View>

      {title && (
        <View style={styles.centerSection}>
          <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
            {title}
          </Text>
        </View>
      )}

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={role === 'admin' ? handlePress : handleProfilePress}
        >
          <View style={styles.profileContainer}>
            <Text
              style={[styles.userName, { color: Colors[colorScheme].text }]}
            >
              {user?.name || 'User'}
            </Text>
            {user?.profile?.avatar ? (
              <Image
                source={{ uri: user.profile.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  {
                    backgroundColor: Colors[colorScheme].background,
                  },
                ]}
              >
                <User size={16} color={Colors[colorScheme].background} />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.notificationButton,
            {
              backgroundColor: Colors[colorScheme].text,
            },
          ]}
        >
          <Bell size={20} color={Colors[colorScheme].darkText} />
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
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  leftSection: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
});
