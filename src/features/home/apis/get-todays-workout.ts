import { offlineCache } from "@/lib/offline-cache";
import { isOnline } from "@/hooks/use-network";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IWorkoutRoutine } from "@/interfaces/workout-routine.interface";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { getAiWorkoutPlan } from "@/features/profile/ai-service/training-goals.service";
import { ITodaysWorkout } from "../types/dashboard";
import { ROUTINES_COLLECTION, WORKOUT_SESSIONS_COLLECTION } from "@/constants/collections";
import { getLocalDateString } from "@/utils/date";

const todaysWorkoutCacheKey = (uid: string) => `offline:todaysWorkout:${uid}`;

const getTodaysRoutine = (
  routines: IWorkoutRoutine[],
): IWorkoutRoutine | null => {
  if (routines.length === 0) return null;
  const dayOfWeek = new Date().getDay();
  const scheduled = routines.find((r) => r.dayOfWeek?.includes(dayOfWeek));
  if (scheduled) return scheduled;
  return routines[dayOfWeek % routines.length];
};

const completedTodayCacheKey = (uid: string) => `offline:completedToday:${uid}`;

const getCompletedTodaySessionId = async (
  userId: string,
): Promise<string | undefined> => {
  try {
    if (!(await isOnline())) {
      return offlineCache.get<string>(completedTodayCacheKey(userId));
    }
    const todayStr = getLocalDateString(new Date());
    const sessionsRef = collection(db, WORKOUT_SESSIONS_COLLECTION);
    const q = query(sessionsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const todaySession = snapshot.docs.find(
      (d) => getLocalDateString((d.data() as IWorkoutSession).completedAt) === todayStr,
    );
    const sessionId = todaySession?.id;
    if (sessionId) {
      await offlineCache.set(completedTodayCacheKey(userId), sessionId);
    }
    return sessionId;
  } catch (e) {
    console.error("Error checking today's completion:", e);
    return offlineCache.get<string>(completedTodayCacheKey(userId));
  }
};

export const getTodaysWorkout = async (
  userId: string,
): Promise<ITodaysWorkout> => {
  if (!(await isOnline())) {
    const cached = await offlineCache.get<ITodaysWorkout>(todaysWorkoutCacheKey(userId));
    if (cached) return cached;
  }

  const [completedSessionId] = await Promise.all([
    getCompletedTodaySessionId(userId),
  ]);

  let routines: IWorkoutRoutine[] = [];

  try {
    if (!(await isOnline())) {
      const cached = await offlineCache.get<IWorkoutRoutine[]>("offline:workout_routines");
      if (cached) routines = cached;
    }
    if (routines.length === 0) {
      const snapshot = await getDocs(collection(db, ROUTINES_COLLECTION));
      routines = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<IWorkoutRoutine, "id">),
      }));
      await offlineCache.set("offline:workout_routines", routines);
    }
  } catch (e) {
    console.error("Error fetching routines:", e);
    const cached = await offlineCache.get<IWorkoutRoutine[]>("offline:workout_routines");
    if (cached) routines = cached;
  }

  const aiPlan = await getAiWorkoutPlan(userId);
  const hasAiPlan = !!(aiPlan && aiPlan.schedule && aiPlan.schedule.length > 0);

  const base = (() => {
    if (hasAiPlan) {
      let currentIndex = aiPlan.currentPlanIndex || 0;
      
      // Nếu hôm nay đã tập xong, ta lùi index lại 1 bước để hiển thị đúng bài vừa tập.
      // Vì lúc save session, index đã được tăng lên để dành cho ngày mai.
      if (completedSessionId) {
        currentIndex = (currentIndex - 1 + aiPlan.schedule.length) % aiPlan.schedule.length;
      }
      
      const dayIndex = currentIndex % aiPlan.schedule.length;
      const todayAiSchedule = aiPlan.schedule[dayIndex];

      return {
        id: `ai_plan_day_${dayIndex}_user_${userId}`,
        type: todayAiSchedule.day || "AI Routine",
        focus: todayAiSchedule.focus,
        durationMin: 45,
        intensity: "Medium",
        load: "Personalized",
      };
    }

    const todaysRoutine = getTodaysRoutine(routines);

    if (todaysRoutine) {
      return {
        id: todaysRoutine.id,
        type: todaysRoutine.name,
        focus: todaysRoutine.focus,
        durationMin: todaysRoutine.durationMin,
        intensity: todaysRoutine.intensity,
        load: todaysRoutine.load,
      };
    }

    return {
      id: "",
      type: "Rest Day",
      focus: "Active Recovery",
      durationMin: 0,
      intensity: "Low",
      load: "None",
    };
  })();

  const result: ITodaysWorkout = {
    ...base,
    isCompleted: !!completedSessionId,
    hasAiPlan,
    completedSessionId,
  };

  await offlineCache.set(todaysWorkoutCacheKey(userId), result);

  return result;
};
