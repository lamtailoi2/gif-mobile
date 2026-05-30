import { CircleIcon } from '@/components/ui/icon';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { EExperienceLevel } from '@/constants/profile.constant';
import { LEVEL_OPTIONS } from '@/lib/profile';
import { Text, View } from 'react-native';

interface Props {
  value?: EExperienceLevel;
  onChange: (level: EExperienceLevel) => void;
}

export function LevelSelector({ value, onChange }: Props) {
  return (
    <>
      <Text className="font-display text-base font-bold text-on-surface mb-3">
        Experience level
      </Text>
      <RadioGroup
        value={value ?? ''}
        onChange={(v: string) => onChange(v as EExperienceLevel)}
        className="gap-2.5 mb-7"
      >
        {LEVEL_OPTIONS.map((opt) => (
          <Radio
            key={opt.value}
            value={opt.value}
            className="flex-row items-center rounded-xl p-4 border border-white/[0.07] bg-[rgba(32,31,31,0.6)] data-[checked=true]:border-electric-blue data-[checked=true]:bg-electric-blue/10"
          >
            <RadioIndicator className="data-[checked=true]:border-electric-blue">
              <RadioIcon as={CircleIcon} className="fill-electric-blue text-electric-blue" />
            </RadioIndicator>
            <View className="flex-1 ml-3">
              <RadioLabel className="font-body text-base font-semibold">{opt.label}</RadioLabel>
              <Text className="font-body text-xs text-on-surface-variant">{opt.desc}</Text>
            </View>
          </Radio>
        ))}
      </RadioGroup>
    </>
  );
}
