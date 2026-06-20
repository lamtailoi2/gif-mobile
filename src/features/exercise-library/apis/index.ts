import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query, where, type QueryConstraint } from "firebase/firestore";
import { IExercise } from "../types/exercise";
import { EXERCISE_LIBRARY_COLLECTION } from "@/constants/collections";
import { DIFFICULTY_OPTIONS } from "../constants/filter-constants";

const DIFFICULTY_RANK = Object.fromEntries(
  DIFFICULTY_OPTIONS.map((level, i) => [level, i]),
);

const mapDocs = (snapshot: Awaited<ReturnType<typeof getDocs>>): IExercise[] =>
  snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<IExercise, "id">),
    }))
    .sort((a, b) => (DIFFICULTY_RANK[a.difficulty] ?? 0) - (DIFFICULTY_RANK[b.difficulty] ?? 0));

export const getAllExercises = async (): Promise<IExercise[]> => {
  try {
    const q = query(collection(db, EXERCISE_LIBRARY_COLLECTION));
    return mapDocs(await getDocs(q));
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

/** Fetch exercises matching any of the given categories, sorted by difficulty. */
export const getExercisesByCategories = async (
  categories: string[],
  maxCount?: number,
): Promise<IExercise[]> => {
  if (categories.length === 0) return [];
  try {
    const constraints: QueryConstraint[] = [where("category", "in", categories)];
    if (maxCount) constraints.push(limit(maxCount));
    return mapDocs(await getDocs(query(collection(db, EXERCISE_LIBRARY_COLLECTION), ...constraints)));
  } catch (error) {
    console.error(`Error fetching exercises for categories ${categories}:`, error);
    return [];
  }
};

export const getExerciseByCategory = (category: string): Promise<IExercise[]> =>
  getExercisesByCategories([category]);
