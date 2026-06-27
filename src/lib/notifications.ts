import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { isRunningInExpoGo } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './firebase';
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { FCM_TOKENS_COLLECTION, WORKOUT_SESSIONS_COLLECTION } from '@/constants/collections';
import { getLocalDateString } from '@/utils/date';
// NOTE: sendWorkoutReminderEmail kept for future use — not called from notification flow anymore
// import { sendWorkoutReminderEmail } from '@/lib/email';
import { isOnline } from '@/hooks/use-network';

// Lazy-load expo-notifications ONLY when NOT running in Expo Go on Android
// to prevent the SDK 53+ crash caused by DevicePushTokenAutoRegistration.fx.js
function getNotifications() {
  if (isRunningInExpoGo() && Platform.OS === 'android') {
    console.log('[Notifications] Skipping expo-notifications: not supported in Expo Go on Android (SDK 53+). Use a development build.');
    return null;
  }
   
  const N = require('expo-notifications');
  return N;
}

// Configure default notification behavior (only if supported)
const Notifications = getNotifications();
if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

/**
 * Request permission and register for push notifications.
 * Obtains the push token and saves it to Firestore.
 * Returns null silently when running in Expo Go on Android.
 */
export async function registerForPushNotifications(userId: string): Promise<string | null> {
  const Notifs = getNotifications();
  if (!Notifs) return null;

  if (!Device.isDevice) {
    console.log('[Notifications] Must use physical device for Push Notifications');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifs.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifs.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[Notifications] Failed to get push token for push notification!');
      return null;
    }

    let token: string;
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    try {
      const expoToken = await Notifs.getExpoPushTokenAsync({
        projectId: projectId || undefined,
      });
      token = expoToken.data;
    } catch (e) {
      console.warn('[Notifications] Could not get Expo Push Token, trying Device Push Token:', e);
      const deviceToken = await Notifs.getDevicePushTokenAsync();
      token = deviceToken.data;
    }

    // Save token to Firestore
    await setDoc(doc(db, FCM_TOKENS_COLLECTION, userId), {
      token,
      platform: Platform.OS,
      updatedAt: new Date().toISOString(),
    });

    console.log('[Notifications] Token registered successfully:', token);
    return token;
  } catch (error) {
    console.error('[Notifications] Error registering for push notifications:', error);
    return null;
  }
}

/**
 * Schedule a local daily reminder.
 * Silently skips when running in Expo Go on Android.
 */
