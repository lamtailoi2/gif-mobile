/**
 * Seed script — chạy một lần để tạo workout routines trên Firestore.
 *
 * Cách dùng:
 * 1. Import và gọi `seedWorkoutRoutines()` từ một dev screen hoặc
 *    tạm thời gọi trong _layout.tsx (nhớ xóa sau khi seed xong).
 * 2. Script tự động skip nếu routines đã tồn tại (idempotent).
 */

import { db } from "@/lib/firebase";
import { IWorkoutRoutine } from "@/interfaces/workout-routine.interface";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { getAllExercises } from "@/features/exercise-library/apis";

const ROUTINES_COLLECTION = "workoutRoutines";

/** Tạo mapping muscleGroups → exerciseIds từ exerciseLibrary */
const pickExercisesForMuscles = (
  allExercises: { id: string; muscleGroups: string[] }[],
  targetSlugs: string[],
  maxCount = 4
) => {
  return allExercises
    .filter((ex) =>
      targetSlugs.some((slug) => ex.muscleGroups?.includes(slug))
    )
    .slice(0, maxCount)
    .map((ex) => ex.id);
};

const ROUTINE_TEMPLATES: Omit<IWorkoutRoutine, "id" | "exerciseIds" | "createdAt"> & {
  targetSlugs: string[];
}[] = [
  {
    name: "Push Day",
    focus: "Chest & Triceps",
    durationMin: 65,
    intensity: "High",
    load: "Progressive",
    muscleGroups: ["chest", "shoulders", "arms"],
    dayOfWeek: [1, 4], // Mon, Thu
    targetSlugs: ["chest", "triceps", "deltoids"],
  },
  {
    name: "Pull Day",
    focus: "Back & Biceps",
    durationMin: 60,
    intensity: "High",
    load: "Progressive",
    muscleGroups: ["back", "arms"],
    dayOfWeek: [2, 5], // Tue, Fri
    targetSlugs: ["upper-back", "lower-back", "trapezius", "biceps"],
  },
  {
    name: "Leg Day",
    focus: "Quads, Hamstrings & Glutes",
    durationMin: 70,
    intensity: "High",
    load: "Progressive",
    muscleGroups: ["legs", "core"],
    dayOfWeek: [3, 6], // Wed, Sat
    targetSlugs: ["quadriceps", "hamstring", "gluteal", "calves"],
  },
];

/**
 * Idempotent — chỉ seed nếu workoutRoutines collection đang rỗng.
 */
export const seedWorkoutRoutines = async (): Promise<void> => {
  // 1. Check nếu đã có routines
  const existingSnap = await getDocs(
    query(collection(db, ROUTINES_COLLECTION), limit(1))
  );
  if (!existingSnap.empty) {
    console.log("[Seed] workoutRoutines already seeded — skipping.");
    return;
  }

  // 2. Load all exercises từ Firestore
  const allExercises = await getAllExercises();
  if (allExercises.length === 0) {
    console.warn(
      "[Seed] exerciseLibrary is empty. Please seed exercises first."
    );
    return;
  }

  // 3. Create routines
  const routinesCol = collection(db, ROUTINES_COLLECTION);
  for (const template of ROUTINE_TEMPLATES) {
    const { targetSlugs, ...rest } = template;
    const exerciseIds = pickExercisesForMuscles(allExercises, targetSlugs, 4);

    if (exerciseIds.length === 0) {
      console.warn(
        `[Seed] No exercises found for "${rest.name}" (slugs: ${targetSlugs.join(", ")})`
      );
    }

    const doc: Omit<IWorkoutRoutine, "id"> = {
      ...rest,
      exerciseIds,
      createdAt: new Date().toISOString(),
    };

    const ref = await addDoc(routinesCol, doc);
    console.log(`[Seed] Created routine "${rest.name}" (id: ${ref.id}) with ${exerciseIds.length} exercises.`);
  }

  console.log("[Seed] Done! 3 workout routines created.");
};
