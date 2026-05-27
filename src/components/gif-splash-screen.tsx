import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRACK_WIDTH = Math.min(SCREEN_WIDTH - 80, 320);
const DISPLAY_DURATION_MS = 3000;

export function GIFSplashScreen() {
  const [visible, setVisible] = useState(true);
  const progressPx = useSharedValue(0);
  const orbScale = useSharedValue(1);
  const orbOpacity = useSharedValue(0.3);

  useEffect(() => {
    progressPx.value = withRepeat(
      withTiming(TRACK_WIDTH, {
        duration: 2500,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
      }),
      -1,
      false,
    );

    orbScale.value = withRepeat(
      withTiming(1.15, {
        duration: 2000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      -1,
      true,
    );

    orbOpacity.value = withRepeat(
      withTiming(0.7, {
        duration: 2000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      -1,
      true,
    );

    const timer = setTimeout(() => setVisible(false), DISPLAY_DURATION_MS);
    return () => clearTimeout(timer);
  }, [progressPx, orbScale, orbOpacity]);

  const progressStyle = useAnimatedStyle(() => ({
    width: progressPx.value,
  }));

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
    opacity: orbOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      exiting={FadeOut.duration(500)}
      className="absolute inset-0 bg-surface-container-lowest z-[1000]"
    >
      {/* Central content */}
      <View className="flex-1 items-center justify-center">
        <View className="items-center">
          {/* Orb glow + Logo stacked */}
          <View className="w-48 h-48 relative items-center justify-center mb-stack-md">
            <Animated.View
              style={orbStyle}
              className="absolute w-48 h-48 bg-neon-green rounded-full"
            />
            <View className="w-36 h-36 rounded-full bg-[rgba(42,42,42,0.3)] border border-white/5 items-center justify-center overflow-hidden shadow-lg">
              <Image
                source={require('@/assets/images/icon.png')}
                style={{ width: 120, height: 120 }}
                contentFit="contain"
              />
            </View>
          </View>

          <Text
            className="font-display text-display-lg text-primary-fixed-dim tracking-tighter mb-2"
            style={{
              textShadowColor: 'rgba(171, 214, 0, 0.4)',
              textShadowRadius: 12,
              textShadowOffset: { width: 0, height: 0 },
            }}
          >
            G.I.F
          </Text>

          <Text className="font-body text-body-lg text-on-surface-variant/80 text-center max-w-xs">
            Train Smarter. Adapt Automatically.
          </Text>
        </View>
      </View>

      {/* Bottom loading bar */}
      <View className="items-center pb-stack-lg">
        <View
          className="h-1.5 bg-[rgba(42,42,42,0.3)] rounded-full overflow-hidden"
          style={{ width: TRACK_WIDTH }}
        >
          <Animated.View
            style={
              [
                progressStyle,
                {
                  experimental_backgroundImage:
                    'linear-gradient(90deg, #4b8eff, #abd600, #c3f400)',
                } as object,
              ] as object
            }
            className="h-full rounded-full"
          />
        </View>
      </View>

      {/* Bottom initialization text */}
      <View className="absolute bottom-6 w-full items-center">
        <Text className="font-mono text-label-caps text-on-surface-variant/40 tracking-[0.1em] uppercase">
          Initializing Biometric Matrix...
        </Text>
      </View>
    </Animated.View>
  );
}
