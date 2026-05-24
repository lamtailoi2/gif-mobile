import { useAuth } from '@clerk/expo';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

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
          tabBarLabel: ({ focused }) => (
            <ThemedText type="small" themeColor={focused ? 'text' : 'textSecondary'}>
              Home
            </ThemedText>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarLabel: ({ focused }) => (
            <ThemedText type="small" themeColor={focused ? 'text' : 'textSecondary'}>
              Explore
            </ThemedText>
          ),
        }}
      />
    </Tabs>
  );
}
