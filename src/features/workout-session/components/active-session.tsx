import AppHeader from "@/components/app-header";
import { useRoutineWithExercises } from "@/features/workout-session/hooks/use-routine-with-exercises";
import { useWorkoutSessionStore } from "@/features/workout-session/store/use-workout-session-store";
import { useGetLatestLogs } from "@/features/history/queries/use-get-latest-logs";
import { useUser } from "@clerk/expo";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_REST_TIME = 105; // 1:45 mặc định

interface IActiveSessionProps {
  routineId: string;
}

export default function ActiveSession({ routineId }: IActiveSessionProps) {
  const router = useRouter();
  const { user } = useUser();

  // Queries
  const { data: routineData, isLoading: isRoutineLoading, isError: isRoutineError } = useRoutineWithExercises(routineId);
  const { data: historyLogs, isLoading: isHistoryLoading } = useGetLatestLogs();

  // Zustand Store
  const {
    routine,
    uiExercises,
    startSession,
    toggleSetComplete,
    updateSet,
    addSet,
  } = useWorkoutSessionStore();

  const sessionStartedRef = useRef(false);

  useEffect(() => {
    // Chỉ startSession khi load xong routine và history
    if (routineData && !isHistoryLoading && !sessionStartedRef.current) {
      startSession(routineData.routine, routineData.exercises, historyLogs || []);
      sessionStartedRef.current = true;
    }
  }, [routineData, isHistoryLoading, historyLogs, startSession]);

  // Global Rest Timer State
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      intervalId = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTimerRunning, timeLeft]);

  const handleToggleSet = (exerciseId: string, setId: string, currentlyCompleted: boolean) => {
    toggleSetComplete(exerciseId, setId);
    if (!currentlyCompleted) {
      // Nếu vừa mới check hoàn thành -> Bật timer
      setTimeLeft(MAX_REST_TIME);
      setIsTimerRunning(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (isRoutineLoading || isHistoryLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#abd600" />
        <Text className="font-mono text-label-caps text-on-surface-variant/40 mt-4 tracking-widest">
          LOADING SESSION...
        </Text>
      </SafeAreaView>
    );
  }

  if (!routineId || isRoutineError || !routineData) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-container-mobile">
        <MaterialIcons name="error-outline" size={48} color="#ffb4ab" />
        <Text className="font-display text-body-lg font-bold text-error mt-4 text-center">
          {!routineId ? "No routine selected" : "Could not load workout"}
        </Text>
        <Text className="font-body text-body-md text-on-surface-variant/60 mt-2 text-center">
          {!routineId
            ? "Go back and select a routine to start."
            : "Check your connection and try again."}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 rounded-xl bg-surface-container border border-surface-variant/20 active:opacity-70"
        >
          <Text className="font-display text-body-md font-bold text-on-surface">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (uiExercises.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#abd600" />
        <Text className="font-mono text-label-caps text-on-surface-variant/40 mt-4 tracking-widest">
          PREPARING UI...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <AppHeader avatarUrl={user?.imageUrl} />

      <ScrollView contentContainerClassName="px-container-mobile pt-stack-sm pb-32 gap-6" showsVerticalScrollIndicator={false}>
        {/* Routine Header */}
        <View className="mb-2">
          <Text className="font-display text-headline-md font-bold text-on-surface">
            {routine?.name}
          </Text>
          <Text className="font-body text-body-md text-on-surface-variant/60 mt-1">
            {routine?.focus} • {uiExercises.length} Exercises
          </Text>
        </View>

        {/* Exercise Cards */}
        {uiExercises.map((exercise, index) => (
          <View key={exercise.exerciseId} className="bg-surface-container/40 border border-surface-variant/20 rounded-2xl overflow-hidden shadow-sm">
            {/* Exercise Header */}
            <View className="px-4 py-3 bg-surface-container-high/50 flex-row items-center justify-between">
              <Text className="font-display text-body-lg font-bold text-neon-green">
                {index + 1}. {exercise.exerciseName}
              </Text>
              <Pressable className="p-1 active:opacity-50">
                <MaterialCommunityIcons name="dots-horizontal" size={20} color="#e5e2e1" />
              </Pressable>
            </View>

            {/* Sets Header */}
            <View className="flex-row items-center px-4 py-2 border-b border-surface-variant/10">
              <Text className="font-mono text-[10px] text-on-surface-variant/50 w-8 text-center">SET</Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 flex-1 ml-2">PREVIOUS</Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 w-16 text-center">LBS</Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 w-16 text-center ml-2">REPS</Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 w-10 text-center ml-2">✓</Text>
            </View>

            {/* Sets List */}
            {exercise.sets.map((set, setIndex) => (
              <View
                key={set.id}
                className={`flex-row items-center px-4 py-3 border-b border-surface-variant/5 ${
                  set.isCompleted ? "bg-surface-container-high/30 opacity-70" : ""
                }`}
              >
                {/* Set Number */}
                <View className="w-8 items-center justify-center">
                  <View className={`w-6 h-6 rounded-md items-center justify-center ${set.isCompleted ? "bg-neon-green/20" : "bg-surface-variant/20"}`}>
                    <Text className={`font-mono text-label-caps ${set.isCompleted ? "text-neon-green" : "text-on-surface-variant"}`}>
                      {setIndex + 1}
                    </Text>
                  </View>
                </View>

                {/* Previous */}
                <View className="flex-1 ml-2 justify-center">
                  <Text className="font-mono text-[11px] text-on-surface-variant/50">
                    {set.previousWeight && set.previousReps
                      ? `${set.previousWeight} lbs × ${set.previousReps}`
                      : "-"}
                  </Text>
                </View>

                {/* Weight Input */}
                <View className="w-16 bg-surface-container-high rounded-lg overflow-hidden border border-surface-variant/20">
                  <TextInput
                    keyboardType="numeric"
                    value={set.weight.toString()}
                    onChangeText={(val) => updateSet(exercise.exerciseId, set.id, "weight", Number(val))}
                    className="font-display text-body-lg font-bold text-center text-on-surface py-1.5"
                    editable={!set.isCompleted}
                    selectTextOnFocus
                  />
                </View>

                {/* Reps Input */}
                <View className="w-16 bg-surface-container-high rounded-lg overflow-hidden border border-surface-variant/20 ml-2">
                  <TextInput
                    keyboardType="numeric"
                    value={set.reps.toString()}
                    onChangeText={(val) => updateSet(exercise.exerciseId, set.id, "reps", Number(val))}
                    className="font-display text-body-lg font-bold text-center text-on-surface py-1.5"
                    editable={!set.isCompleted}
                    selectTextOnFocus
                  />
                </View>

                {/* Checkbox */}
                <View className="w-10 items-end justify-center ml-2">
                  <Pressable
                    onPress={() => handleToggleSet(exercise.exerciseId, set.id, set.isCompleted)}
                    className={`w-8 h-8 rounded-lg items-center justify-center border active:scale-95 ${
                      set.isCompleted
                        ? "bg-neon-green border-neon-green"
                        : "bg-surface-container-high border-surface-variant/30"
                    }`}
                  >
                    <MaterialIcons
                      name="check"
                      size={18}
                      color={set.isCompleted ? "#0e0e0f" : "transparent"}
                    />
                  </Pressable>
                </View>
              </View>
            ))}

            {/* Add Set Button */}
            <Pressable
              onPress={() => addSet(exercise.exerciseId)}
              className="py-3 items-center justify-center active:bg-surface-container-high/50"
            >
              <Text className="font-mono text-[12px] text-neon-green uppercase tracking-widest font-bold">
                + Add Set
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface border-t border-surface-variant/20 px-container-mobile py-4 flex-row items-center justify-between" style={{ paddingBottom: 32 }}>
        {/* Rest Timer Toggle */}
        <Pressable
          onPress={() => {
            if (timeLeft > 0) setIsTimerRunning(!isTimerRunning);
          }}
          onLongPress={() => {
            setTimeLeft(0);
            setIsTimerRunning(false);
          }}
          className={`px-4 py-3 rounded-xl border flex-row items-center gap-2 active:opacity-70 ${
            timeLeft > 0 ? "bg-electric-blue/10 border-electric-blue/30" : "bg-surface-container border-surface-variant/20"
          }`}
        >
          <MaterialCommunityIcons
            name={timeLeft > 0 ? "timer-outline" : "timer-off-outline"}
            size={20}
            color={timeLeft > 0 ? "#4b8eff" : "#a3a1a0"}
          />
          <Text
            className={`font-mono text-label-caps tracking-widest font-bold ${
              timeLeft > 0 ? "text-electric-blue" : "text-on-surface-variant"
            }`}
          >
            {timeLeft > 0 ? formatTime(timeLeft) : "REST"}
          </Text>
        </Pressable>

        {/* Finish Button */}
        <Pressable
          onPress={() => router.push("/(tabs)/workout/session-complete")}
          className="flex-1 ml-4 bg-neon-green rounded-xl py-3 items-center justify-center flex-row gap-2 active:opacity-85"
        >
          <Text className="font-display text-body-md font-bold text-background">Finish</Text>
          <MaterialIcons name="done-all" size={18} color="#0e0e0f" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
