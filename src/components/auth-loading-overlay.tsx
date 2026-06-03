import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const TRACK_WIDTH = 256;

export function AuthLoadingOverlay() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.bezier(0.65, 0, 0.35, 1) }),
      -1,
      false,
    );
  }, [progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: TRACK_WIDTH * progress.value,
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(300)}
      className="absolute inset-0 z-[2000] items-center justify-center bg-background"
    >
      {/* Logo + brand */}
      <View className="flex-1 items-center justify-center">
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ width: 128, height: 128 }}
          contentFit="contain"
          className="mb-stack-md"
        />

        <Text
          className="font-display text-display-lg tracking-tighter text-neon-green"
          style={{
            textShadowColor: 'rgba(171, 214, 0, 0.4)',
            textShadowRadius: 12,
            textShadowOffset: { width: 0, height: 0 },
          }}
        >
          G.I.F
        </Text>
        <Text className="mt-2 max-w-xs text-center font-body text-body-lg tracking-wide text-on-surface-variant/80">
          Train Smarter. Adapt Automatically.
        </Text>
      </View>

      {/* Loader bar */}
      <View className="absolute bottom-16 w-full items-center">
        <View
          className="h-1.5 overflow-hidden rounded-full"
          style={{
            width: TRACK_WIDTH,
            backgroundColor: 'rgba(42, 42, 42, 0.3)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <Animated.View
            style={[
              fillStyle,
              {
                height: '100%',
                borderRadius: 9999,
                backgroundColor: '#abd600',
                shadowColor: '#abd600',
                shadowOpacity: 0.8,
                shadowRadius: 15,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}
