import { Button } from '@/components/ui/button';
import { GIFColors } from '@/constants/theme';
import { DaysSelector } from '@/features/onboarding/components/days-selector';
import { ErrorBanner } from '@/features/onboarding/components/error-banner';
import { GoalSelector } from '@/features/onboarding/components/goal-selector';
import { LevelSelector } from '@/features/onboarding/components/level-selector';
import { OnboardingHeader } from '@/features/onboarding/components/onboarding-header';
import { useOnboardingDraftStore } from '@/features/onboarding/store/use-onboarding-draft-store';
import { isProfileComplete } from '@/lib/profile';
import { useUser } from '@clerk/expo';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetupGoalScreen() {
  const router = useRouter();
  const { user } = useUser();
  // nháp giữ qua lại giữa các bước
  const goal = useOnboardingDraftStore((s) => s.goal);
  const level = useOnboardingDraftStore((s) => s.level);
  const daysPerWeek = useOnboardingDraftStore((s) => s.daysPerWeek);
  const patchGoalsDraft = useOnboardingDraftStore((s) => s.patchGoalsDraft);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isProfileComplete(user)) return <Redirect href="/setup-profile" />;
  const canSubmit = !!goal && !!level && !saving;

  const onSubmit = async () => {
    if (!user || !goal || !level) return;
    setSaving(true);
    setError('');
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          goal,
          level,
          daysPerWeek,
          onboarded: true,
        },
      });
      router.replace('/');
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View
        className="absolute top-0 left-0 right-0 h-[420px]"
        style={{
          experimental_backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(171,214,0,0.1) 0%, rgba(19,19,19,1) 65%)',
        } as object}
      />

      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerClassName="grow px-container-mobile pt-8 pb-stack-lg"
          showsVerticalScrollIndicator={false}
        >
          <OnboardingHeader
            stepLabel="Step 2 of 2"
            title="What's your goal?"
            subtitle="So the coach can tailor your plan."
            accent="neon"
          />

          <ErrorBanner message={error} />

          <GoalSelector value={goal} onChange={(g) => patchGoalsDraft({ goal: g })} />
          <LevelSelector value={level} onChange={(l) => patchGoalsDraft({ level: l })} />
          <DaysSelector value={daysPerWeek} onChange={(d) => patchGoalsDraft({ daysPerWeek: d })} />

          <Button onPress={onSubmit} disabled={!canSubmit}>
            {saving ? (
              <ActivityIndicator size="small" color={GIFColors.onPrimary} />
            ) : (
              'Start Training'
            )}
          </Button>

          <Pressable
            onPress={() => router.replace('/setup-profile')}
            disabled={saving}
            className="items-center pt-4"
          >
            <Text className="font-body text-sm text-on-surface-variant">
              {'← '}
              <Text className="text-electric-blue font-semibold">Back</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
