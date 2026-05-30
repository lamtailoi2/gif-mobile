import { GIFColors } from '@/constants/theme';
import { useOnboardingDraftStore } from '@/features/onboarding/store/use-onboarding-draft-store';
import { isOnboarded } from '@/lib/profile';
import { useUser } from '@clerk/expo';
import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function OnboardingLayout() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Nạp nháp đồng bộ trước khi render screen (để prefill tên Google + giữ edit khi Back).
  // hydrateFromUser có guard `hydrated` nên chỉ chạy 1 lần mỗi lần vào onboarding.
  if (isLoaded && isSignedIn && user) {
    useOnboardingDraftStore.getState().hydrateFromUser(user);
  }

  // Xoá nháp khi rời khỏi flow onboarding (hoàn tất / đăng xuất).
  useEffect(() => () => useOnboardingDraftStore.getState().reset(), []);

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={GIFColors.electricBlue} />
      </View>
    );
  }
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;
  if (isOnboarded(user)) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
