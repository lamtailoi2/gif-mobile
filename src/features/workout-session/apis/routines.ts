import { IExercise } from "@/features/exercise-library/types/exercise";
import { db } from "@/lib/firebase";
import { IWorkoutRoutine } from "@/interfaces/workout-routine.interface";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

const ROUTINES_COLLECTION = "workoutRoutines";
const EXERCISE_LIBRARY_COLLECTION = "exerciseLibrary";

/** Lấy tất cả routines từ Firestore. */
export const getAllRoutines = async (): Promise<IWorkoutRoutine[]> => {
  try {
    const snapshot = await getDocs(collection(db, ROUTINES_COLLECTION));
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<IWorkoutRoutine, "id">),
    }));
  } catch (error) {
    console.error("Error fetching routines:", error);
    return [];
  }
};

/**
 * Lấy một routine cụ thể kèm theo danh sách exercises đã load.
 * Dùng Promise.all để fetch exercises song song.
 */
export const getRoutineWithExercises = async (
  routineId: string
): Promise<{ routine: IWorkoutRoutine; exercises: IExercise[] }> => {
  const routineDoc = await getDoc(doc(db, ROUTINES_COLLECTION, routineId));
  if (!routineDoc.exists()) {
    throw new Error(`Routine "${routineId}" not found in Firestore.`);
  }

  const routine: IWorkoutRoutine = {
    id: routineDoc.id,
    ...(routineDoc.data() as Omit<IWorkoutRoutine, "id">),
  };

  const exerciseDocs = await Promise.all(
    routine.exerciseIds.map((id) =>
      getDoc(doc(db, EXERCISE_LIBRARY_COLLECTION, id))
    )
  );

  const exercises: IExercise[] = exerciseDocs
    .filter((d) => d.exists())
    .map((d) => ({ id: d.id, ...(d.data() as Omit<IExercise, "id">) }));

  return { routine, exercises };
};
