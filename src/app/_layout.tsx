import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { OfflineBanner } from "@/components/offline-banner";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useSyncOfflineQueue } from "@/hooks/use-sync-offline-queue";
import { tokenCache } from "@/lib/clerk";
import { CLERK_PUBLISHABLE_KEY } from "@/lib/env";
import { ClerkProvider } from "@clerk/expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View, useColorScheme } from "react-native";
import { Stack } from "expo-router";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { useFonts } from "expo-font";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";

// Disable Reanimated strict mode warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Create QueryClient instance with long gcTime for offline resilience
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // keep stale data in memory for 24h
      staleTime: 1000 * 60 * 5,    // 5 min before refetch
    },
  },
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  useSyncOfflineQueue();
  return (
    <View className="flex-1">
      <OfflineBanner />
      {children}
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    ...MaterialIcons.font,
    ...MaterialCommunityIcons.font,
    ...Ionicons.font,
    ...FontAwesome.font,
  });

  if (error) {
    console.warn("Failed to load vector icons:", error);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <ClerkProvider
          publishableKey={CLERK_PUBLISHABLE_KEY}
          tokenCache={tokenCache}
        >
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <AnimatedSplashOverlay />
            <LayoutContent>
              {loaded || error ? (
                <Stack screenOptions={{ headerShown: false }} />
              ) : null}
            </LayoutContent>
          </ThemeProvider>
        </ClerkProvider>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
