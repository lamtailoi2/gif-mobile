import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MUSCLE_GROUP_MAPPING } from "@/features/exercise-library/constants/muscle-group-mapping";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import {
  ERecoveryState,
  IRecoveryMap,
  MuscleSlug,
} from "../types/dashboard";
import { WORKOUT_SESSIONS_COLLECTION } from "@/constants/collections";

export const getRecoveryMap = async (
  userId: string,
): Promise<IRecoveryMap> => {
  let lastSession: IWorkoutSession | undefined;

  try {
    const sessionsRef = collection(db, WORKOUT_SESSIONS_COLLECTION);
    const q = query(sessionsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const sessions = snapshot.docs
      .map((d) => d.data() as IWorkoutSession)
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
      );

    lastSession = sessions[0];
  } catch (e) {
    console.error("Error fetching recovery map data:", e);
    return { states: {} };
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
