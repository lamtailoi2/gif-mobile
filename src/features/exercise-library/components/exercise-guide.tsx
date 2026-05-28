import { useTheme } from "@/hooks/use-theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IExercise } from "../types/exercise";

interface IExerciseGuideProps {
  exercise: IExercise;
}

export default function ExerciseGuide({ exercise }: IExerciseGuideProps) {
  const theme = useTheme();
  const router = useRouter();

  const difficultyTone =
    exercise.difficulty === "Advanced"
      ? {
          bg: "bg-error/[0.13]",
          border: "border-error/40",
          text: "text-error",
        }
      : exercise.difficulty === "Intermediate"
        ? {
            bg: "bg-outline-variant/[0.13]",
            border: "border-outline-variant/40",
            text: "text-on-surface-variant",
          }
        : {
            bg: "bg-primary-fixed-dim/[0.13]",
            border: "border-primary-fixed-dim/40",
            text: "text-primary-fixed-dim",
          };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-container-mobile py-stack-sm">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 justify-center items-center rounded-full border bg-surface-container/60 border-surface-variant/25 active:opacity-70"
        >
          <MaterialIcons name="arrow-back" size={22} color={theme.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerClassName="px-container-mobile pb-stack-lg gap-gutter"
        showsVerticalScrollIndicator={false}
      >
        {exercise.thumbnailUrl ? (
          <View className="w-full aspect-[16/10] overflow-hidden rounded-xl border border-surface-variant/25">
            <Image
              source={{ uri: exercise.thumbnailUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        ) : null}

        <Text className="text-[11px] font-bold uppercase tracking-[0.6px] mt-stack-sm text-secondary-container">
          {exercise.category}
        </Text>

        <Text className="text-[28px] font-bold leading-[34px] text-on-surface">
          {exercise.name}
        </Text>

        <View className="flex-row gap-2">
          <View
            className={`px-2.5 py-1 rounded border ${difficultyTone.bg} ${difficultyTone.border}`}
          >
            <Text
              className={`text-[10px] font-bold uppercase tracking-[0.5px] ${difficultyTone.text}`}
            >
              {exercise.difficulty}
            </Text>
          </View>
        </View>

        <View className="gap-1.5 rounded-lg border p-stack-md bg-surface-container/60 border-surface-variant/25">
          <Text className="text-[11px] font-bold uppercase tracking-[0.5px] text-on-surface-variant">
            Muscle Groups
          </Text>
          <Text className="text-[15px] font-medium text-on-surface">
            {exercise.muscleGroups.join(", ") || "—"}
          </Text>
        </View>

        <View className="gap-1.5 rounded-lg border p-stack-md bg-surface-container/60 border-surface-variant/25">
          <Text className="text-[11px] font-bold uppercase tracking-[0.5px] text-on-surface-variant">
            Equipment
          </Text>
          <Text className="text-[15px] font-medium text-on-surface">
            {exercise.equipment.join(", ") || "Bodyweight"}
          </Text>
        </View>

        <View className="flex-row gap-gutter">
          <View className="flex-1 items-start gap-1.5 rounded-lg border p-stack-md bg-surface-container/60 border-surface-variant/25">
            <Text className="text-[11px] font-bold uppercase tracking-[0.5px] text-on-surface-variant">
              Sets
            </Text>
            <Text className="text-[28px] font-bold text-on-surface">
              {exercise.defaultSets}
            </Text>
          </View>

          <View className="flex-1 items-start gap-1.5 rounded-lg border p-stack-md bg-surface-container/60 border-surface-variant/25">
            <Text className="text-[11px] font-bold uppercase tracking-[0.5px] text-on-surface-variant">
              Reps
            </Text>
            <Text className="text-[28px] font-bold text-on-surface">
              {exercise.defaultReps}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
