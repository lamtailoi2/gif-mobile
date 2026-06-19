import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { IExerciseGuide } from "@/features/exercise-guide/types/guide";
import { GUIDES_COLLECTION } from "@/constants/collections";

export const getExerciseGuideById = async (
  exerciseId: string,
): Promise<IExerciseGuide | null> => {
  try {
    const guideRef = doc(db, GUIDES_COLLECTION, exerciseId);
    const snap = await getDoc(guideRef);
    if (!snap.exists()) return null;
    return snap.data() as IExerciseGuide;
  } catch (error) {
    console.error("Error fetching exercise guide:", error);
    return null;
  }
};
