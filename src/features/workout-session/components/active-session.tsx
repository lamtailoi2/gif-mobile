import AppHeader from "@/components/app-header";
import { useRoutineWithExercises } from "@/features/workout-session/hooks/use-routine-with-exercises";
import { useWorkoutSessionStore } from "@/features/workout-session/store/use-workout-session-store";
import { useUser } from "@clerk/expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const MAX_REST_TIME = 105; // 1:45 mặc định

interface IActiveSessionProps {
  routineId: string;
}

export default function ActiveSession({ routineId }: IActiveSessionProps) {
  const router = useRouter();
  const { user } = useUser();

  // Load routine + exercises từ Firestore
  const { data, isLoading, isError } = useRoutineWithExercises(routineId);

  // Zustand store
  const {
    routine,
    exercises,
    currentExerciseIndex,
    currentSetIndex,
    startSession,
    completeSet,
  } = useWorkoutSessionStore();

  // Chỉ gọi startSession một lần khi data sẵn sàng
  const sessionStartedRef = useRef(false);
  useEffect(() => {
    if (data && !sessionStartedRef.current) {
      startSession(data.routine, data.exercises);
      sessionStartedRef.current = true;
    }
  }, [data, startSession]);

  // Rest timer
  const [timeLeft, setTimeLeft] = useState<number>(MAX_REST_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Weight & Reps — reset khi chuyển exercise
  const currentExercise = exercises[currentExerciseIndex];
  const [weight, setWeight] = useState<number>(45);
  const [reps, setReps] = useState<number>(10);

  useEffect(() => {
    if (currentExercise) {
      setReps(currentExercise.defaultReps);
      setWeight(45);
      setTimeLeft(MAX_REST_TIME);
      setIsTimerRunning(false);
    }
  }, [currentExerciseIndex, currentExercise]);

  // Timer countdown
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // SVG ring
  const cx = 110, cy = 110, radius = 96, strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timeLeft / MAX_REST_TIME);

  const handleCompleteSet = () => {
    const isDone = completeSet(weight, reps);
    if (isDone) {
      router.replace("/(tabs)/workout/session-complete");
    } else {
      setTimeLeft(MAX_REST_TIME);
      setIsTimerRunning(true);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#abd600" />
        <Text className="font-mono text-label-caps text-on-surface-variant/40 mt-4 tracking-widest">
          LOADING SESSION...
        </Text>
      </SafeAreaView>
    );
  }

  // ── Invalid / Error state ──────────────────────────────────────────────────
  if (!routineId || isError || !data) {
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
          <Text className="font-display text-body-md font-bold text-on-surface">
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  // ── Store sync (brief flash after data arrives, before useEffect fires) ────
  if (!currentExercise) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#abd600" />
        <Text className="font-mono text-label-caps text-on-surface-variant/40 mt-4 tracking-widest">
          PREPARING SESSION...
        </Text>
      </SafeAreaView>
    );
  }

  const totalSets = currentExercise.defaultSets;
  const totalExercises = exercises.length;
  const isLastSetOfLastExercise =
    currentSetIndex >= totalSets - 1 &&
    currentExerciseIndex >= totalExercises - 1;
  const isLastSetOfExercise = currentSetIndex >= totalSets - 1;

  const ctaLabel = isLastSetOfLastExercise
    ? "Finish Session"
    : isLastSetOfExercise
    ? "Next Exercise →"
    : "Complete Set";

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <AppHeader avatarUrl={user?.imageUrl} />

      <View className="flex-1 px-container-mobile justify-between pt-stack-sm pb-4">

        {/* Exercise & Set Header */}
        <View className="items-center gap-1">
          <Text className="font-mono text-label-caps text-neon-green/70 tracking-[0.12em]">
            EXERCISE {currentExerciseIndex + 1} / {totalExercises}
          </Text>
          <Text className="font-display text-headline-lg font-bold text-on-surface text-center">
            {currentExercise.name}
          </Text>
          <Text className="font-mono text-label-caps text-secondary tracking-[0.1em]">
            SET {currentSetIndex + 1} OF {totalSets}
          </Text>
          {routine && (
            <Text className="font-body text-[12px] text-on-surface-variant/35 mt-0.5">
              {routine.name} · {routine.focus}
            </Text>
          )}
        </View>

        {/* Rest Timer Ring */}
        <View className="items-center justify-center">
          <Pressable
            onPress={() => setIsTimerRunning((r) => !r)}
            style={{ width: 220, height: 220 }}
            className="items-center justify-center relative active:scale-[0.98]"
            accessibilityLabel={isTimerRunning ? "Pause timer" : "Start rest timer"}
          >
            {/* Glow blob */}
            <View
              style={{
                position: "absolute",
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: "rgba(75, 142, 255, 0.08)",
              }}
            />
            {/* SVG arc */}
            <Svg width="220" height="220" viewBox="0 0 220 220" style={{ position: "absolute" }}>
              <Circle cx={cx} cy={cy} r={radius} stroke="#1c1b1b" strokeWidth={strokeWidth} fill="none" />
              <Circle
                cx={cx} cy={cy} r={radius}
                stroke="#4b8eff" strokeWidth={strokeWidth} fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            </Svg>
            {/* Time display */}
            <View className="items-center justify-center">
              <Text style={{ fontFamily: "JetBrains Mono", fontSize: 44, fontWeight: "700", color: "#e5e2e1", letterSpacing: -1 }}>
                {formatTime(timeLeft)}
              </Text>
              <Text className="font-mono text-label-caps text-on-surface-variant/40 tracking-[0.15em] mt-1">
                {isTimerRunning ? "REST TIME" : "PAUSED"}
              </Text>
            </View>
          </Pressable>

          {timeLeft > 0 && (
            <Pressable
              onPress={() => { setTimeLeft(0); setIsTimerRunning(false); }}
              className="mt-3 px-5 py-1.5 active:opacity-60"
            >
              <Text className="font-mono text-[10px] text-on-surface-variant/40 uppercase tracking-widest">
                Skip Rest
              </Text>
            </Pressable>
          )}
        </View>

        {/* Weight & Reps */}
        <View className="flex-row gap-3">
          {/* Weight */}
          <View className="flex-1 bg-surface-container/60 border border-surface-variant/20 rounded-xl px-4 py-3 gap-2">
            <Text className="font-mono text-label-caps text-on-surface-variant/50 tracking-[0.1em]">WEIGHT (LBS)</Text>
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => setWeight((w) => Math.max(5, w - 5))}
                className="w-8 h-8 items-center justify-center rounded-full bg-surface-container-high active:opacity-70"
              >
                <MaterialIcons name="remove" size={18} color="#e5e2e1" />
              </Pressable>
              <Text className="font-display text-[28px] font-bold text-on-surface">{weight}</Text>
              <Pressable
                onPress={() => setWeight((w) => w + 5)}
                className="w-8 h-8 items-center justify-center rounded-full bg-surface-container-high active:opacity-70"
              >
                <MaterialIcons name="add" size={18} color="#e5e2e1" />
              </Pressable>
            </View>
          </View>

          {/* Reps */}
          <View className="flex-1 bg-surface-container/60 border border-surface-variant/20 rounded-xl px-4 py-3 gap-2">
            <Text className="font-mono text-label-caps text-on-surface-variant/50 tracking-[0.1em]">REPS</Text>
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => setReps((r) => Math.max(1, r - 1))}
                className="w-8 h-8 items-center justify-center rounded-full bg-surface-container-high active:opacity-70"
              >
                <MaterialIcons name="remove" size={18} color="#e5e2e1" />
              </Pressable>
              <Text className="font-display text-[28px] font-bold text-on-surface">{reps}</Text>
              <Pressable
                onPress={() => setReps((r) => r + 1)}
                className="w-8 h-8 items-center justify-center rounded-full bg-surface-container-high active:opacity-70"
              >
                <MaterialIcons name="add" size={18} color="#e5e2e1" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* AI Auto-Regulation hint */}
        <View className="bg-surface-container/50 border border-surface-variant/20 rounded-xl px-4 py-3 flex-row items-start gap-3">
          <View
            className="w-3 h-3 rounded-full bg-neon-green mt-1 shrink-0"
            style={{ shadowColor: "#abd600", shadowOpacity: 0.7, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 4 }}
          />
          <View className="flex-1 gap-0.5">
            <Text className="font-display text-body-md font-bold text-on-surface">AI Auto-Regulation</Text>
            <Text className="font-body text-[13px] text-on-surface-variant/60 leading-5">
              Feeling tired? Adjust weight or reps before completing the set.
            </Text>
          </View>
        </View>

        {/* CTA */}
        <Pressable
          onPress={handleCompleteSet}
          className="w-full bg-primary-fixed-dim rounded-xl py-4 flex-row justify-center items-center gap-2 active:opacity-85"
          style={{ shadowColor: "#abd600", shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 }}
          accessibilityLabel={ctaLabel}
        >
          <Text className="font-display text-body-lg font-bold text-on-primary-fixed">{ctaLabel}</Text>
          <MaterialIcons
            name={isLastSetOfLastExercise ? "check-circle" : "done"}
            size={20}
            color="#161e00"
          />
        </Pressable>

      </View>
    </SafeAreaView>
  );
}
