import { DAYS_OPTIONS } from '@/lib/profile';
import { Pressable, Text, View } from 'react-native';

interface Props {
  value: number;
  onChange: (days: number) => void;
}

export function DaysSelector({ value, onChange }: Props) {
  return (
    <>
      <Text className="font-display text-base font-bold text-on-surface mb-3">
        Days per week
      </Text>
      <View className="flex-row gap-2.5 mb-8">
        {DAYS_OPTIONS.map((d) => {
          const selected = value === d;
          return (
            <Pressable
              key={d}
              onPress={() => onChange(d)}
              className={`flex-1 aspect-square rounded-xl items-center justify-center border ${
                selected
                  ? 'border-neon-green bg-neon-green/10'
                  : 'border-white/[0.07] bg-[rgba(32,31,31,0.6)]'
              }`}
            >
              <Text className={`font-display text-xl font-bold ${selected ? 'text-neon-green' : 'text-on-surface'}`}>
                {d}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}
