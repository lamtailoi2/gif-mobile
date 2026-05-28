import ExerciseLibraryList from "@/features/exercise-library/components/ExerciseLibraryList";
import { useTheme } from "@/hooks/use-theme";
import { Exercise } from "@/types/common";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleExercisePress = (exercise: Exercise) => {
    router.push({
      pathname: "../(tabs)/workout/[id]",
      params: {
        id: exercise.id,
        name: exercise.name,
        slug: exercise.slug || "",
        category: exercise.category,
        difficulty: exercise.difficulty,
        muscleGroups: JSON.stringify(exercise.muscleGroups),
        equipment: JSON.stringify(exercise.equipment),
        defaultReps: String(exercise.defaultReps),
        thumbnailUrl: exercise.thumbnailUrl || "",
      },
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ExerciseLibraryList onExercisePress={handleExercisePress} />
    </SafeAreaView>
  );
}
