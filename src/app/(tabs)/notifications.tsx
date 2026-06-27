import React from 'react';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { NotificationList } from '@/features/notifications/components/notification-list';

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#131313' }}
      edges={['top']}
    >
      {/* Custom back-navigation header bar */}
      <View className="flex-row items-center px-4 py-4 border-b border-white/10 bg-[#131313]">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-white/10"
          accessibilityLabel="Back to previous screen"
        >
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        <Text className="text-lg font-bold text-white ml-2">
          Thông báo
        </Text>
      </View>

      <NotificationList />
    </SafeAreaView>
  );
}
