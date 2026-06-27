import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useUser } from '@clerk/expo';
import { useNotifications, useMarkAllNotificationsAsRead } from '../hooks/use-notifications';
import { NotificationItem } from './notification-item';

export function NotificationList() {
  const { user } = useUser();
  const userId = user?.id || '';

  const { data: notifications = [], isLoading, refetch } = useNotifications(userId);
  const { mutate: markAllRead } = useMarkAllNotificationsAsRead();

  const handleMarkAllRead = () => {
    if (userId) {
      markAllRead(userId);
    }
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center py-10 bg-[#131313]">
        <ActivityIndicator size="large" color="#abd600" />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-20 px-6 bg-[#131313]">
        <Text className="text-4xl mb-4">🔔</Text>
        <Text className="text-white text-lg font-bold mb-1 text-center">
          Chưa có thông báo nào
        </Text>
        <Text className="text-gray-400 text-sm text-center font-medium">
          Mọi cập nhật, nhắc nhở hay kế hoạch AI của bạn sẽ xuất hiện ở đây.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#131313]">
      {hasUnread && (
        <View className="flex-row justify-end px-4 py-3 border-b border-white/5 bg-[#181818]">
          <Pressable onPress={handleMarkAllRead} className="active:opacity-60" accessibilityLabel="Mark all read">
            <Text className="text-xs font-bold text-[#abd600]">
              Đánh dấu tất cả đã đọc
            </Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshing={isLoading}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
