import { getReadiness } from "./get-readiness";
import { getStreak } from "./get-streak";
import { getTodaysWorkout } from "./get-todays-workout";
import { getRecoveryMap } from "./get-recovery-map";
import { IHomeDashboard } from "../types/dashboard";

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

  return {
    user: { name: userName },
    greetingTimeOfDay: getTimeOfDay(),
    hasNotification: false,
    readiness,
    streak,
    todaysWorkout,
    recoveryMap,
  };
};
