import { db } from "@/lib/firebase";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { addDoc, collection } from "firebase/firestore";

const WORKOUT_SESSIONS_COLLECTION = "workout_sessions";

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

