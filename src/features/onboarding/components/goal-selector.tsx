import { EFitnessGoal } from '@/constants/profile.constant';
import { GIFColors } from '@/constants/theme';
import { GOAL_OPTIONS } from '@/lib/profile';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface Props {
  value?: EFitnessGoal;
  onChange: (goal: EFitnessGoal) => void;
}

export function GoalSelector({ value, onChange }: Props) {
  return (
    <>
      <Text className="font-display text-base font-bold text-on-surface mb-3">
        What&apos;s your main goal?
      </Text>
      <View className="gap-2.5 mb-7">
        {GOAL_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              className={`flex-row items-center gap-3.5 rounded-xl p-4 border ${
                selected
                  ? 'border-neon-green bg-neon-green/10'
                  : 'border-white/[0.07] bg-[rgba(32,31,31,0.6)]'
              }`}
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  selected ? 'bg-neon-green/20' : 'bg-white/[0.05]'
                }`}
              >
                <MaterialIcons
                  name={opt.icon as any}
                  size={20}
                  color={selected ? GIFColors.neonGreen : GIFColors.onSurfaceVariant}
                />
              </View>
              <View className="flex-1">
                <Text className={`font-body text-base font-semibold ${selected ? 'text-neon-green' : 'text-on-surface'}`}>
                  {opt.label}
                </Text>
                <Text className="font-body text-xs text-on-surface-variant">{opt.desc}</Text>
              </View>
              {selected && <MaterialIcons name="check-circle" size={22} color={GIFColors.neonGreen} />}
            </Pressable>
          );
        })}
      </View>
    </>
  );
}
