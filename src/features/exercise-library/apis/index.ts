import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query, where, type QueryConstraint } from "firebase/firestore";
import { IExercise } from "../types/exercise";
import { EXERCISE_LIBRARY_COLLECTION } from "@/constants/collections";

export const getAllExercises = async (): Promise<IExercise[]> => {
  try {
    const exercisesRef = collection(db, EXERCISE_LIBRARY_COLLECTION);

    const snapshot = await getDocs(exercisesRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IExercise, "id">),
    }));
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

export const getExerciseByCategory = async (
  category: string,
): Promise<IExercise[]> => {
  try {
    const exercisesRef = collection(db, EXERCISE_LIBRARY_COLLECTION);
    const q = query(exercisesRef, where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IExercise, "id">),
    }));
  } catch (error) {
    console.error(`Error fetching exercises for category ${category}:`, error);
    return [];
  }
};

/** Fetch exercises matching any of the given categories, with optional limit. */
export const getExercisesByCategories = async (
  categories: string[],
  maxCount?: number,
): Promise<IExercise[]> => {
  if (categories.length === 0) return [];
  try {
    const exercisesRef = collection(db, EXERCISE_LIBRARY_COLLECTION);
    const constraints: QueryConstraint[] = [where("category", "in", categories)];
    if (maxCount) constraints.push(limit(maxCount));
    const snapshot = await getDocs(query(exercisesRef, ...constraints));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IExercise, "id">),
    }));
  } catch (error) {
    console.error(`Error fetching exercises for categories ${categories}:`, error);
    return [];
  }
};
