import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import {
  Briefcase,
  Globe,
  Newspaper,
  User,
  TrendingUp,
} from "lucide-react-native";
import { router } from "expo-router";
import Colors from "../../constants/Colors";

export function DashboardStats() {
  const colorScheme = useColorScheme() ?? "light";

  const features = [
    {
      id: "jobs",
      title: "Explore Jobs",
      icon: <Briefcase size={28} color={Colors[colorScheme].primary} />,
      desc: "Find jobs matching your skills",
      onPress: () => router.push("/(tabs)/jobs"),
    },
    {
      id: "freelancing",
      title: "Freelancing",
      icon: <Globe size={28} color={Colors[colorScheme].primary} />,
      desc: "Work with global clients",
      onPress: () => router.push("/(tabs)/jobs"),
    },
    {
      id: "news",
      title: "Latest News",
      icon: <Newspaper size={28} color={Colors[colorScheme].primary} />,
      desc: "Stay updated with trends",
      onPress: () => router.push("/(tabs)/news"),
    },
    {
      id: "profile",
      title: "My Profile",
      icon: <User size={28} color={Colors[colorScheme].primary} />,
      desc: "Showcase your career journey",
      onPress: () => router.push("/home/profile"),
    },
  ];

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme].background,
      }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Greeting */}
      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          color: Colors[colorScheme].text,
          marginBottom: 6,
        }}
      >
        Welcome back 👋
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          color: Colors[colorScheme].text,
          marginBottom: 20,
        }}
      >
        Let’s find your next big opportunity today 
      </Text>

      {/* Big Card */}
      <View
        style={{
          backgroundColor: Colors[colorScheme].card,
          borderRadius: 20,
          padding: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 6,
          borderWidth: 1,
          borderColor: Colors[colorScheme].borderColor,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: Colors[colorScheme].text,
            marginBottom: 16,
          }}
        >
          Explore All Features 
        </Text>

        {/* Features Grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={{
                width: "48%",
                backgroundColor: Colors[colorScheme].background,
                paddingVertical: 20,
                paddingHorizontal: 12,
                borderRadius: 16,
                marginBottom: 16,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 2,
                borderWidth: 1,
                borderColor: Colors[colorScheme].borderColor,
              }}
              onPress={feature.onPress}
            >
              {feature.icon}
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: Colors[colorScheme].text,
                  marginTop: 10,
                  marginBottom: 4,
                  textAlign: "center",
                }}
              >
                {feature.title}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme].subText,
                  textAlign: "center",
                }}
              >
                {feature.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
