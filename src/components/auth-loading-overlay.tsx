import { Image } from 'expo-image';
import { useEffect } from 'react';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function AuthLoadingOverlay() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [scale]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View   
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(300)}
      className="absolute inset-0 bg-background z-[2000] items-center justify-center"
    >
      <Animated.View style={logoStyle}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ width: 120, height: 120 }}
          contentFit="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}
