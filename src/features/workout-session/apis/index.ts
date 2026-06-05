import { db } from "@/lib/firebase";
import { IWorkoutSession } from "@/interfaces/workout-session.interface";
import { addDoc, collection } from "firebase/firestore";

/**
 * Lưu một buổi tập hoàn chỉnh lên Firestore.
 * Collection: workout_sessions/{autoId}
 */
export const saveWorkoutSession = async (
  session: IWorkoutSession
): Promise<string> => {
  const ref = await addDoc(collection(db, "workout_sessions"), session);
  return ref.id;
};
