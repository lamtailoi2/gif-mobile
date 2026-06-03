import { Button } from '@/components/ui/button';
import { GIFColors } from '@/constants/theme';
import { BodyMetricsFields } from '@/features/onboarding/components/body-metrics-fields';
import { DateOfBirthFields } from '@/features/onboarding/components/date-of-birth-fields';
import { ErrorBanner } from '@/features/onboarding/components/error-banner';
import { GenderSelector } from '@/features/onboarding/components/gender-selector';
import { NameFields } from '@/features/onboarding/components/name-fields';
import { ProfileForm, fromIsoDate, profileSchema, toIsoDate } from '@/features/onboarding/libs/schema';
import { getUserProfile } from '@/lib/profile';
import { useUser } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Text, View } from 'react-native';

export function PersonalInfoSection() {
  const { user } = useUser();
  const existing = getUserProfile(user);
  const dob = fromIsoDate(existing.dateOfBirth);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      gender: existing.gender,
      birthDay: dob.day,
      birthMonth: dob.month,
      birthYear: dob.year,
      weightKg: existing.weightKg ? String(existing.weightKg) : '',
      heightCm: existing.heightCm ? String(existing.heightCm) : '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    if (!user || saving) return;
    setSaving(true);
    setApiError('');
    setSaved(false);
    try {
      await user.update({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        unsafeMetadata: {
          ...(user.unsafeMetadata as object),
          gender: data.gender,
          dateOfBirth: toIsoDate(data.birthDay, data.birthMonth, data.birthYear),
          weightKg: Number(data.weightKg),
          heightCm: Number(data.heightCm),
        },
      });
      setSaved(true);
    } catch (err: any) {
      setApiError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="bg-[rgba(32,31,31,0.6)] border border-white/[0.07] rounded-2xl p-5 mb-5">
      <Text className="font-display text-lg font-bold text-on-surface mb-4">Personal Info</Text>

      <ErrorBanner message={apiError} />

      <NameFields control={control} errors={errors} disabled={saving} />
      <GenderSelector control={control} errors={errors} />
      <DateOfBirthFields control={control} errors={errors} disabled={saving} />
      <BodyMetricsFields control={control} errors={errors} disabled={saving} />

      <View className="mt-6 flex-row items-center gap-3">
        <View className="flex-1">
          <Button onPress={handleSubmit(onSubmit)} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color={GIFColors.onPrimary} />
            ) : (
              'Save changes'
            )}
          </Button>
        </View>
        {saved && !saving && (
          <Text className="font-body text-sm text-neon-green font-semibold">Saved ✓</Text>
        )}
      </View>
    </View>
  );
}
