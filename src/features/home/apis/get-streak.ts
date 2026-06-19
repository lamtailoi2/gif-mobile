import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { IStreak } from "../types/dashboard";
import { WORKOUT_SESSIONS_COLLECTION } from "@/constants/collections";
import { getLocalDateString } from "@/utils/date";

const streakToPercentile = (streak: number): number => {
  if (streak >= 30) return 1;
  if (streak >= 14) return 5;
  if (streak >= 7) return 15;
  if (streak >= 3) return 30;
  return 50;
};

export const getStreak = async (userId: string): Promise<IStreak> => {
  let sessions: IWorkoutSession[] = [];

  try {
    const sessionsRef = collection(db, WORKOUT_SESSIONS_COLLECTION);
    const q = query(
      sessionsRef,
      where("userId", "==", userId),
      orderBy("completedAt", "desc"),
      limit(30)
    );
    const snapshot = await getDocs(q);
    sessions = snapshot.docs.map((d) => d.data() as IWorkoutSession);
  } catch (e) {
    console.error("Error fetching streak data:", e);
    return { days: 0, percentile: 50 };
  }

  if (sessions.length === 0) {
    return { days: 0, percentile: 50 };
  }

  const workoutDates = new Set(
    sessions.map((s) => getLocalDateString(s.completedAt)),
  );

  const today = new Date();
  const todayStr = getLocalDateString(today);
  const yesterdayStr = getLocalDateString(new Date(today.getTime() - 86_400_000));

  if (!workoutDates.has(todayStr) && !workoutDates.has(yesterdayStr)) {
    return { days: 0, percentile: 50 };
  }

  let checkDate = workoutDates.has(todayStr)
    ? new Date(today)
    : new Date(today.getTime() - 86_400_000);

  let streak = 0;
  while (true) {
    const dateStr = getLocalDateString(checkDate);
    if (!workoutDates.has(dateStr)) break;
    streak++;
    checkDate = new Date(checkDate.getTime() - 86_400_000);
  }

  return { days: streak, percentile: streakToPercentile(streak) };
};
