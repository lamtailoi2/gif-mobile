import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IWorkoutRoutine } from "@/interfaces/workout-routine.interface";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { getAiWorkoutPlan } from "@/features/profile/ai-service/training-goals.service";
import { ITodaysWorkout } from "../types/dashboard";
import { ROUTINES_COLLECTION, WORKOUT_SESSIONS_COLLECTION } from "@/constants/collections";
import { getLocalDateString } from "@/utils/date";

const getTodaysRoutine = (
  routines: IWorkoutRoutine[],
): IWorkoutRoutine | null => {
  if (routines.length === 0) return null;
  const dayOfWeek = new Date().getDay();
  const scheduled = routines.find((r) => r.dayOfWeek?.includes(dayOfWeek));
  if (scheduled) return scheduled;
  return routines[dayOfWeek % routines.length];
};

const getCompletedTodaySessionId = async (
  userId: string,
): Promise<string | undefined> => {
  try {
    const todayStr = getLocalDateString(new Date());
    const sessionsRef = collection(db, WORKOUT_SESSIONS_COLLECTION);
    const q = query(sessionsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const todaySession = snapshot.docs.find(
      (d) => getLocalDateString((d.data() as IWorkoutSession).completedAt) === todayStr,
    );
    return todaySession?.id;
  } catch (e) {
    console.error("Error checking today's completion:", e);
    return undefined;
  }
};

export const getTodaysWorkout = async (
  userId: string,
): Promise<ITodaysWorkout> => {
  const [completedSessionId] = await Promise.all([
    getCompletedTodaySessionId(userId),
  ]);

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

  const aiPlan = await getAiWorkoutPlan(userId);
  const hasAiPlan = !!(aiPlan && aiPlan.schedule && aiPlan.schedule.length > 0);

  const base = (() => {
    if (hasAiPlan) {
      const dayOfWeek = new Date().getDay();
      const adjustedDay = (dayOfWeek + 6) % 7;
      const dayIndex = adjustedDay % aiPlan.schedule.length;
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

  return {
    ...base,
    isCompleted: !!completedSessionId,
    hasAiPlan,
    completedSessionId,
  };
};
