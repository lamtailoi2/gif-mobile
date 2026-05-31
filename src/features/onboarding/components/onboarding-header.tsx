import { Text, View } from 'react-native';

interface Props {
  stepLabel: string; // vd "Step 1 of 2"
  title: string;
  subtitle: string;
  accent?: 'neon' | 'blue';
}

export function OnboardingHeader({ stepLabel, title, subtitle, accent = 'blue' }: Props) {
  const accentClass = accent === 'neon' ? 'text-neon-green' : 'text-electric-blue';
  return (
    <View className="mb-6">
      <Text className={`font-body text-xs font-semibold ${accentClass} tracking-[1px] uppercase mb-1.5`}>
        {stepLabel}
      </Text>
      <Text className="font-display text-[28px] font-extrabold text-on-surface tracking-[-0.56px]">
        {title}
      </Text>
      <Text className="font-body text-sm text-on-surface-variant mt-1">{subtitle}</Text>
    </View>
  );
}
