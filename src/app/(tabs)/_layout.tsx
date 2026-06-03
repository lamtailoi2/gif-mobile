import { getNextOnboardingStep } from "@/lib/profile";
import { useAuth, useUser } from "@clerk/expo";
import { Redirect, Tabs, usePathname } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

const SESSION_ROUTES = ["active-session", "session-complete"];

export default function TabLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const isSessionScreen = SESSION_ROUTES.some((route) =>
    pathname.includes(route)
  );

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const onboardingStep = getNextOnboardingStep(user);
  if (onboardingStep === "profile") {
    return <Redirect href="/(onboarding)/setup-profile" />;
  }
  if (onboardingStep === "goal") {
    return <Redirect href="/(onboarding)/setup-goal" />;
  }

  const tabBarStyle = isSessionScreen
    ? { display: "none" as const }
    : {
        position: "absolute" as const,
        left: 16,
        right: 16,
        bottom: 20,
        height: 78,
        borderRadius: 24,
        backgroundColor: "rgba(61, 61, 61, 0.92)",
        borderWidth: 1,
        borderColor: "rgba(61, 61, 61, 0.92)",
        shadowColor: "#171717",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 12,
        paddingTop: 8,
      };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: "#B6FF00",
        tabBarInactiveTintColor: "#b4b4b4",
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: "600",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="workout"
        options={{
          title: "Workout",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="fitness-center" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="query-stats" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="coach"
        options={{
          title: "Coach",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="psychology" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
