import { offlineCache } from "@/lib/offline-cache";
import { isOnline } from "@/hooks/use-network";
import { collection, getDocs, limit, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { IReadiness } from "../types/dashboard";
import { WORKOUT_SESSIONS_COLLECTION } from "@/constants/collections";

const readinessCacheKey = (uid: string) => `offline:readiness:${uid}`;

export const getReadiness = async (userId: string): Promise<IReadiness> => {
  let lastSession: IWorkoutSession | undefined;

  try {
    if (!(await isOnline())) {
      const cached = await offlineCache.get<IWorkoutSession>(readinessCacheKey(userId));
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
        await offlineCache.set(readinessCacheKey(userId), lastSession);
      }
    }
  } catch (e) {
    console.error("Error fetching readiness data:", e);
    const cached = await offlineCache.get<IWorkoutSession>(readinessCacheKey(userId));
    lastSession = cached ?? undefined;
    if (!lastSession) return { score: 80, label: "Ready" };
  }

  if (!lastSession) {
    return { score: 80, label: "Ready" };
  }

  const now = Date.now();
  const lastSessionMs = new Date(lastSession.completedAt).getTime();
  const daysSinceLast = (now - lastSessionMs) / (1_000 * 60 * 60 * 24);

  let score: number;
  if (daysSinceLast < 1) score = 60;
  else if (daysSinceLast < 2) score = 80;
  else if (daysSinceLast < 3) score = 90;
  else score = 95;

  const intensityPenalty = Math.round(
    Math.max(0, lastSession.intensityRating - 5) * 1.5,
  );
  score -= intensityPenalty;

  if (lastSession.energyLevel === "drained") score -= 10;
  else if (lastSession.energyLevel === "charged") score += 5;

  score = Math.min(100, Math.max(30, score));

  let label: string;
  if (score >= 85) label = "Optimal";
  else if (score >= 70) label = "Ready";
  else if (score >= 55) label = "Moderate";
  else label = "Recovering";

  return { score, label };
};
