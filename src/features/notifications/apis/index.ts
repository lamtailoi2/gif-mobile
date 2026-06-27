import { db } from "@/lib/firebase";
import { collection, doc, getDocs, orderBy, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { NOTIFICATIONS_COLLECTION } from "@/constants/collections";
import { INotification } from "@/interfaces/notification.interface";

/**
 * Fetch all notifications for a specific user.
 */
export const getNotifications = async (userId: string): Promise<INotification[]> => {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    })) as INotification[];
  } catch (error) {
    console.error("[getNotifications] Error fetching:", error);
    return [];
  }
};

/**
 * Mark a single notification as read.
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  if (!notificationId) return;
  try {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(docRef, { isRead: true });
  } catch (error) {
    console.error("[markNotificationAsRead] Error marking read:", error);
  }
};

/**
 * Mark all unread notifications of a user as read using a batch write.
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  if (!userId) return;
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where("userId", "==", userId),
      where("isRead", "==", false)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;

    const batch = writeBatch(db);
    snapshot.docs.forEach((docItem) => {
      batch.update(docItem.ref, { isRead: true });
    });
    await batch.commit();
  } catch (error) {
    console.error("[markAllNotificationsAsRead] Error marking all read:", error);
  }
};
