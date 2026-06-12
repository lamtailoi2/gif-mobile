import { useTheme } from "@/hooks/use-theme";
import { useSaveWorkoutSession } from "@/features/workout-session/hooks/use-save-workout-session";
import { useWorkoutSessionStore } from "@/features/workout-session/store/use-workout-session-store";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

import { EnergyLevel } from "@/interfaces/workout-session.interface";

// ── Icon mapping cho nhóm cơ ───────────────────────────────────────────────
type MCIcon = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const MUSCLE_ICONS: Record<string, MCIcon> = {
  chest: "dumbbell",
  back: "human",
  shoulders: "weight-lifter",
  arms: "arm-flex",
  core: "human-handsup",
  legs: "run",
};

const MUSCLE_LABELS: Record<string, string> = {
  chest: "Chest",
  back: "Back",
  shoulders: "Shoulders",
  arms: "Arms",
  core: "Core",
  legs: "Legs",
};

const ENERGY_OPTIONS: {
  key: EnergyLevel;
  icon: MCIcon;
  label: string;
  color: string;
}[] = [
  { key: "drained", icon: "battery-outline", label: "DRAINED", color: "#ffb4ab" },
  { key: "steady", icon: "battery-medium", label: "STEADY", color: "#abd600" },
  { key: "charged", icon: "flash", label: "CHARGED", color: "#abd600" },
];

