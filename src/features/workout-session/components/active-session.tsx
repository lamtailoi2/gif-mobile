import AppHeader from "@/components/app-header";
import { isTimeBasedExercise } from "@/features/workout-session/utils/exercise-type";
import { useRoutineWithExercises } from "@/features/workout-session/hooks/use-routine-with-exercises";
import { useWorkoutSessionStore } from "@/features/workout-session/store/use-workout-session-store";
import { useGetLatestLogs } from "@/features/history/queries/use-get-latest-logs";
import { useUser } from "@clerk/expo";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";

// Constants
const PREPARE_TIME = 10;
const REST_TIME = 30;

interface IActiveSessionProps {
  routineId: string;
}

export default function ActiveSession({ routineId }: IActiveSessionProps) {
  useKeepAwake(); // Keep screen awake
  const router = useRouter();
  const { user } = useUser();

  const { data: routineData, isLoading: isRoutineLoading, isError: isRoutineError } = useRoutineWithExercises(routineId);
  const { data: historyLogs, isLoading: isHistoryLoading } = useGetLatestLogs();

  const {
    exercises,
    uiExercises,
    sessionState,
    currentExerciseIndex,
    currentSetIndex,
    startSession,
    startWorkout,
    completeCurrentSet,
    skipRest,
    updateSet,
  } = useWorkoutSessionStore();

  const sessionStartedRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState(PREPARE_TIME);
  const [exerciseTimeLeft, setExerciseTimeLeft] = useState(0);
  const [isExerciseTimerRunning, setIsExerciseTimerRunning] = useState(false);

  // Initialize Session
  useEffect(() => {
    if (routineData && !isHistoryLoading && !sessionStartedRef.current) {
      startSession(routineData.routine, routineData.exercises, historyLogs || []);
      sessionStartedRef.current = true;
    }
  }, [routineData, isHistoryLoading, historyLogs, startSession]);

  // Reset timer when state changes
  useEffect(() => {
    if (sessionState === "COMPLETED") {
      router.replace("/(tabs)/workout/session-complete");
      return;
    }

    if (sessionState === "PREPARING") {
      setTimeLeft(PREPARE_TIME);
      if (uiExercises.length > 0) {
        Speech.speak("Ready to go. " + uiExercises[0].exerciseName);
      }
    } else if (sessionState === "RESTING") {
      setTimeLeft(REST_TIME);
      const nextEx = uiExercises[currentExerciseIndex];
      Speech.speak("Take a rest. Next up: " + (nextEx ? nextEx.exerciseName : ""));
    }
  }, [sessionState, uiExercises, currentExerciseIndex, router]);

  // Handle Countdown Timer
  useEffect(() => {
    if (sessionState !== "PREPARING" && sessionState !== "RESTING") return;

    if (timeLeft <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Speech.speak("Start!");
      if (sessionState === "PREPARING") {
        startWorkout();
      } else if (sessionState === "RESTING") {
        skipRest();
      }
      return;
    }

    // Audio/Haptic cues for last 3 seconds
    if (timeLeft === 3 || timeLeft === 2 || timeLeft === 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Speech.speak(timeLeft.toString());
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, sessionState, startWorkout, skipRest]);

  const currentEx = uiExercises[currentExerciseIndex];
  const currentSet = currentEx?.sets[currentSetIndex];
  const fullExercise = exercises.find((e) => e.id === currentEx?.exerciseId);
  const isTimeBased = isTimeBasedExercise(fullExercise);

  // Initialize Exercise Timer
  useEffect(() => {
    if (sessionState === "ACTIVE" && isTimeBased && currentSet) {
      setExerciseTimeLeft(currentSet.reps); // reps serves as seconds
      setIsExerciseTimerRunning(false);
    }
  }, [sessionState, isTimeBased, currentEx?.exerciseId, currentSet?.id]);

  // Exercise Timer tick
  useEffect(() => {
    if (sessionState !== "ACTIVE" || !isTimeBased || !isExerciseTimerRunning) return;

    if (exerciseTimeLeft <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Speech.speak("Set complete!");
      setIsExerciseTimerRunning(false);
      setTimeout(() => completeCurrentSet(), 0);
      return;
    }

    if (exerciseTimeLeft === 3 || exerciseTimeLeft === 2 || exerciseTimeLeft === 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Speech.speak(exerciseTimeLeft.toString());
    }

    const timerId = setTimeout(() => setExerciseTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerId);
  }, [exerciseTimeLeft, isExerciseTimerRunning, sessionState, isTimeBased, completeCurrentSet]);

  const handleCompleteSet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    completeCurrentSet();
  };

  const handleExit = useCallback(() => {
    setIsExerciseTimerRunning(false);
    router.back();
  }, [router]);

  if (isRoutineLoading || isHistoryLoading || uiExercises.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#abd600" />
      </SafeAreaView>
    );
  }

  if (isRoutineError) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-container-mobile">
        <Text className="text-error">Error loading routine.</Text>
      </SafeAreaView>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- RENDERS ---

  if (sessionState === "PREPARING") {
    return (
      <SafeAreaView className="flex-1 bg-electric-blue items-center justify-center" edges={["top", "bottom"]}>
        <Text className="font-display text-[40px] font-bold text-background mb-8">Ready to go</Text>
        <View className="items-center bg-surface-container/20 px-8 py-12 rounded-full mb-8">
          <Text className="font-mono text-[80px] font-bold text-background">{timeLeft}</Text>
        </View>
        <Text className="font-display text-body-lg text-background/80">Next Exercise</Text>
        <Text className="font-display text-headline-sm font-bold text-background text-center mt-2 px-6">
          {currentEx?.exerciseName}
        </Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            startWorkout();
          }}
          className="absolute bottom-16 px-12 py-4 bg-background rounded-full active:opacity-80"
        >
          <Text className="font-display text-body-lg font-bold text-electric-blue">Skip</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (sessionState === "RESTING") {
    return (
      <SafeAreaView className="flex-1 bg-neon-green items-center justify-center" edges={["top", "bottom"]}>
        <Text className="font-display text-[40px] font-bold text-background mb-8">Rest</Text>
        <View className="items-center bg-surface-container/20 px-8 py-12 rounded-full mb-8">
          <Text className="font-mono text-[80px] font-bold text-background">{formatTime(timeLeft)}</Text>
        </View>
        
        <View className="flex-row gap-4 mb-8">
          <Pressable
            onPress={() => setTimeLeft((t) => t + 20)}
            className="px-6 py-4 bg-background/20 rounded-full active:bg-background/40"
          >
            <Text className="font-mono text-body-md font-bold text-background">+20s</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              skipRest();
            }}
            className="px-8 py-4 bg-background rounded-full active:opacity-80"
          >
            <Text className="font-display text-body-md font-bold text-neon-green">Skip Rest</Text>
          </Pressable>
        </View>

        <Text className="font-display text-body-lg text-background/80">Next Up</Text>
        <Text className="font-display text-headline-sm font-bold text-background text-center mt-2 px-6">
          {currentEx?.exerciseName}
        </Text>
        <Text className="font-body text-body-md text-background/80 mt-1">
          Set {currentSetIndex + 1} of {currentEx?.sets.length}
        </Text>
      </SafeAreaView>
    );
  }

  // sessionState === "ACTIVE"
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <View className="flex-row justify-between items-center px-container-mobile py-4">
        <Pressable
          onPress={handleExit}
          className="w-10 h-10 items-center justify-center rounded-full bg-surface-container active:opacity-70"
        >
          <MaterialIcons name="close" size={22} color="#e5e2e1" />
        </Pressable>
        <Text className="text-headline-lg-mobile font-display tracking-tighter text-primary-fixed-dim">
          G.I.F
        </Text>
        <View className="w-10 h-10" />
      </View>
      
      {/* Progress Bar */}
      <View className="px-container-mobile pt-2 pb-4">
        <View className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
          <View 
            className="h-full bg-neon-green rounded-full" 
            style={{ width: `${((currentExerciseIndex) / uiExercises.length) * 100}%` }} 
          />
        </View>
        <Text className="font-mono text-label-caps text-on-surface-variant text-center mt-2 tracking-widest">
          EXERCISE {currentExerciseIndex + 1} OF {uiExercises.length}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        contentContainerClassName="px-container-mobile pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Exercise Image/Video Placeholder */}
        <View className="w-full h-64 bg-surface-container-high rounded-3xl items-center justify-center overflow-hidden mb-6">
          {currentEx?.thumbnailUrl ? (
            <Image source={{ uri: currentEx.thumbnailUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <MaterialCommunityIcons name="image-outline" size={64} color="#e5e2e1" opacity={0.2} />
          )}
        </View>

        {/* Exercise Info */}
        <View className="items-center mb-8">
          <Text className="font-display text-headline-md font-bold text-on-surface text-center">
            {currentEx?.exerciseName}
          </Text>
          <Text className="font-body text-body-lg text-neon-green mt-2 font-bold">
            Set {currentSetIndex + 1} / {currentEx?.sets.length}
          </Text>
        </View>

        {/* Hybrid Tracker (Weight/Reps) vs Timer */}
        {currentSet && (
          isTimeBased ? (
            <View className="items-center justify-center mb-8 gap-4 mt-2">
              <View className={`items-center px-8 py-8 rounded-full border-[3px] ${isExerciseTimerRunning ? 'bg-[#abd600]/10 border-[#abd600]' : 'bg-surface-container/30 border-surface-variant/30'}`}>
                <Text className="font-mono text-[64px] font-bold text-on-surface">
                  {formatTime(exerciseTimeLeft)}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsExerciseTimerRunning(!isExerciseTimerRunning);
                }}
                className={`px-12 py-5 rounded-full active:opacity-80 flex-row items-center gap-3 ${isExerciseTimerRunning ? 'bg-error/20' : 'bg-neon-green/20'}`}
              >
                <MaterialIcons name={isExerciseTimerRunning ? "pause" : "play-arrow"} size={28} color={isExerciseTimerRunning ? "#ff5449" : "#abd600"} />
                <Text className={`font-display text-title-lg font-bold tracking-wider ${isExerciseTimerRunning ? 'text-error' : 'text-neon-green'}`}>
                  {isExerciseTimerRunning ? "PAUSE" : "START"}
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-row items-center justify-center gap-6 mb-12">
              <View className="items-center">
                <Text className="font-mono text-label-caps text-on-surface-variant mb-2 tracking-widest">KG</Text>
                <View className="bg-surface-container rounded-2xl w-24 h-16 items-center justify-center border border-surface-variant/20">
                  <TextInput
                    keyboardType="numeric"
                    value={currentSet.weight.toString()}
                    onChangeText={(val) => updateSet(currentEx.exerciseId, currentSet.id, "weight", Number(val))}
                    className="font-display text-title-lg font-bold text-on-surface text-center w-full"
                    selectTextOnFocus
                  />
                </View>
              </View>
              
              <Text className="font-display text-headline-sm text-on-surface-variant/30 mt-6">×</Text>
              
              <View className="items-center">
                <Text className="font-mono text-label-caps text-on-surface-variant mb-2 tracking-widest">REPS</Text>
                <View className="bg-surface-container rounded-2xl w-24 h-16 items-center justify-center border border-surface-variant/20">
                  <TextInput
                    keyboardType="numeric"
                    value={currentSet.reps.toString()}
                    onChangeText={(val) => updateSet(currentEx.exerciseId, currentSet.id, "reps", Number(val))}
                    className="font-display text-title-lg font-bold text-on-surface text-center w-full"
                    selectTextOnFocus
                  />
                </View>
              </View>
            </View>
          )
        )}

        <View className="flex-1 justify-end mt-4">
          <Pressable
            onPress={handleCompleteSet}
            className="bg-neon-green rounded-full py-5 items-center justify-center shadow-sm active:opacity-80 active:scale-95"
          >
            <Text className="font-display text-title-md font-bold text-background uppercase tracking-wider">
              Complete Set
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
