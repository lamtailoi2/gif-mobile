import ExerciseLibraryList from "@/features/exercise-library/components/exercise-library-list";
import { IExercise } from "@/features/exercise-library/types/exercise";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleExercisePress = (exercise: IExercise) => {
    router.push({
      pathname: "/workout/guide/[id]",
      params: {
        id: exercise.id,
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
