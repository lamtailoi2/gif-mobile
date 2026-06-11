import { IWorkoutRoutine } from "@/interfaces/workout-routine.interface";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { buildRecoveryMap } from "./build-recovery-map";
import { calculateReadiness } from "./calculate-readiness";
import { calculateStreak } from "./calculate-streak";
import { IHomeDashboard } from "../types/dashboard";

const WORKOUT_SESSIONS_COLLECTION = "workout_sessions";
const ROUTINES_COLLECTION = "workout_routines";

const getTimeOfDay = (): "morning" | "afternoon" | "evening" => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
};

/**
 * Chọn routine cho hôm nay:
 * 1. Tìm routine có dayOfWeek chứa ngày hôm nay
 * 2. Fallback: rotate index theo dayOfWeek % routines.length
 */
const getTodaysRoutine = (
  routines: IWorkoutRoutine[]
): IWorkoutRoutine | null => {
  if (routines.length === 0) return null;
  const dayOfWeek = new Date().getDay(); // 0=Sun,...,6=Sat
  const scheduled = routines.find((r) => r.dayOfWeek?.includes(dayOfWeek));
  if (scheduled) return scheduled;
  return routines[dayOfWeek % routines.length];
};

/**
 * Mapping streak → percentile ước tính.
 * (Tham khảo data từ các app gym phổ biến)
 */
const streakToPercentile = (streak: number): number => {
  if (streak >= 30) return 1;
  if (streak >= 14) return 5;
  if (streak >= 7) return 15;
  if (streak >= 3) return 30;
  return 50;
};

/**
 * Lấy toàn bộ dashboard data từ Firestore thực tế.
 *
 * @param userId - Clerk user ID để filter sessions
 * @param userName - Tên hiển thị (từ Clerk, không lưu trên Firestore)
 */
export const getHomeDashboard = async (
  userId: string,
  userName: string
): Promise<IHomeDashboard> => {
  // 1. Fetch recent workout sessions của user
  let sessions: IWorkoutSession[] = [];
  try {
    const sessionsRef = collection(db, WORKOUT_SESSIONS_COLLECTION);
    // Chỉ filter theo userId — tránh composite index requirement.
    // Sort in-memory sau khi fetch.
    const q = query(sessionsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    sessions = snapshot.docs
      .map((d) => d.data() as IWorkoutSession)
      .sort((a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )
      .slice(0, 30);
  } catch (e) {
    console.error("Error fetching workout sessions for dashboard:", e);
  }

  // 2. Fetch routines
  let routines: IWorkoutRoutine[] = [];
  try {
    const snapshot = await getDocs(collection(db, ROUTINES_COLLECTION));
    routines = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<IWorkoutRoutine, "id">),
    }));
  } catch (e) {
    console.error("Error fetching routines:", e);
  }

  // 3. Compute derived values
  const lastSession = sessions[0];
  const streak = calculateStreak(sessions);
  const readiness = calculateReadiness(lastSession);
  const recoveryMap = buildRecoveryMap(lastSession);
  const todaysRoutine = getTodaysRoutine(routines);

  return {
    user: { name: userName },
    greetingTimeOfDay: getTimeOfDay(),
    hasNotification: false,
    readiness,
    streak: {
      days: streak,
      percentile: streakToPercentile(streak),
    },
    todaysWorkout: todaysRoutine
      ? {
          id: todaysRoutine.id,
          type: todaysRoutine.name,
          focus: todaysRoutine.focus,
          durationMin: todaysRoutine.durationMin,
          intensity: todaysRoutine.intensity,
          load: todaysRoutine.load,
        }
      : {
          id: "",
          type: "Rest Day",
          focus: "Active Recovery",
          durationMin: 0,
          intensity: "Low",
          load: "None",
        },
    recoveryMap,
  };
};
