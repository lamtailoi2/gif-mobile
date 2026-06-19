import React, { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/use-theme";
import { IWorkoutPlanResponse } from "../types";
import { IExercise } from "@/features/exercise-library/types/exercise";
import AiExerciseCard from "./ai-exercise-card";

interface IAiScheduleDisplayProps {
  plan: IWorkoutPlanResponse;
  exerciseLibrary: IExercise[];
  onExercisePress?: (exercise: IExercise) => void;
  onRecreatePress?: () => void;
  loading?: boolean;
}

export default function AiScheduleDisplay({
  plan,
  exerciseLibrary,
  onExercisePress,
  onRecreatePress,
  loading = false,
}: IAiScheduleDisplayProps) {
  const theme = useTheme();
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    return (plan.currentPlanIndex || 0) % (plan.schedule.length || 1);
  });
  const [showAssessment, setShowAssessment] = useState(true);

  if (!plan.schedule || plan.schedule.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-on-surface text-center">No valid workout plan found.</Text>
      </View>
    );
  }

  const currentDaySchedule = plan.schedule[selectedDayIndex] || plan.schedule[0];

  return (
    <ScrollView 
      className="flex-1"
      contentContainerClassName="pb-[140px]"
      showsVerticalScrollIndicator={false}
    >
      {/* AI Coach Assessment Header Card */}
      {plan.userAssessment && (
        <View className="mx-gutter mt-4 mb-6 rounded-2xl border bg-surface-container/40 border-surface-variant/20 overflow-hidden">
          <Pressable 
            onPress={() => setShowAssessment(!showAssessment)}
            className="flex-row justify-between items-center p-4 bg-surface-container/60 border-b border-surface-variant/10"
          >
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-full bg-[#4b8eff]/10 items-center justify-center border border-[#4b8eff]/35">
                <MaterialIcons name="psychology" size={18} color="#4b8eff" />
              </View>
              <Text className="font-display font-bold text-on-surface text-sm">
                🧠 AI Coach Assessment
              </Text>
            </View>
            <MaterialIcons 
              name={showAssessment ? "expand-less" : "expand-more"} 
              size={20} 
              color={theme.onSurfaceVariant} 
            />
          </Pressable>
          
          {showAssessment && (
            <View className="p-4 bg-surface-container/20">
              <Text className="font-body text-sm leading-6 text-on-surface-variant">
                {typeof plan.userAssessment === 'string' 
                  ? plan.userAssessment 
                  : "Here is your personalized workout plan."}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Horizontal Day Selector tabs */}
      <View className="mb-4">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-gutter gap-2.5"
        >
          {plan.schedule.map((dayPlan, index) => {
            const isSelected = index === selectedDayIndex;
            return (
              <Pressable
                key={index}
                onPress={() => setSelectedDayIndex(index)}
                className={`py-2 px-4 rounded-full border ${
                  isSelected 
                    ? "bg-[#abd600] border-[#abd600]" 
                    : "bg-surface-container/60 border-surface-variant/20"
                }`}
              >
                <Text 
                  className={`font-body text-xs font-bold ${
                    isSelected ? "text-[#283500]" : "text-on-surface-variant"
                  }`}
                >
                  {dayPlan.day}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Focus Area title */}
      <View className="mx-gutter mb-4 bg-surface-container/30 border border-surface-variant/15 p-4 rounded-xl flex-row items-center gap-2.5">
        <MaterialIcons name="fitness-center" size={20} color="#4b8eff" />
        <View className="flex-1">
          <Text className="font-body text-[10px] uppercase tracking-[0.5px] text-[#4b8eff] font-bold">
            Session Focus
          </Text>
          <Text className="font-display text-base font-bold text-on-surface mt-0.5">
            {currentDaySchedule.focus}
          </Text>
        </View>
      </View>

      {/* Exercise list for active day */}
      <View className="px-gutter">
        {currentDaySchedule.exercises.map((item, idx) => {
          const fullExercise = exerciseLibrary.find((e) => e.id === item.exerciseId);
          const exerciseToRender: IExercise = fullExercise ?? {
            id: item.exerciseId,
            name: item.exerciseName,
            category: "strength",
            difficulty: "Beginner",
            equipment: "None",
            muscleGroups: [],
            defaultSets: item.sets,
            defaultReps: item.reps,
          };
          
          return (
            <AiExerciseCard
              key={idx}
              exercise={exerciseToRender}
              sets={item.sets}
              reps={item.reps}
              onPress={onExercisePress}
            />
          );
        })}
      </View>

      {/* Recreate Button */}
      {onRecreatePress && (
        <View className="mx-gutter mt-6">
          <Pressable
            onPress={onRecreatePress}
            disabled={loading}
            className="flex-row items-center justify-center gap-2 py-3 px-6 rounded-full border border-[#4b8eff]/40 bg-transparent active:opacity-75"
          >
            <MaterialIcons name="refresh" size={18} color="#4b8eff" />
            <Text className="font-body text-sm font-semibold text-[#4b8eff]">
              Regenerate AI Plan
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
