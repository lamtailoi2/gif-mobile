import { db } from "@/lib/firebase";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { addDoc, collection } from "firebase/firestore";
import { WORKOUT_SESSIONS_COLLECTION } from "@/constants/collections";

/**
 * Lưu một buổi tập hoàn chỉnh lên Firestore.
 * Collection: workout_sessions/{autoId}
 */
export const saveWorkoutSession = async (
  session: IWorkoutSession
): Promise<string> => {
  const ref = await addDoc(
    collection(db, WORKOUT_SESSIONS_COLLECTION),
    session
  );
  return ref.id;
};

