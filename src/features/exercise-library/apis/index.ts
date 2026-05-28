import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { IExercise } from "../types/exercise";

const EXCERCISE_LIBRARY_COLLECTION = "exerciseLibrary";

export const getAllExercises = async (): Promise<IExercise[]> => {
  try {
    const exercisesRef = collection(db, EXCERCISE_LIBRARY_COLLECTION);

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
    const exercisesRef = collection(db, EXCERCISE_LIBRARY_COLLECTION);
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
