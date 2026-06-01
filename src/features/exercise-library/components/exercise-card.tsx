import { useDifficultyTone } from "@/hooks/use-difficulty-tone";
import { useTheme } from "@/hooks/use-theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { IExercise } from "../types/exercise";

interface IExerciseCardProps {
  exercise: IExercise;
  onPress?: (exercise: IExercise) => void;
}

export default function ExerciseCard({
  exercise,
  onPress,
}: IExerciseCardProps) {
  const theme = useTheme();

  const equipmentText = Array.isArray(exercise.equipment)
    ? exercise.equipment.join(", ")
    : exercise.equipment || "Equipment";

  const difficultyTone = useDifficultyTone(exercise.difficulty);

  return (
    <Pressable
      onPress={() => onPress?.(exercise)}
      className="active:opacity-90 active:scale-[0.98]"
    >
      <View className="flex-row overflow-hidden rounded-xl border mb-gutter bg-surface-container/60 border-surface-variant/25">
        {exercise.thumbnailUrl && (
          <View className="w-[100px] h-[100px] shrink-0 overflow-hidden border-r border-surface-variant/25">
            <Image
              source={{ uri: exercise.thumbnailUrl }}
              className="w-full h-full"
            />
          </View>
        )}

        <View className="flex-1 flex-row items-start gap-gutter p-stack-md">
          <View className="flex-1 gap-1">
            <Text className="text-[10px] font-bold uppercase tracking-[0.5px] mb-0.5 text-secondary-container">
              {exercise.category}
            </Text>

            <Text className="text-[15px] font-bold mb-0.5 text-on-surface">
              {exercise.name}
            </Text>

            <Text className="text-xs mb-2 text-on-surface-variant">
              {exercise.muscleGroups.join(", ")}
            </Text>

            <View className="flex-row gap-gutter">
              <View className="flex-row items-center gap-1">
                <MaterialIcons
                  name="fitness-center"
                  size={14}
                  color={theme.onSurfaceVariant}
                />
                <Text className="text-[11px] font-medium text-on-surface-variant">
                  {equipmentText}
                </Text>
              </View>

              <View className="flex-row items-center gap-1">
                <MaterialIcons
                  name="schedule"
                  size={14}
                  color={theme.onSurfaceVariant}
                />
                <Text className="text-[11px] font-medium text-on-surface-variant">
                  {exercise.defaultReps} reps
                </Text>
              </View>
            </View>
          </View>

          <View className="items-end justify-start gap-2">
            <View
              className={`px-2 py-1 rounded border ${difficultyTone.bg} ${difficultyTone.border}`}
            >
              <Text
                className={`text-[9px] font-bold uppercase tracking-[0.5px] ${difficultyTone.text}`}
              >
                {exercise.difficulty}
              </Text>
            </View>

            <MaterialIcons
              name="chevron-right"
              size={20}
              color={theme.onSurfaceVariant}
              style={{ opacity: 0.5 }}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
