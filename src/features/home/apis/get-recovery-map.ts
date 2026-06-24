import { offlineCache } from "@/lib/offline-cache";
import { isOnline } from "@/hooks/use-network";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MUSCLE_GROUP_MAPPING } from "@/features/exercise-library/constants/muscle-group-mapping";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import {
  ERecoveryState,
  IRecoveryMap,
  MuscleSlug,
} from "../types/dashboard";
import { WORKOUT_SESSIONS_COLLECTION } from "@/constants/collections";

const recoveryMapCacheKey = (uid: string) => `offline:recoveryMap:${uid}`;

export const getRecoveryMap = async (
  userId: string,
): Promise<IRecoveryMap> => {
  let lastSession: IWorkoutSession | undefined;

  try {
    if (!(await isOnline())) {
      const cached = await offlineCache.get<IWorkoutSession>(recoveryMapCacheKey(userId));
      if (cached) lastSession = cached;
    }
    if (!lastSession) {
      const sessionsRef = collection(db, WORKOUT_SESSIONS_COLLECTION);
      const q = query(
        sessionsRef,
        where("userId", "==", userId),
        orderBy("completedAt", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      const sessions = snapshot.docs.map((d) => d.data() as IWorkoutSession);
      lastSession = sessions[0];
      if (lastSession) {
        await offlineCache.set(recoveryMapCacheKey(userId), lastSession);
      }
    }
  } catch (e) {
    console.error("Error fetching recovery map data:", e);
    const cached = await offlineCache.get<IWorkoutSession>(recoveryMapCacheKey(userId));
    lastSession = cached ?? undefined;
    if (!lastSession) return { states: {} };
  }

  if (!lastSession) return { states: {} };

  const now = Date.now();
  const sessionMs = new Date(lastSession.completedAt).getTime();
  const hoursSinceLast = (now - sessionMs) / (1_000 * 60 * 60);

  const states: Partial<Record<MuscleSlug, ERecoveryState>> = {};

  Object.entries(lastSession.muscleBreakdown).forEach(([group, wasWorked]) => {
    if (!wasWorked) return;
    const slugs = MUSCLE_GROUP_MAPPING[group];
    if (!slugs) return;
    slugs.forEach((slug) => {
      states[slug] =
        hoursSinceLast < 48
          ? ERecoveryState.Fatigued
          : ERecoveryState.Recovered;
    });
  });

  return { states };
};
