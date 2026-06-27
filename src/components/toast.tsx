import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onDismiss: (id: string) => void;
}

export function Toast({ id, message, type, onDismiss }: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);

  useEffect(() => {
    // Slide down to top safe area + offset
    translateY.value = withSpring(insets.top + 10, { damping: 15 });

    // Auto dismiss after 4 seconds
    const timer = setTimeout(() => {
      dismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    translateY.value = withSpring(-150, { damping: 15 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)(id);
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const getTheme = () => {
    switch (type) {
      case 'success':
        return { 
          bg: 'bg-[#1c2a13]', 
          border: 'border-[#abd600]/30', 
          textColor: 'text-white', 
          iconColor: '#abd600', 
          icon: 'checkmark-circle-outline' as const 
        };
      case 'error':
        return { 
          bg: 'bg-[#2d1414]', 
          border: 'border-[#ff4d4d]/30', 
          textColor: 'text-white', 
          iconColor: '#ff4d4d', 
          icon: 'alert-circle-outline' as const 
        };
      case 'warning':
        return { 
          bg: 'bg-[#2d2414]', 
          border: 'border-[#ffaa00]/30', 
          textColor: 'text-white', 
          iconColor: '#ffaa00', 
          icon: 'warning-outline' as const 
        };
      case 'info':
      default:
        return { 
          bg: 'bg-[#141b2d]', 
          border: 'border-[#4b8eff]/30', 
          textColor: 'text-white', 
          iconColor: '#4b8eff', 
          icon: 'information-circle-outline' as const 
        };
    }
  };

  const theme = getTheme();

  return (
    <Animated.View
      style={[animatedStyle]}
      className={`absolute left-4 right-4 z-[9999] flex-row items-center p-4 rounded-xl border ${theme.bg} ${theme.border} shadow-lg`}
    >
      <View className="mr-3">
        <Ionicons name={theme.icon} size={22} color={theme.iconColor} />
      </View>
      <Text className={`flex-1 text-sm font-semibold pr-2 ${theme.textColor}`}>
        {message}
      </Text>
      <Pressable onPress={dismiss} className="p-1 active:opacity-60" accessibilityLabel="Dismiss notification">
        <Ionicons name="close" size={18} color="#9aa0a6" />
      </Pressable>
    </Animated.View>
  );
}
