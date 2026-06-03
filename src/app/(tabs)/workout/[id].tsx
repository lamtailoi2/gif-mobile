import { IExercise } from "@/features/exercise-library/types/exercise";
import { useLocalSearchParams } from "expo-router";

// Helper function để parse arrays an toàn
function safeParseArray(value: any): string[] {
  if (!value) return [];

  // Nếu đã là array
  if (Array.isArray(value)) return value;

  // Nếu là string
  if (typeof value === "string") {
    // Thử parse JSON
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      // Nếu không phải JSON, trả về string đó trong array
      return [value];
    }
  }

  return [];
}

export default function ExerciseDetailsScreen() {
  const params = useLocalSearchParams();

  try {
    const exercise: IExercise = {
      id: params.id as string,
      name: params.name as string,
      slug: (params.slug as string) || "",
      category: params.category as string,
      muscleGroups: safeParseArray(params.muscleGroups),
      equipment: safeParseArray(params.equipment),
      difficulty: params.difficulty as string,
      thumbnailUrl: params.thumbnailUrl as string,
      defaultSets: parseInt(params.defaultSets as string, 10) || 3,
      defaultReps: parseInt(params.defaultReps as string, 10) || 10,
    };

    // return <ExerciseGuide exercise={exercise} />;
  } catch (error) {
    console.error("Error parsing exercise params:", error);
    console.error("Params received:", params);
    return null;
  }
}
