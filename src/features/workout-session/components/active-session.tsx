import AppHeader from "@/components/app-header";
import { useUser } from "@clerk/expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const MAX_REST_TIME = 105; // 01:45

export default function ActiveSession() {
  const router = useRouter();
  const { user } = useUser();

  // Set tracking
  const [currentSet, setCurrentSet] = useState<number>(2);
  const totalSets = 4;

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState<number>(MAX_REST_TIME);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Weight & Reps adjustment
  const [weight, setWeight] = useState<number>(185);
  const [reps, setReps] = useState<number>(10);

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // SVG ring calculations — viewBox 220x220, cx/cy=110, r=96
  const cx = 110;
  const cy = 110;
  const radius = 96;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - timeLeft / MAX_REST_TIME);

  const handleCompleteSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
      setTimeLeft(MAX_REST_TIME);
      setIsTimerRunning(true);
    } else {
      router.replace("/(tabs)/workout/session-complete");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      {/* App Header */}
      <AppHeader avatarUrl={user?.imageUrl} />

      <View className="flex-1 px-container-mobile justify-between pt-stack-sm pb-4">

        {/* Workout Title */}
        <View className="items-center">
          <Text className="font-display text-headline-lg font-bold text-on-surface text-center">
            Bench Press
          </Text>
          <Text className="font-mono text-label-caps text-secondary tracking-[0.1em] mt-1">
            SET {currentSet} OF {totalSets}
          </Text>
        </View>

        {/* Rest Timer Ring */}
        <View className="items-center justify-center">
          <Pressable
            onPress={() => setIsTimerRunning(!isTimerRunning)}
            style={{ width: 220, height: 220 }}
            className="items-center justify-center relative active:scale-[0.98]"
            accessibilityLabel={isTimerRunning ? "Pause timer" : "Resume timer"}
          >
            {/* Background glow blob */}
            <View
              style={{
                position: "absolute",
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: "rgba(75, 142, 255, 0.08)",
              }}
            />

            {/* SVG progress arc */}
            <Svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              style={{ position: "absolute" }}
            >
              {/* Track */}
              <Circle
                cx={cx}
                cy={cy}
                r={radius}
                stroke="#1c1b1b"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Active arc */}
              <Circle
                cx={cx}
                cy={cy}
                r={radius}
                stroke="#4b8eff"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            </Svg>

            {/* Time text inside ring */}
            <View className="items-center justify-center">
              <Text
                style={{ fontFamily: "JetBrains Mono", fontSize: 44, fontWeight: "700", color: "#e5e2e1", letterSpacing: -1 }}
              >
                {formatTime(timeLeft)}
              </Text>
              <Text className="font-mono text-label-caps text-on-surface-variant/40 tracking-[0.15em] mt-1">
                {isTimerRunning ? "REST TIME" : "PAUSED"}
              </Text>
            </View>
          </Pressable>

          {/* Skip rest link */}
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

        {/* Weight & Reps Row */}
        <View className="flex-row gap-3">
          {/* Weight Card */}
          <View className="flex-1 bg-surface-container/60 border border-surface-variant/20 rounded-xl px-4 py-3 gap-2">
            <Text className="font-mono text-label-caps text-on-surface-variant/50 tracking-[0.1em]">
              WEIGHT (LBS)
            </Text>
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => setWeight((w) => Math.max(5, w - 5))}
                className="w-8 h-8 items-center justify-center rounded-full bg-surface-container-high active:opacity-70"
              >
                <MaterialIcons name="remove" size={18} color="#e5e2e1" />
              </Pressable>
              <Text className="font-display text-[28px] font-bold text-on-surface">
                {weight}
              </Text>
              <Pressable
                onPress={() => setWeight((w) => w + 5)}
                className="w-8 h-8 items-center justify-center rounded-full bg-surface-container-high active:opacity-70"
              >
                <MaterialIcons name="add" size={18} color="#e5e2e1" />
              </Pressable>
            </View>
          </View>

          {/* Reps Card */}
          <View className="flex-1 bg-surface-container/60 border border-surface-variant/20 rounded-xl px-4 py-3 gap-2">
            <Text className="font-mono text-label-caps text-on-surface-variant/50 tracking-[0.1em]">
              REPS
            </Text>
            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => setReps((r) => Math.max(1, r - 1))}
                className="w-8 h-8 items-center justify-center rounded-full bg-surface-container-high active:opacity-70"
              >
                <MaterialIcons name="remove" size={18} color="#e5e2e1" />
              </Pressable>
              <Text className="font-display text-[28px] font-bold text-on-surface">
                {reps}
              </Text>
              <Pressable
                onPress={() => setReps((r) => r + 1)}
                className="w-8 h-8 items-center justify-center rounded-full bg-surface-container-high active:opacity-70"
              >
                <MaterialIcons name="add" size={18} color="#e5e2e1" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* AI Auto-Regulation Card */}
        <View className="bg-surface-container/50 border border-surface-variant/20 rounded-xl px-4 py-3 flex-row items-start gap-3">
          {/* Glowing green dot indicator */}
          <View
            className="w-3 h-3 rounded-full bg-neon-green mt-1 shrink-0"
            style={{
              shadowColor: "#abd600",
              shadowOpacity: 0.7,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 0 },
              elevation: 4,
            }}
          />
          <View className="flex-1 gap-0.5">
            <Text className="font-display text-body-md font-bold text-on-surface">
              AI Auto-Regulation
            </Text>
            <Text className="font-body text-[13px] text-on-surface-variant/60 leading-5">
              Feeling tired? Slide for AI adjustment on next set.
            </Text>
          </View>
        </View>

        {/* Complete Set CTA */}
        <Pressable
          onPress={handleCompleteSet}
          className="w-full bg-primary-fixed-dim rounded-xl py-4 flex-row justify-center items-center gap-2 active:opacity-85"
          style={{
            shadowColor: "#abd600",
            shadowOpacity: 0.25,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
          }}
        >
          <Text className="font-display text-body-lg font-bold text-on-primary-fixed">
            Complete Set
          </Text>
          <MaterialIcons name="done" size={20} color="#161e00" />
        </Pressable>

      </View>
    </SafeAreaView>
  );
}
