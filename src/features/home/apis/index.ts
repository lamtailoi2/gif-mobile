import { getReadiness } from "./get-readiness";
import { getStreak } from "./get-streak";
import { getTodaysWorkout } from "./get-todays-workout";
import { getRecoveryMap } from "./get-recovery-map";
import { IHomeDashboard } from "../types/dashboard";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { NOTIFICATIONS_COLLECTION } from "@/constants/collections";

const getTimeOfDay = (): "morning" | "afternoon" | "evening" => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
};

export const getHomeDashboard = async (
  userId: string,
  userName: string,
): Promise<IHomeDashboard> => {
  const [readiness, streak, todaysWorkout, recoveryMap] = await Promise.all([
    getReadiness(userId),
    getStreak(userId),
    getTodaysWorkout(userId),
    getRecoveryMap(userId),
  ]);

  let hasNotification = false;
  if (userId) {
    try {
      const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where("userId", "==", userId),
        where("isRead", "==", false),
        limit(1)
      );
      const snap = await getDocs(q);
      hasNotification = !snap.empty;
    } catch (e) {
      console.warn("Failed to check notifications state for dashboard:", e);
    }
  }

  return {
    user: { name: userName },
    greetingTimeOfDay: getTimeOfDay(),
    hasNotification,
    readiness,
    streak,
    todaysWorkout,
    recoveryMap,
  };
};

