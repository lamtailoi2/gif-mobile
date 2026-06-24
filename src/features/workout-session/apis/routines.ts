import { offlineCache } from "@/lib/offline-cache";
import { isOnline } from "@/hooks/use-network";
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
import { ROUTINES_COLLECTION, EXERCISE_LIBRARY_COLLECTION } from "@/constants/collections";

const ROUTINES_CACHE_KEY = "offline:workout_routines";
const EXERCISE_CACHE_PREFIX = "offline:exercise:";

/** Lấy tất cả routines từ Firestore. */
export const getAllRoutines = async (): Promise<IWorkoutRoutine[]> => {
  try {
    if (!(await isOnline())) {
      const cached = await offlineCache.get<IWorkoutRoutine[]>(ROUTINES_CACHE_KEY);
      if (cached) return cached;
    }
    const snapshot = await getDocs(collection(db, ROUTINES_COLLECTION));
    const routines = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<IWorkoutRoutine, "id">),
    }));
    await offlineCache.set(ROUTINES_CACHE_KEY, routines);
    return routines;
  } catch (error) {
    console.error("Error fetching routines:", error);
    const cached = await offlineCache.get<IWorkoutRoutine[]>(ROUTINES_CACHE_KEY);
    return cached ?? [];
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
      routine.exerciseIds.map(async (id) => {
        const cacheKey = EXERCISE_CACHE_PREFIX + id;
        try {
          if (!(await isOnline())) {
            const cached = await offlineCache.get<IExercise>(cacheKey);
            if (cached) return { id, exists: () => true, data: () => cached } as any;
          }
          const ref = doc(db, EXERCISE_LIBRARY_COLLECTION, id);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            await offlineCache.set(cacheKey, { id: snap.id, ...snap.data() } as IExercise);
          }
          return snap;
        } catch {
          const cached = await offlineCache.get<IExercise>(cacheKey);
          if (cached) return { id, exists: () => true, data: () => cached } as any;
          return { id, exists: () => false } as any;
        }
      })
    );

    // Lỗi 1 fix: Log cảnh báo cho các exerciseId không tìm thấy trong Firestore
    // thay vì silently bỏ qua — giúp dễ debug khi AI sinh ra ID sai.
    exerciseDocs.forEach((d, idx) => {
      if (!d.exists()) {
        console.warn(
          `[AI Plan] Exercise ID "${routine.exerciseIds[idx]}" not found in exercise_library. It will be skipped.`
        );
      }
    });

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

    if (exercises.length === 0) {
      throw new Error(
        `[AI Plan] Day ${dayIndex}: No valid exercises found. All ${routine.exerciseIds.length} exercise IDs returned by AI are invalid. Please regenerate the AI plan.`
      );
    }

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
    routine.exerciseIds.map(async (id) => {
      const cacheKey = EXERCISE_CACHE_PREFIX + id;
      try {
        if (!(await isOnline())) {
          const cached = await offlineCache.get<IExercise>(cacheKey);
          if (cached) return { id, exists: () => true, data: () => cached } as any;
        }
        const ref = doc(db, EXERCISE_LIBRARY_COLLECTION, id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          await offlineCache.set(cacheKey, { id: snap.id, ...snap.data() } as IExercise);
        }
        return snap;
      } catch {
        const cached = await offlineCache.get<IExercise>(cacheKey);
        if (cached) return { id, exists: () => true, data: () => cached } as any;
        return { id, exists: () => false } as any;
      }
    })
  );

  // Log cảnh báo cho các exerciseId không tìm thấy trong Firestore
  exerciseDocs.forEach((d, idx) => {
    if (!d.exists()) {
      console.warn(
        `[Routine "${routine.name}"] Exercise ID "${routine.exerciseIds[idx]}" not found in exercise_library. It will be skipped.`
      );
    }
  });

  const exercises: IExercise[] = exerciseDocs
    .filter((d) => d.exists())
    .map((d) => ({ id: d.id, ...(d.data() as Omit<IExercise, "id">) }));

  return { routine, exercises };
};
