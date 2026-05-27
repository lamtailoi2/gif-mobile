import { GIFSplashScreen } from '@/components/gif-splash-screen';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { tokenCache } from '@/lib/clerk';
import { CLERK_PUBLISHABLE_KEY } from '@/lib/env';
import { ClerkProvider } from '@clerk/expo';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <ThemeProvider value={DarkTheme}>
          <GIFSplashScreen />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </ClerkProvider>
    </GluestackUIProvider>
  );
}

