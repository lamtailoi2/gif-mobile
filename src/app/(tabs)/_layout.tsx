import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@clerk/expo';
import { Redirect, Tabs } from 'expo-router';
import { HomeIcon } from "lucide-react-native";
import { ActivityIndicator, View } from 'react-native';

export default function TabLayout() {
  const { isLoaded, isSignedIn } = useAuth();

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

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
          tabBarLabel: ({ focused }) => (
            <ThemedText type="small" themeColor={focused ? 'text' : 'textSecondary'}>
              Home
            </ThemedText>
          ),
        }}
      />
    </Tabs>
  );
}
