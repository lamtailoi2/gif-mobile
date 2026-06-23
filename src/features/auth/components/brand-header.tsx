import { Image } from 'expo-image';
import { View, Text } from 'react-native';

type Props = {
  borderVariant?: 'neon-green' | 'electric-blue';
};

export function BrandHeader({ borderVariant = 'neon-green' }: Props) {
  const borderClass = borderVariant === 'electric-blue' ? 'border-electric-blue/30' : 'border-neon-green/30';
  return (
    <View className="items-center mb-8">
      <View className={`w-[100px] h-[100px] rounded-full overflow-hidden mb-4 border ${borderClass}`}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ width: 100, height: 100 }}
          contentFit="cover"
        />
      </View>
      <Text className="font-display text-[36px] font-extrabold text-neon-green tracking-[-0.72px] mb-1">
        G.I.F
      </Text>
      <Text className="font-body text-sm text-on-surface-variant opacity-70">
        Train Smarter. Adapt Automatically.
      </Text>
    </View>
  );
}
