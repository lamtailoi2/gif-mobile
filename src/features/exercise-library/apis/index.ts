import { db } from "@/lib/firebase";
import { Exercise } from "@/types/common";
import { collection, getDocs, query, where } from "firebase/firestore";

const EXCERCISE_LIBRARY_COLLECTION = "exerciseLibrary";

export const getAllExercises = async (): Promise<Exercise[]> => {
  try {
    const exercisesRef = collection(db, EXCERCISE_LIBRARY_COLLECTION);

    const snapshot = await getDocs(exercisesRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Exercise, "id">),
    }));
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return [];
  }
};

export const getExerciseByCategory = async (
  category: string,
): Promise<Exercise[]> => {
  try {
    const exercisesRef = collection(db, EXCERCISE_LIBRARY_COLLECTION);
    const q = query(exercisesRef, where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Exercise, "id">),
    }));
  } catch (error) {
    console.error(`Error fetching exercises for category ${category}:`, error);
    return [];
  }
};
