import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../apis";

export const NOTIFICATIONS_QUERY_KEY = "notifications";

/**
 * Hook to retrieve user notifications.
 */
export const useNotifications = (userId: string) => {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds stale time
    refetchInterval: 1000 * 60, // Auto-refresh list every minute
  });
};

/**
 * Hook to mark a single notification as read.
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
};

/**
 * Hook to mark all notifications for a user as read.
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => markAllNotificationsAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });
};