export default function SessionComplete() {
  const router = useRouter();
  const theme = useTheme();
  const { mutate: saveSession, isPending } = useSaveWorkoutSession();

  // ── Store data ─────────────────────────────────────────────────────────────
  const { routine, exerciseLogs, sessionStartedAt, sessionSaved, markSessionSaved, resetSessionSaved, resetSession } =
    useWorkoutSessionStore();

  // ── Tính totalVolume từ exerciseLogs thực tế ──────────────────────────────
  const totalVolume = useMemo(
    () =>
      exerciseLogs.reduce(
        (acc, log) =>
          acc + log.sets.reduce((s, set) => s + set.weight * set.reps, 0),
        0
      ),
    [exerciseLogs]
  );

  // ── Tính durationSec ──────────────────────────────────────────────────────
  const durationSec = useMemo(() => {
    if (!sessionStartedAt) return 0;
    return Math.round(
      (Date.now() - new Date(sessionStartedAt).getTime()) / 1000
    );
  }, [sessionStartedAt]);

  const durationMin = Math.round(durationSec / 60);

  // ── Muscle breakdown — auto-populate từ routine.muscleGroups ─────────────
  const availableMuscles: string[] = routine?.muscleGroups ?? [
    "chest",
    "back",
    "legs",
    "arms",
  ];

  const [selectedMuscles, setSelectedMuscles] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(availableMuscles.map((m) => [m, true]))
  );

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles((prev) => ({ ...prev, [muscle]: !prev[muscle] }));
  };

  // ── Session stats ─────────────────────────────────────────────────────────
  const totalSets = exerciseLogs.reduce((acc, log) => acc + log.sets.length, 0);
  const totalExercises = exerciseLogs.length;

  // ── Intensity / Energy ────────────────────────────────────────────────────
  const [energyLevel, setEnergyLevel] = useState<"drained" | "steady" | "charged">("steady");
  const [intensityRating, setIntensityRating] = useState<number>(7);
  const [sliderWidth, setSliderWidth] = useState<number>(0);

  const handleSliderTouch = (event: GestureResponderEvent) => {
    if (sliderWidth <= 0) return;
    const touchX = event.nativeEvent.locationX;
    const percentage = Math.max(0, Math.min(1, touchX / sliderWidth));
    setIntensityRating(Math.round(percentage * 9) + 1);
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = () => {
    // sessionSaved persists qua Strict Mode remount — ngăn double-save
    if (sessionSaved || isPending) return;
    markSessionSaved();

    saveSession(
      {
        routineId: routine?.id ?? "",
        routineName: routine?.name ?? "",
        completedAt: new Date().toISOString(),
        durationSec,
        energyLevel,
        intensityRating,
        muscleBreakdown: selectedMuscles,
        exerciseLogs,
        totalVolume,
      },
      {
        onSuccess: () => {
          resetSession();
          router.replace("/(tabs)");
        },
        onError: () => {
          // Reset flag để user có thể retry
          resetSessionSaved();
          Alert.alert(
            "Save Failed",
            "Could not save your session. Please try again."
          );
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-container-mobile py-stack-sm flex-row justify-between items-center border-b border-surface-variant/10">
        <Text className="font-display text-headline-lg-mobile font-bold text-neon-green">
          Session Complete
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 justify-center items-center rounded-full bg-surface-container/60 border border-surface-variant/25 active:opacity-70"
          accessibilityLabel="Close screen"
        >
          <MaterialIcons name="close" size={22} color={theme.onSurface} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerClassName="px-container-mobile pt-stack-sm pb-stack-lg gap-gutter"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View className="gap-1 mt-stack-sm">
          <Text className="font-display text-headline-md font-bold text-on-surface">
            How was it?
          </Text>
          <Text className="font-body text-body-md text-on-surface-variant/70">
            {"Calibrate your neural twin to optimize next session's load."}
          </Text>
        </View>

        {/* Real Session Stats */}
        <View className="bg-surface-container/60 border border-surface-variant/25 rounded-xl p-stack-md gap-3 shadow-sm">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="cpu-64-bit" size={16} color="#abd600" />
            <Text className="font-mono text-label-caps text-neon-green tracking-[0.1em]">
              SESSION SUMMARY
            </Text>
          </View>
          <View className="flex-row justify-between">
            {/* Volume */}
            <View className="items-center gap-1">
              <Text className="font-display text-[22px] font-bold text-neon-green">
                {totalVolume.toLocaleString()}
              </Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 tracking-[0.08em]">
                TOTAL VOL (lbs)
              </Text>
            </View>
            {/* Divider */}
            <View className="w-px bg-surface-variant/20" />
            {/* Sets */}
            <View className="items-center gap-1">
              <Text className="font-display text-[22px] font-bold text-electric-blue">
                {totalSets}
              </Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 tracking-[0.08em]">
                SETS
              </Text>
            </View>
            {/* Divider */}
            <View className="w-px bg-surface-variant/20" />
            {/* Exercises */}
            <View className="items-center gap-1">
              <Text className="font-display text-[22px] font-bold text-on-surface">
                {totalExercises}
              </Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 tracking-[0.08em]">
                EXERCISES
              </Text>
            </View>
            {/* Divider */}
            <View className="w-px bg-surface-variant/20" />
            {/* Duration */}
            <View className="items-center gap-1">
              <Text className="font-display text-[22px] font-bold text-on-surface">
                {durationMin}
              </Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 tracking-[0.08em]">
                MIN
              </Text>
            </View>
          </View>
          {/* Routine name */}
          {routine && (
            <Text className="font-body text-[12px] text-on-surface-variant/40 text-center">
              {routine.name} · {routine.focus}
            </Text>
          )}
        </View>

        {/* Energy Level */}
        <View className="gap-3 mt-stack-sm">
          <View className="flex-row justify-between items-baseline">
            <Text className="font-display text-body-lg font-bold text-on-surface">
              Energy Level
            </Text>
            <Text className="font-mono text-label-caps text-on-surface-variant/50">
              BIOMETRIC
            </Text>
          </View>
          <View className="flex-row gap-3">
            {ENERGY_OPTIONS.map(({ key, icon, label, color }) => (
              <Pressable
                key={key}
                onPress={() => setEnergyLevel(key)}
                className={`flex-1 items-center justify-center py-5 rounded-xl border bg-surface-container/40 active:opacity-80 ${
                  energyLevel === key
                    ? key === "drained"
                      ? "border-error/80 bg-surface-container-high"
                      : "border-neon-green bg-surface-container-high"
                    : "border-surface-variant/20"
                }`}
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={24}
                  color={energyLevel === key ? color : "#e5e2e1"}
                />
                <Text
                  className={`font-mono text-label-caps tracking-[0.1em] mt-2 ${
                    energyLevel === key
                      ? key === "drained"
                        ? "text-error font-bold"
                        : "text-neon-green font-bold"
                      : "text-on-surface-variant/60"
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>


        {/* Intensity Slider */}
        <View className="bg-surface-container/60 border border-surface-variant/25 rounded-xl p-stack-md gap-4 mt-stack-sm shadow-sm">
          <View className="flex-row justify-between items-center">
            <Text className="font-display text-body-lg font-bold text-on-surface">
              Intensity Rating
            </Text>
            <Text className="font-display text-headline-md font-bold text-neon-green">
              {intensityRating}
            </Text>
          </View>
          <View className="gap-2">
            <View
              onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
              onTouchStart={handleSliderTouch}
              onTouchMove={handleSliderTouch}
              className="w-full h-8 justify-center relative active:scale-[1.01]"
            >
              <View className="w-full h-2 rounded-full overflow-hidden absolute pointer-events-none">
                <Svg width="100%" height="8">
                  <Defs>
                    <LinearGradient id="sliderGrad" x1="0" y1="0" x2="1" y2="0">
                      <Stop offset="0%" stopColor="#4b8eff" />
                      <Stop offset="100%" stopColor="#abd600" />
                    </LinearGradient>
                  </Defs>
                  <Rect width="100%" height="8" fill="url(#sliderGrad)" />
                </Svg>
              </View>
              {sliderWidth > 0 && (
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    left: `${((intensityRating - 1) / 9) * 100}%`,
                    transform: [{ translateX: -12 }],
                  }}
                  className="w-6 h-6 rounded-full bg-white border-2 border-neon-green items-center justify-center shadow-lg shadow-neon-green/80"
                >
                  <View className="w-2 h-2 rounded-full bg-neon-green" />
                </View>
              )}
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="font-mono text-[10px] text-on-surface-variant/40 tracking-[0.1em]">RECOVERY</Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/40 tracking-[0.1em]">MAX OUTPUT</Text>
            </View>
          </View>
        </View>

        {/* Muscle Breakdown — dynamic từ routine.muscleGroups */}
        <View className="gap-3 mt-stack-sm">
          <View className="flex-row justify-between items-baseline">
            <Text className="font-display text-body-lg font-bold text-on-surface">
              Muscle Breakdown
            </Text>
            <Text className="font-mono text-label-caps text-on-surface-variant/50">
              SELECT ZONES
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-3">
            {availableMuscles.map((muscle) => {
              const isSelected = selectedMuscles[muscle];
              const icon = MUSCLE_ICONS[muscle] ?? "dumbbell";
              const label = MUSCLE_LABELS[muscle] ?? muscle;
              return (
                <Pressable
                  key={muscle}
                  onPress={() => toggleMuscle(muscle)}
                  className={`w-[48%] min-h-[96px] p-stack-md rounded-xl border bg-surface-container/40 relative overflow-hidden active:opacity-85 ${
                    isSelected
                      ? "border-neon-green bg-surface-container-high/80"
                      : "border-surface-variant/20"
                  }`}
                >
                  <Text
                    className={`font-display text-body-lg font-bold ${
                      isSelected ? "text-neon-green" : "text-on-surface"
                    }`}
                  >
                    {label}
                  </Text>
                  <Text
                    className={`font-mono text-label-caps tracking-[0.05em] mt-1 ${
                      isSelected ? "text-neon-green/90" : "text-on-surface-variant/40"
                    }`}
                  >
                    {isSelected ? "HIGH LOAD" : "MODERATE"}
                  </Text>
                  <View className="absolute bottom-[-10px] right-[-10px] opacity-10 pointer-events-none">
                    <MaterialCommunityIcons
                      name={icon}
                      size={64}
                      color={isSelected ? "#abd600" : "#e5e2e1"}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Finish & Save CTA */}
      <View className="px-container-mobile pb-stack-md pt-stack-sm border-t border-surface-variant/10">
        <Pressable
          disabled={isPending}
          onPress={handleSave}
          className={`w-full flex-row items-center justify-center gap-3 py-5 rounded-2xl bg-neon-green active:opacity-85 active:scale-[0.98] ${
            isPending ? "opacity-70" : ""
          }`}
          accessibilityLabel="Finish and save session"
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#0e0e0f" />
          ) : (
            <>
              <Text className="font-display text-body-lg font-bold text-background tracking-wide">
                {"Finish & Save"}
              </Text>
              <MaterialIcons name="check-circle" size={22} color="#0e0e0f" />
            </>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
