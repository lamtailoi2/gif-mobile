import { offlineCache } from "@/lib/offline-cache";
import { isOnline } from "@/hooks/use-network";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { IExerciseGuide } from "@/features/exercise-guide/types/guide";
import { GUIDES_COLLECTION } from "@/constants/collections";

const guideCacheKey = (id: string) => `offline:guide:${id}`;

export const getExerciseGuideById = async (
  exerciseId: string,
): Promise<IExerciseGuide | null> => {
  try {
    if (!(await isOnline())) {
      const cached = await offlineCache.get<IExerciseGuide>(guideCacheKey(exerciseId));
      if (cached) return cached;
    }
    const guideRef = doc(db, GUIDES_COLLECTION, exerciseId);
    const snap = await getDoc(guideRef);
    if (!snap.exists()) return null;
    const data = snap.data() as IExerciseGuide;
    await offlineCache.set(guideCacheKey(exerciseId), data);
    return data;
  } catch (error) {
    console.error("Error fetching exercise guide:", error);
    return offlineCache.get<IExerciseGuide>(guideCacheKey(exerciseId));
  }
};
