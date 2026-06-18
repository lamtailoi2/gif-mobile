import { IExercise } from "@/features/exercise-library/types/exercise";
import { db } from "@/lib/firebase";
import { IWorkoutRoutine } from "@/interfaces/workout-routine.interface";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { getAiWorkoutPlan } from "@/features/profile/ai-service/training-goals.service";

const ROUTINES_COLLECTION = "workout_routines";
const EXERCISE_LIBRARY_COLLECTION = "exercise_library";

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
  // Check if this is a generated AI plan
  const aiMatch = routineId.match(/^ai_plan_day_(\d+)_user_(.+)$/);
  if (aiMatch) {
    const dayIndex = parseInt(aiMatch[1]);
    const userId = aiMatch[2];
    
    const aiPlan = await getAiWorkoutPlan(userId);
    if (!aiPlan || !aiPlan.schedule || aiPlan.schedule.length <= dayIndex) {
      throw new Error("AI Plan not found or invalid day index.");
    }
    
    const aiSchedule = aiPlan.schedule[dayIndex];
    const routine: IWorkoutRoutine = {
      id: routineId,
      name: aiSchedule.day || "AI Routine",
      focus: aiSchedule.focus,
      durationMin: 45,
      intensity: "Medium",
      load: "Personalized",
      exerciseIds: aiSchedule.exercises.map(e => e.exerciseId),
      muscleGroups: [],
      dayOfWeek: [],
      createdAt: new Date().toISOString()
    };
    
    const exerciseDocs = await Promise.all(
      routine.exerciseIds.map((id) =>
        getDoc(doc(db, EXERCISE_LIBRARY_COLLECTION, id))
      )
    );

    const exercises: IExercise[] = exerciseDocs
      .filter((d) => d.exists())
      .map((d) => {
        const data = d.data() as Omit<IExercise, "id">;
        const aiEx = aiSchedule.exercises.find(e => e.exerciseId === d.id);
        return { 
          id: d.id, 
          ...data,
          defaultSets: aiEx?.sets || data.defaultSets,
          defaultReps: aiEx?.reps || data.defaultReps
        };
      });

    return { routine, exercises };
  }

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
