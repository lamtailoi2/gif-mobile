import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';
import { useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { registerForPushNotifications, scheduleDailyReminder, scheduleStreakWarningNotification, scheduleMorningMotivation, sendWelcomeBackNotification } from '@/lib/notifications';
import { useToast } from './toast-context';
import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { NOTIFICATIONS_COLLECTION } from '@/constants/collections';
import { ENotificationType } from '@/interfaces/notification.interface';

// Only import expo-notifications when NOT running in Expo Go on Android
// to prevent the SDK 53+ crash caused by DevicePushTokenAutoRegistration.fx.js
const isExpoGoAndroid = isRunningInExpoGo() && Platform.OS === 'android';

// Use a type-safe lazy loader to avoid static import of expo-notifications on Expo Go Android
function getNotifications() {
  if (isExpoGoAndroid) return null;
   
  return require('expo-notifications') as typeof import('expo-notifications');
}

interface NotificationContextType {
  expoPushToken: string | null;
}

const NotificationContext = createContext<NotificationContextType>({ expoPushToken: null });

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();
  const { showToast } = useToast();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListenerRef = useRef<any>(null);
  const responseListenerRef = useRef<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Register for push notifications / FCM (no-op in Expo Go on Android)
    registerForPushNotifications(user.id).then((token) => {
      if (token) setExpoPushToken(token);
    });

    // 1. Schedule morning motivation at 8AM (rotates daily messages)
    scheduleMorningMotivation(user.id);

    // 2. Schedule streak warning at 8PM if user hasn't trained today
    scheduleStreakWarningNotification(user.id);

    // 3. Schedule daily reminder at 8:00 PM as fallback (no-op in Expo Go on Android)
    scheduleDailyReminder(20, 0);

    // 4. Welcome back notification if user hasn't opened app for 2+ days
    sendWelcomeBackNotification(user.id);
  }, [user?.id]);

  useEffect(() => {
    // Skip all notification listeners in Expo Go on Android
    if (isExpoGoAndroid) return;

    const Notifications = getNotifications();
    if (!Notifications) return;

    // 1. Foreground notification handler
    notificationListenerRef.current = Notifications.addNotificationReceivedListener((notification: any) => {
      const { title, body, data } = notification.request.content;

      // Save to notification history in Firestore if user is logged in
      if (user?.id && title && body) {
        addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
          userId: user.id,
          title,
          body,
          type: data?.type || ENotificationType.SystemInfo,
          isRead: false,
          createdAt: new Date().toISOString(),
          data: data || null,
        }).catch((e: unknown) =>
          console.warn('[NotificationProvider] Failed to save notification to history:', e)
        );
      }

      // Show in-app custom Toast notification
      showToast({
        type: 'info',
        message: `${title || 'Thông báo'}: ${body || ''}`,
      });
    });

    // 2. Interaction handler (when user taps on notification)
    responseListenerRef.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
      const data = response.notification.request.content.data;
      if (data?.screen) {
        try {
          router.push(data.screen as any);
        } catch (e) {
          console.warn('[NotificationProvider] Failed to route to target screen:', e);
        }
      }
    });

    return () => {
      if (notificationListenerRef.current) {
        notificationListenerRef.current.remove();
      }
      if (responseListenerRef.current) {
        responseListenerRef.current.remove();
      }
    };
  }, [user?.id]);

  return (
    <NotificationContext.Provider value={{ expoPushToken }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
