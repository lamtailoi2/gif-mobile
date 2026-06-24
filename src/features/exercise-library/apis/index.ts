import { offlineCache } from "@/lib/offline-cache";
import { isOnline } from "@/hooks/use-network";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query, where, type QueryConstraint } from "firebase/firestore";
import { IExercise } from "../types/exercise";
import { EXERCISE_LIBRARY_COLLECTION } from "@/constants/collections";
import { DIFFICULTY_OPTIONS } from "../constants/filter-constants";

const EXERCISE_CACHE_KEY = "offline:exercise_library";

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
    if (!(await isOnline())) {
      const cached = await offlineCache.get<IExercise[]>(EXERCISE_CACHE_KEY);
      if (cached) return cached;
    }
    const q = query(collection(db, EXERCISE_LIBRARY_COLLECTION));
    const exercises = mapDocs(await getDocs(q));
    await offlineCache.set(EXERCISE_CACHE_KEY, exercises);
    return exercises;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    const cached = await offlineCache.get<IExercise[]>(EXERCISE_CACHE_KEY);
    return cached ?? [];
  }
};

/** Fetch exercises matching any of the given categories, sorted by difficulty. */
export const getExercisesByCategories = async (
  categories: string[],
  maxCount?: number,
): Promise<IExercise[]> => {
  if (categories.length === 0) return [];
  try {
    if (!(await isOnline())) {
      const allCached = await offlineCache.get<IExercise[]>(EXERCISE_CACHE_KEY);
      if (allCached) {
        let filtered = allCached.filter((e) => categories.includes(e.category));
        if (maxCount) filtered = filtered.slice(0, maxCount);
        return filtered;
      }
    }
    const constraints: QueryConstraint[] = [where("category", "in", categories)];
    if (maxCount) constraints.push(limit(maxCount));
    const exercises = mapDocs(await getDocs(query(collection(db, EXERCISE_LIBRARY_COLLECTION), ...constraints)));
    const all = await offlineCache.get<IExercise[]>(EXERCISE_CACHE_KEY);
    if (all) {
      const merged = [...exercises];
      for (const ex of all) {
        if (!merged.find((m) => m.id === ex.id)) merged.push(ex);
      }
      await offlineCache.set(EXERCISE_CACHE_KEY, merged);
    } else {
      await offlineCache.set(EXERCISE_CACHE_KEY, exercises);
    }
    return exercises;
  } catch (error) {
    console.error(`Error fetching exercises for categories ${categories}:`, error);
    const allCached = await offlineCache.get<IExercise[]>(EXERCISE_CACHE_KEY);
    if (allCached) {
      let filtered = allCached.filter((e) => categories.includes(e.category));
      if (maxCount) filtered = filtered.slice(0, maxCount);
      return filtered;
    }
    return [];
  }
};

export const getExerciseByCategory = (category: string): Promise<IExercise[]> =>
  getExercisesByCategories([category]);
