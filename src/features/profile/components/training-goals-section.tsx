import { Button } from '@/components/ui/button';
import { EExperienceLevel, EFitnessGoal } from '@/constants/profile.constant';
import { GIFColors } from '@/constants/theme';
import { DaysSelector } from '@/features/onboarding/components/days-selector';
import { ErrorBanner } from '@/features/onboarding/components/error-banner';
import { GoalSelector } from '@/features/onboarding/components/goal-selector';
import { LevelSelector } from '@/features/onboarding/components/level-selector';
import { getUserProfile } from '@/lib/profile';
import { useUser } from '@clerk/expo';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export function TrainingGoalsSection() {
  const { user } = useUser();
  const existing = getUserProfile(user);

  const [goal, setGoal] = useState<EFitnessGoal | undefined>(existing.goal);
  const [level, setLevel] = useState<EExperienceLevel | undefined>(existing.level);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(existing.daysPerWeek ?? 3);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState('');

  const canSave = !!goal && !!level && !saving;

  const onSave = async () => {
    if (!user || !goal || !level || saving) return;
    setSaving(true);
    setApiError('');
    setSaved(false);
    try {
      await user.update({
        unsafeMetadata: {
          ...(user.unsafeMetadata as object),
          goal,
          level,
          daysPerWeek,
        },
      });
      setSaved(true);
    } catch (err: any) {
      setApiError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Could not save goals');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="bg-[rgba(32,31,31,0.6)] border border-white/[0.07] rounded-2xl p-5 mb-5">
      <Text className="font-display text-lg font-bold text-on-surface mb-4">Training Goals</Text>

      <ErrorBanner message={apiError} />

      <GoalSelector
        value={goal}
        onChange={(g) => {
          setGoal(g);
          setSaved(false);
        }}
      />
      <LevelSelector
        value={level}
        onChange={(l) => {
          setLevel(l);
          setSaved(false);
        }}
      />
      <DaysSelector
        value={daysPerWeek}
        onChange={(d) => {
          setDaysPerWeek(d);
          setSaved(false);
        }}
      />

      <View className="mt-2 flex-row items-center gap-3">
        <View className="flex-1">
          <Button onPress={onSave} disabled={!canSave}>
            {saving ? (
              <ActivityIndicator size="small" color={GIFColors.onPrimary} />
            ) : (
              'Save goals'
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
