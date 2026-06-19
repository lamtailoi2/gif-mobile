import { Button } from '@/components/ui/button';
import { GIFColors } from '@/constants/theme';
import { BodyMetricsFields } from '@/features/onboarding/components/body-metrics-fields';
import { DateOfBirthFields } from '@/features/onboarding/components/date-of-birth-fields';
import { ErrorBanner } from '@/features/onboarding/components/error-banner';
import { GenderSelector } from '@/features/onboarding/components/gender-selector';
import { NameFields } from '@/features/onboarding/components/name-fields';
import { OnboardingHeader } from '@/features/onboarding/components/onboarding-header';
import { ProfileForm, profileSchema, toIsoDate } from '@/features/onboarding/libs/schema';
import { useOnboardingDraftStore } from '@/features/onboarding/store/use-onboarding-draft-store';
import { useUser } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetupProfileScreen() {
  const router = useRouter();
  const { user } = useUser(); // guard (đăng nhập / onboarded) đã xử lý ở (onboarding)/_layout
  const profileDraft = useOnboardingDraftStore((s) => s.profile);
  const setProfileDraft = useOnboardingDraftStore((s) => s.setProfileDraft);

  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileDraft, // nháp giữ qua lại giữa các bước
  });

  const onSubmit = async (data: ProfileForm) => {
    if (!user || saving) return;
    setSaving(true);
    setApiError('');
    try {
      setProfileDraft(data); // giữ nháp để quay lại không mất
      await user.update({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        unsafeMetadata: {
          ...user.unsafeMetadata,
          gender: data.gender,
          dateOfBirth: toIsoDate(data.birthDay, data.birthMonth, data.birthYear),
          weightKg: Number(data.weightKg),
          heightCm: Number(data.heightCm),
        },
      });
      router.push('/setup-goal');
    } catch (err: any) {
      setApiError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Could not save profile');
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
            'radial-gradient(circle at 50% 0%, rgba(75,142,255,0.08) 0%, rgba(19,19,19,1) 65%)',
        } as object}
      />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <ScrollView
            contentContainerClassName="grow px-container-mobile pt-8 pb-stack-lg"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <OnboardingHeader
              stepLabel="Step 1 of 2"
              title="Tell us about you"
              subtitle="We use this to personalize your plan and metrics."
              accent="blue"
            />

            <ErrorBanner message={apiError} />

            <NameFields control={control} errors={errors} disabled={saving} />
            <GenderSelector control={control} errors={errors} />
            <DateOfBirthFields control={control} errors={errors} disabled={saving} />
            <BodyMetricsFields control={control} errors={errors} disabled={saving} />

            <View className="mt-8">
              <Button onPress={handleSubmit(onSubmit)} disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color={GIFColors.onPrimary} />
                ) : (
                  'Continue'
                )}
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
