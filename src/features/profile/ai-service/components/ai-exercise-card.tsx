import { useTheme } from "@/hooks/use-theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { IExercise } from "@/features/exercise-library/types/exercise";

interface IAiExerciseCardProps {
  exercise: IExercise;
  sets: number;
  reps: number;
  onPress?: (exercise: IExercise) => void;
}

export default function AiExerciseCard({ exercise, sets, reps, onPress }: IAiExerciseCardProps) {
  const theme = useTheme();

  const equipmentText = Array.isArray(exercise.equipment)
    ? exercise.equipment.join(", ")
    : exercise.equipment || "Equipment";

  const difficultyTone =
    exercise.difficulty === "Advanced"
      ? {
          bg: "bg-error/20",
          border: "border-error/40",
          text: "text-error",
        }
      : exercise.difficulty === "Intermediate"
        ? {
            bg: "bg-outline-variant/20",
            border: "border-outline-variant/40",
            text: "text-on-surface-variant",
          }
        : {
            bg: "bg-primary-fixed-dim/20",
            border: "border-primary-fixed-dim/40",
            text: "text-primary-fixed-dim",
          };

  return (
    <Pressable
      onPress={() => onPress?.(exercise)}
      className="active:opacity-90 active:scale-[0.98] mb-gutter"
    >
      <View className="flex-row overflow-hidden rounded-xl border bg-surface-container/60 border-surface-variant/25">
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
            <View className="flex-row justify-between items-center mr-2">
              <Text className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#4b8eff]">
                {exercise.category}
              </Text>
            </View>

            <Text className="text-[15px] font-bold mb-0.5 text-on-surface">
              {exercise.name}
            </Text>

            <Text className="text-xs mb-2 text-on-surface-variant">
              {exercise.muscleGroups.join(", ")}
            </Text>

            <View className="flex-row items-center gap-4">
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

              {/* AI Recommended Sets x Reps Badge */}
              <View className="flex-row items-center gap-1 bg-[#abd600]/10 px-2 py-0.5 rounded-full border border-[#abd600]/30">
                <MaterialIcons
                  name="psychology"
                  size={12}
                  color="#abd600"
                />
                <Text className="text-[10px] font-bold text-[#abd600]">
                  AI: {sets}x{reps}
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
