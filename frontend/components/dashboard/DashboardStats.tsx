import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import {
  Briefcase,
  TrendingUp,
  Search,
  User,
  Star,
  Sparkles,
  Target,
  Zap,
  Globe,
} from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '../../constants/Colors';

export function DashboardStats() {
  const colorScheme = useColorScheme() ?? 'light';

  const userStatusItems = [
    {
      id: 'applications',
      title: 'Applications',
      count: '0',
      icon: <Briefcase size={16} color={Colors[colorScheme].darkText} />,
      onPress: () => router.push('/(tabs)/jobs'),
    },
    {
      id: 'alerts',
      title: 'Alerts',
      count: '0',
      icon: <TrendingUp size={16} color={Colors[colorScheme].darkText} />,
      onPress: () => router.push('/(tabs)/news'),
    },
    {
      id: 'saved',
      title: 'Saved',
      count: '0',
      icon: <Search size={16} color={Colors[colorScheme].darkText} />,
      onPress: () => router.push('/(tabs)/jobs'),
    },
    {
      id: 'views',
      title: 'Views',
      count: '0',
      icon: <User size={16} color={Colors[colorScheme].darkText} />,
      onPress: () => router.push('/home/profile'),
    },
  ];

  const isNewUser = userStatusItems.every((item) => item.count === '0');

  const motivationalQuotes = [
    'Your dream job is waiting for you! 🚀',
    'Every application brings you closer to success! 💼',
    'Your skills are your superpower! ⚡',
    "Today's effort is tomorrow's achievement! 🌟",
    "You've got what it takes! 🎯",
  ];
  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <>
      {isNewUser && (
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View
            style={{
              backgroundColor: Colors[colorScheme].background,
              borderRadius: 16,
              padding: 24,
              position: 'relative',
              shadowColor: Colors[colorScheme].borderColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 4,
              borderWidth: 1,
              borderColor: Colors[colorScheme].borderColor,
            }}
          >
            {/* Floating Decorative Icons */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 30,
                  backgroundColor: Colors[colorScheme].background,
                  borderRadius: 20,
                  padding: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Star size={16} color={Colors[colorScheme].text} />
              </View>
              <View
                style={{
                  position: 'absolute',
                  top: 60,
                  left: 20,
                  backgroundColor: Colors[colorScheme].background,
                  borderRadius: 20,
                  padding: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Sparkles size={14} color={Colors[colorScheme].text} />
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 40,
                  right: 20,
                  backgroundColor: Colors[colorScheme].background,
                  borderRadius: 20,
                  padding: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Target size={16} color={Colors[colorScheme].text} />
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 80,
                  left: 40,
                  backgroundColor: Colors[colorScheme].background,
                  borderRadius: 20,
                  padding: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Zap size={14} color={Colors[colorScheme].text} />
              </View>
            </View>

            {/* Motivational Content */}
            <View style={{ zIndex: 2, position: 'relative' }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: Colors[colorScheme].text,
                  marginBottom: 12,
                  textAlign: 'center',
                }}
              >
                Welcome to Your Career Journey! 🎉
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: Colors[colorScheme].text,
                  marginBottom: 16,
                  textAlign: 'center',
                  fontStyle: 'italic',
                }}
              >
                {randomQuote}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors[colorScheme].text,
                  lineHeight: 20,
                  textAlign: 'center',
                  marginBottom: 24,
                }}
              >
                Start by exploring jobs, building your profile, and connecting
                with opportunities that match your skills.
              </Text>

              {/* Action Buttons - Inline Style */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: Colors[colorScheme].text,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                  onPress={() => router.push('/(tabs)/jobs')}
                >
                  <Briefcase size={16} color={Colors[colorScheme].darkText} />
                  <Text
                    style={{
                      color: Colors[colorScheme].darkText,
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    Explore Jobs
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: Colors[colorScheme].background,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: Colors[colorScheme].borderColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                  onPress={() => router.push('/home/profile')}
                >
                  <User size={16} color={Colors[colorScheme].text} />
                  <Text
                    style={{
                      color: Colors[colorScheme].text,
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    Complete Profile
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Freelancing Opportunities Section */}
      <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
        <View
          style={{
            backgroundColor: Colors[colorScheme].background,
            borderRadius: 16,
            padding: 24,
            shadowColor: Colors[colorScheme].borderColor,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 3,
            borderWidth: 1,
            borderColor: Colors[colorScheme].borderColor,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                color: Colors[colorScheme].text,
              }}
            >
              Freelancing Opportunities
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: Colors[colorScheme].text,
              lineHeight: 20,
              marginBottom: 20,
            }}
          >
            Showcase your skills and earn from global clients. Work on projects,
            grow your portfolio, and build your independent career.
          </Text>

          {/* Action Button - Inline Style */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: Colors[colorScheme].text,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onPress={() => router.push('/(tabs)/jobs')}
            >
              <Globe size={16} color={Colors[colorScheme].darkText} />
              <Text
                style={{
                  color: Colors[colorScheme].darkText,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                Explore
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