export async function scheduleDailyReminder(hour: number, minute: number) {
  const Notifs = getNotifications();
  if (!Notifs) return null;

  try {
    await cancelDailyReminder();

    const identifier = await Notifs.scheduleNotificationAsync({
      content: {
        title: "Đã đến giờ tập luyện! 💪",
        body: "Hãy dành ra 30 phút hôm nay để giữ vững phong độ và streak của bạn nhé!",
        sound: true,
        data: { screen: "/(tabs)/workout", isLocal: true },
      },
      trigger: {
        type: Notifs.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    console.log('[Notifications] Scheduled daily reminder ID:', identifier);
    return identifier;
  } catch (error) {
    console.error('[Notifications] Error scheduling daily reminder:', error);
    return null;
  }
}

/**
 * Cancel the local daily reminder.
 * Silently skips when running in Expo Go on Android.
 */
export async function cancelDailyReminder() {
  const Notifs = getNotifications();
  if (!Notifs) return;

  try {
    const scheduled = await Notifs.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.title?.includes("tập luyện")) {
        await Notifs.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    console.log('[Notifications] Cancelled all daily reminder notifications');
  } catch (error) {
    console.error('[Notifications] Error cancelling daily reminder:', error);
  }
}

/**
 * Triggers a test local notification after a few seconds.
 * Silently skips when running in Expo Go on Android.
 */
export async function triggerTestLocalNotification(seconds: number = 3): Promise<string | null> {
  const Notifs = getNotifications();
  if (!Notifs) return null;

  try {
    const identifier = await Notifs.scheduleNotificationAsync({
      content: {
        title: "Test Local Notification 🔔",
        body: "Đây là thông báo cục bộ thử nghiệm từ GIF App! Chúc bạn tập luyện vui vẻ.",
        sound: true,
        data: { 
          screen: "/(tabs)/workout",
          type: "TestNotification",
          isLocal: true,
        },
      },
      trigger: {
        type: Notifs.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
      },
    });

    console.log('[Notifications] Triggered test local notification ID:', identifier);
    return identifier;
  } catch (error) {
    console.error('[Notifications] Error triggering test local notification:', error);
    return null;
  }
}

/**
 * Automatically checks and sends a workout reminder email if the user hasn't exercised today,
 * and no email has been sent in the last 24 hours.
 */
export async function checkAndSendWorkoutReminderEmail(
  userId: string,
  emailAddress: string,
  userName: string
): Promise<void> {
  try {
    // 1. Verify connection
    if (!(await isOnline())) {
      console.log('[NotificationService] Device offline, skipping email reminder check.');
      return;
    }

    // 2. Check if we already sent a reminder email in the last 24 hours
    const storageKey = `last_workout_reminder_sent_at:${userId}`;
    const lastSentStr = await AsyncStorage.getItem(storageKey);
    if (lastSentStr) {
      const lastSent = new Date(lastSentStr);
      const now = new Date();
      const diffMs = now.getTime() - lastSent.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours < 24) {
        console.log('[NotificationService] Workout reminder email already sent within 24 hours. Skipping.');
        return;
      }
    }

    // 3. Check if the user has completed any workout session today
    const todayStr = getLocalDateString(new Date());
    const sessionsRef = collection(db, WORKOUT_SESSIONS_COLLECTION);
    const q = query(sessionsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const todaySession = snapshot.docs.find(
      (d) => getLocalDateString((d.data() as any).completedAt) === todayStr
    );

    if (todaySession) {
      console.log('[NotificationService] User has already completed a workout session today. Skipping.');
      return;
    }

    // NOTE: Email logic kept for future use — replaced by local notification (scheduleStreakWarningNotification)
    // const success = await sendWorkoutReminderEmail(emailAddress, userName);
  } catch (error) {
    console.error('[NotificationService] Error checking/sending workout reminder email:', error);
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// NEW: Local Notification + Expo Push helpers (no backend required)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send an immediate local notification (visible in the status bar).
 * Works on physical devices. Silently skips in Expo Go on Android.
 *
 * @param title  Notification title
 * @param body   Notification body text
 * @param data   Optional navigation/deep-link metadata (e.g. { screen: '/(tabs)/workout' })
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<string | null> {
  const Notifs = getNotifications();
  if (!Notifs) return null;

  try {
    const identifier = await Notifs.scheduleNotificationAsync({
      content: { title, body, sound: true, data: data ?? {} },
      trigger: null, // null = fire immediately
    });
    console.log('[Notifications] Local notification sent, id:', identifier);
    return identifier;
  } catch (error) {
    console.error('[Notifications] Error sending local notification:', error);
    return null;
  }
}

/**
 * Send a push notification to the current device via the Expo Push API.
 * This works even when the app is in the background or killed.
 * Requires a valid Expo Push Token (obtained via registerForPushNotifications).
 *
 * @param expoPushToken  The ExponentPushToken for this device
 * @param title          Notification title
 * @param body           Notification body text
 * @param data           Optional navigation/deep-link metadata
 */
export async function sendExpoPushToSelf(
  expoPushToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> {
  if (!expoPushToken) {
    console.warn('[Notifications] sendExpoPushToSelf: no push token provided.');
    return false;
  }

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: data ?? {},
      }),
    });
    const result = await response.json();
    if (result.data?.status === 'ok') {
      console.log('[Notifications] Expo push sent successfully.');
      return true;
    }
    console.warn('[Notifications] Expo push response:', result);
    return false;
  } catch (error) {
    console.error('[Notifications] Error sending Expo push:', error);
    return false;
  }
}

/**
 * Schedule a streak-warning local notification at 8:00 PM today,
 * but only if the user hasn't completed a workout session today yet.
 * Replaces the old email-based reminder approach.
 *
 * Silently skips in Expo Go on Android or if already scheduled today.
 */
export async function scheduleStreakWarningNotification(userId: string): Promise<void> {
  const Notifs = getNotifications();
  if (!Notifs) return;

  try {
    // Skip if user already trained today
    if (await isOnline()) {
      const todayStr = getLocalDateString(new Date());
      const sessionsRef = collection(db, WORKOUT_SESSIONS_COLLECTION);
      const q = query(sessionsRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const trainedToday = snapshot.docs.some(
        (d) => getLocalDateString((d.data() as any).completedAt) === todayStr
      );
      if (trainedToday) {
        console.log('[Notifications] Streak OK — skipping streak warning notification.');
        return;
      }
    }

    // Avoid scheduling twice in the same day
    const storageKey = `streak_warning_scheduled_at:${userId}`;
    const lastScheduled = await AsyncStorage.getItem(storageKey);
    if (lastScheduled) {
      const scheduledDate = getLocalDateString(new Date(lastScheduled));
      const todayStr = getLocalDateString(new Date());
      if (scheduledDate === todayStr) {
        console.log('[Notifications] Streak warning already scheduled today. Skipping.');
        return;
      }
    }

    // Schedule at 8PM tonight
    await Notifs.scheduleNotificationAsync({
      content: {
        title: '🔥 Streak của bạn sắp bị gián đoạn!',
        body: 'Bạn chưa tập hôm nay. Hãy dành ra 30 phút để giữ vững chuỗi ngày tập của bạn nhé!',
        sound: true,
        data: { screen: '/(tabs)/workout', type: 'streak_warning' },
      },
      trigger: {
        type: Notifs.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });

    await AsyncStorage.setItem(storageKey, new Date().toISOString());
    console.log('[Notifications] Streak warning notification scheduled for 8PM.');
  } catch (error) {
    console.error('[Notifications] Error scheduling streak warning:', error);
  }
}

/**
 * Send an immediate local notification congratulating the user
 * after successfully saving a workout session.
 *
 * @param routineName   The name of the completed routine
 * @param durationMin   Duration of the session in minutes
 * @param totalVolume   Total volume lifted in kg
 */
export async function sendWorkoutCompleteNotification(
  routineName: string,
  durationMin: number,
  totalVolume: number
): Promise<string | null> {
  const title = '🏆 Workout hoàn thành!';
  const body = `${routineName ? `"${routineName}" — ` : ''}${durationMin} phút · ${totalVolume} kg tổng khối lượng. Tuyệt vời, hãy tiếp tục phát huy!`;
  return sendLocalNotification(title, body, { screen: '/(tabs)/progress', type: 'workout_complete' });
}

/**
 * Schedule a morning motivational notification at 8:00 AM daily.
 * Only fires if the user hasn't trained today yet.
 * Skips if already scheduled today (prevents duplicate).
 */
export async function scheduleMorningMotivation(userId: string): Promise<void> {
  const Notifs = getNotifications();
  if (!Notifs) return;

  try {
    // Avoid scheduling twice in the same day
    const storageKey = `morning_motivation_scheduled_at:${userId}`;
    const lastScheduled = await AsyncStorage.getItem(storageKey);
    if (lastScheduled) {
      const scheduledDate = getLocalDateString(new Date(lastScheduled));
      const todayStr = getLocalDateString(new Date());
      if (scheduledDate === todayStr) {
        console.log('[Notifications] Morning motivation already scheduled today. Skipping.');
        return;
      }
    }

    const motivationalMessages = [
      'Ngày mới, cơ hội mới! Hôm nay bạn sẽ mạnh hơn hôm qua 💪',
      'Mỗi rep, mỗi set đều đưa bạn đến gần mục tiêu hơn. Hãy bắt đầu thôi! 🔥',
      'Cơ thể của bạn có thể làm được. Chỉ cần thuyết phục đầu óc mà thôi! 🧠',
      'Đừng đợi có động lực — hãy hành động để tạo ra nó! ⚡',
      'Consistency beats perfection. Tập một ít còn hơn không tập! 🎯',
    ];
    const body = motivationalMessages[new Date().getDay() % motivationalMessages.length];

    await Notifs.scheduleNotificationAsync({
      content: {
        title: '🌅 Chào buổi sáng! Sẵn sàng chưa?',
        body,
        sound: true,
        data: { screen: '/(tabs)/workout', type: 'workout_reminder' },
      },
      trigger: {
        type: Notifs.SchedulableTriggerInputTypes.DAILY,
        hour: 8,
        minute: 0,
      },
    });

    await AsyncStorage.setItem(storageKey, new Date().toISOString());
    console.log('[Notifications] Morning motivation scheduled for 8AM.');
  } catch (error) {
    console.error('[Notifications] Error scheduling morning motivation:', error);
  }
}

/**
 * Send a "welcome back" notification when user opens the app
 * after 2+ days of inactivity (based on last app open timestamp).
 * Fires immediately (no scheduling needed).
 */
export async function sendWelcomeBackNotification(userId: string): Promise<void> {
  const Notifs = getNotifications();
  if (!Notifs) return;

  try {
    const storageKey = `last_app_open_at:${userId}`;
    const lastOpenStr = await AsyncStorage.getItem(storageKey);
    const now = new Date();

    // Update last open timestamp
    await AsyncStorage.setItem(storageKey, now.toISOString());

    if (!lastOpenStr) return; // First time opening

    const lastOpen = new Date(lastOpenStr);
    const daysSinceLastOpen = (now.getTime() - lastOpen.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceLastOpen >= 2) {
      const daysRounded = Math.floor(daysSinceLastOpen);
      await sendLocalNotification(
        `👋 Lâu rồi không gặp!`,
        `Đã ${daysRounded} ngày kể từ lần cuối bạn mở app. Cơ thể bạn đang chờ được tập đó! Hãy xem lịch tập hôm nay nhé.`,
        { screen: '/(tabs)/workout', type: 'workout_reminder' }
      );
      console.log(`[Notifications] Sent welcome back notification (${daysRounded} days absent).`);
    }
  } catch (error) {
    console.error('[Notifications] Error sending welcome back notification:', error);
  }
}

