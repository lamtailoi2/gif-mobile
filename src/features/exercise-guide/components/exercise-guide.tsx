import { useDifficultyTone } from "@/hooks/use-difficulty-tone";
import { useTheme } from "@/hooks/use-theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View , Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IExercise } from "@/features/exercise-library/types/exercise";

import { getExerciseGuide } from "../constants/exercise-guides";
import MuscleVisualization from "./muscle-visualization";

interface IExerciseGuideScreenProps {
  exercise: IExercise;
}

export default function ExerciseGuideScreen({
  exercise,
}: IExerciseGuideScreenProps) {
  const theme = useTheme();
  const router = useRouter();

  const guide = getExerciseGuide(exercise.id);

  const difficultyTone = useDifficultyTone(exercise.difficulty);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Back Button */}
      <View className="px-gutter py-stack-sm">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 justify-center items-center rounded-full border bg-surface-container/60 border-surface-variant/25 active:opacity-70"
        >
          <MaterialIcons name="arrow-back" size={22} color={theme.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerClassName="px-gutter pb-stack-lg gap-stack-md"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        {exercise.thumbnailUrl ? (
          <Pressable
            onPress={() => {
              if (exercise.instructionUrl) {
                Linking.openURL(exercise.instructionUrl);
              }
            }}
            className="w-full aspect-video overflow-hidden rounded-xl border border-surface-variant/25 relative"
          >
            <Image
              source={{ uri: exercise.thumbnailUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />

            {/* Play Overlay */}
            <View className="absolute inset-0 items-center justify-center bg-black/30">
              <View className="w-16 h-16 rounded-full bg-black/60 items-center justify-center">
                <MaterialIcons name="play-arrow" size={40} color="white" />
              </View>
            </View>
          </Pressable>
        ) : null}

        {/* Title & Metadata */}
        <View className="gap-3">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1">
              <Text className="text-sm font-bold uppercase tracking-[0.5px] mb-2 text-secondary-container">
                {exercise.category}
              </Text>
              <Text className="text-headline-lg-mobile font-bold text-on-surface">
                {exercise.name}
              </Text>
            </View>
            <View
              className={`px-4 py-2 rounded border ${difficultyTone.bg} ${difficultyTone.border}`}
            >
              <Text
                className={`text-xs font-bold uppercase tracking-[0.5px] ${difficultyTone.text}`}
              >
                {exercise.difficulty}
              </Text>
            </View>
          </View>

          <Text className="text-body-md text-on-surface-variant">
            {exercise.muscleGroups.join(", ") || "—"}
          </Text>
        </View>

        {/* Equipment & Stats */}
        <View className="flex-row gap-2">
          <View className="flex-1 gap-1.5 rounded-lg border p-3 bg-surface-container/60 border-surface-variant/25">
            <Text className="text-[10px] font-bold uppercase tracking-[0.5px] text-on-surface-variant">
              Equipment
            </Text>
            <Text className="text-body-md font-medium text-on-surface">
              {Array.isArray(exercise.equipment)
                ? exercise.equipment.join(", ")
                : exercise.equipment || "Bodyweight"}
            </Text>
          </View>
          <View className="flex-1 gap-1.5 rounded-lg border p-3 bg-surface-container/60 border-surface-variant/25">
            <Text className="text-[10px] font-bold uppercase tracking-[0.5px] text-on-surface-variant">
              Sets
            </Text>
            <Text className="text-stat-value font-bold text-primary-fixed-dim">
              {exercise.defaultSets}
            </Text>
          </View>
          <View className="flex-1 gap-1.5 rounded-lg border p-3 bg-surface-container/60 border-surface-variant/25">
            <Text className="text-[10px] font-bold uppercase tracking-[0.5px] text-on-surface-variant">
              Reps
            </Text>
            <Text className="text-stat-value font-bold text-primary-fixed-dim">
              {exercise.defaultReps}
            </Text>
          </View>
        </View>

        {/* Muscle Visualization */}
        {guide && (
          <MuscleVisualization
            primaryMuscles={guide.primaryMuscles}
            secondaryMuscles={guide.secondaryMuscles}
          />
        )}

        {/* Execution Guide */}
        {guide && (
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="format-list-numbered"
                size={24}
                color="#abd600"
              />
              <Text className="text-headline-md font-bold text-on-surface">
                Execution Guide
              </Text>
            </View>

            <View className="gap-2">
              {guide.executionSteps.map((step) => (
                <View
                  key={step.step}
                  className="glass-card rounded-xl overflow-hidden bg-surface-container/40 border border-white/10"
                >
                  <View className="p-4 gap-2">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-label-caps text-primary-fixed-dim font-bold">
                        {String(step.step).padStart(2, "0")}
                      </Text>
                      <Text className="text-body-md font-bold text-on-surface flex-1">
                        {step.title}
                      </Text>
                    </View>
                    <Text className="text-body-md text-on-surface-variant ml-8">
                      {step.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Common Mistakes */}
        {guide && (
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="warning" size={24} color="#ffb4ab" />
              <Text className="text-headline-md font-bold text-on-surface">
                Avoid These Mistakes
              </Text>
            </View>

            <View className="gap-2">
              {guide.mistakes.map((mistake, idx) => (
                <View
                  key={idx}
                  className="glass-card p-4 rounded-xl border-l-4 border-l-primary-fixed-dim/50 bg-surface-container/40 border border-white/10 flex-row gap-3"
                >
                  <MaterialIcons
                    name={
                      mistake.icon === "priority_high"
                        ? "priority-high"
                        : "close"
                    }
                    size={20}
                    color={
                      mistake.icon === "priority_high" ? "#ff9800" : "#ffb4ab"
                    }
                  />
                  <View className="flex-1">
                    <Text className="text-body-md font-bold text-on-surface">
                      {mistake.title}
                    </Text>
                    <Text className="text-body-md text-on-surface-variant mt-1">
                      {mistake.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Exercise Alternatives */}
        {guide && (
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="swap-horiz" size={24} color="#adc6ff" />
              <Text className="text-headline-md font-bold text-on-surface">
                Alternatives
              </Text>
            </View>

            <View className="gap-2">
              {guide.alternatives.map((alt, idx) => (
                <View
                  key={idx}
                  className="glass-card p-4 rounded-xl gap-2 bg-surface-container/40 border border-white/10"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-body-md font-bold text-on-surface flex-1">
                      {alt.name}
                    </Text>
                    <View
                      className={`px-3 py-1.5 rounded-full border ${
                        alt.type === "easier"
                          ? "bg-[#abd600] border-[#d4ff5e]"
                          : alt.type === "harder"
                            ? "bg-[#ff5252] border-[#f8a80]"
                            : "bg-[#4b8eff] border-[#82b1ff]"
                      }`}
                    >
                      <Text
                        className={`text-[11px] font-black uppercase tracking-widest ${
                          alt.type === "easier"
                            ? "text-[#283500]"
                            : "text-white"
                        }`}
                      >
                        {alt.type}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-body-md text-on-surface-variant">
                    {alt.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
