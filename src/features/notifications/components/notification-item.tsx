import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { INotification, ENotificationType } from '@/interfaces/notification.interface';
import { useMarkNotificationAsRead } from '../hooks/use-notifications';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface NotificationItemProps {
  notification: INotification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const handlePress = () => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Redirect if navigation link metadata is present
    if (notification.data?.screen) {
      try {
        router.push(notification.data.screen as any);
      } catch (e) {
        console.warn('[NotificationItem] Failed to navigate to target:', e);
      }
    }
  };

  const getIconInfo = () => {
    switch (notification.type) {
      case ENotificationType.WorkoutReminder:
        return { name: 'fitness-outline' as const, color: '#abd600' };
      case ENotificationType.StreakWarning:
        return { name: 'flame-outline' as const, color: '#ffaa00' };
      case ENotificationType.AiPlanReady:
        return { name: 'sparkles-outline' as const, color: '#4b8eff' };
      case ENotificationType.SystemInfo:
      default:
        return { name: 'notifications-outline' as const, color: '#9aa0a6' };
    }
  };

  const iconInfo = getIconInfo();
  const dateObj = new Date(notification.createdAt);
  const formattedDate = isNaN(dateObj.getTime())
    ? ''
    : `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')} - ${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-row items-start p-4 border-b border-white/5 active:bg-white/5 ${
        notification.isRead ? 'bg-transparent' : 'bg-white/[0.02]'
      }`}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: `${iconInfo.color}15` }}
      >
        <Ionicons name={iconInfo.name} size={20} color={iconInfo.color} />
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between items-start mb-1">
          <Text className={`text-sm font-semibold flex-1 pr-2 ${notification.isRead ? 'text-gray-300' : 'text-white'}`}>
            {notification.title}
          </Text>
          {!notification.isRead && (
            <View className="w-2 h-2 rounded-full bg-[#abd600] mt-1.5" />
          )}
        </View>

        <Text className="text-xs text-gray-400 mb-2 font-medium" numberOfLines={2}>
          {notification.body}
        </Text>

        <Text className="text-[10px] text-gray-500 font-medium">
          {formattedDate}
        </Text>
      </View>
    </Pressable>
  );
}
