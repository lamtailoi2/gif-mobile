import { useTheme } from "@/hooks/use-theme";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  GestureResponderEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

export default function SessionComplete() {
  const router = useRouter();
  const theme = useTheme();


  const [energyLevel, setEnergyLevel] = useState<"drained" | "steady" | "charged">("steady");

  const [intensityRating, setIntensityRating] = useState<number>(7);
  const [sliderWidth, setSliderWidth] = useState<number>(0);


  const [selectedMuscles, setSelectedMuscles] = useState<Record<string, boolean>>({
    chest: true,
    back: false,
    legs: false,
    arms: false,
  });

  const toggleMuscle = (muscle: string) => {
    setSelectedMuscles((prev) => ({
      ...prev,
      [muscle]: !prev[muscle],
    }));
  };


  const handleSliderTouch = (event: GestureResponderEvent) => {
    if (sliderWidth <= 0) return;
    const touchX = event.nativeEvent.locationX;
    const percentage = Math.max(0, Math.min(1, touchX / sliderWidth));

    const ratingValue = Math.round(percentage * 9) + 1;
    setIntensityRating(ratingValue);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">

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

        <View className="gap-1 mt-stack-sm">
          <Text className="font-display text-headline-md font-bold text-on-surface">
            How was it?
          </Text>
          <Text className="font-body text-body-md text-on-surface-variant/70">
            {"Calibrate your neural twin to optimize next session's load."}
          </Text>
        </View>


        <View className="bg-surface-container/60 border border-surface-variant/25 rounded-xl p-stack-md gap-3 shadow-sm">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="cpu-64-bit" size={16} color="#abd600" />
            <Text className="font-mono text-label-caps text-neon-green tracking-[0.1em]">
              AI SUMMARY
            </Text>
          </View>
          <Text className="font-body text-body-md text-on-surface leading-6">
            Great session. Your chest volume increased by{" "}
            <Text className="text-neon-green font-bold">12%</Text>. Recovery
            predicted:{" "}
            <Text className="text-electric-blue font-bold">48 hours</Text>.
          </Text>
        </View>


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

            <Pressable
              onPress={() => setEnergyLevel("drained")}
              className={`flex-1 items-center justify-center py-5 rounded-xl border bg-surface-container/40 ${energyLevel === "drained"
                  ? "border-error/80 bg-surface-container-high"
                  : "border-surface-variant/20"
                } active:opacity-80`}
            >
              <MaterialCommunityIcons
                name="battery-outline"
                size={24}
                color={energyLevel === "drained" ? "#ffb4ab" : "#ffb4ab/60"}
              />
              <Text
                className={`font-mono text-label-caps tracking-[0.1em] mt-2 ${energyLevel === "drained"
                    ? "text-error font-bold"
                    : "text-on-surface-variant/60"
                  }`}
              >
                DRAINED
              </Text>
            </Pressable>


            <Pressable
              onPress={() => setEnergyLevel("steady")}
              className={`flex-1 items-center justify-center py-5 rounded-xl border bg-surface-container/40 ${energyLevel === "steady"
                  ? "border-neon-green bg-surface-container-high"
                  : "border-surface-variant/20"
                } active:opacity-80`}
            >
              <View className="h-6 justify-center items-center">
                <MaterialCommunityIcons
                  name="battery-medium"
                  size={24}
                  color={energyLevel === "steady" ? "#abd600" : "#e5e2e1/20"}
                />
              </View>
              <Text
                className={`font-mono text-label-caps tracking-[0.1em] mt-2 ${energyLevel === "steady"
                    ? "text-neon-green font-bold"
                    : "text-on-surface-variant/60"
                  }`}
              >
                STEADY
              </Text>
            </Pressable>


            <Pressable
              onPress={() => setEnergyLevel("charged")}
              className={`flex-1 items-center justify-center py-5 rounded-xl border bg-surface-container/40 ${energyLevel === "charged"
                  ? "border-neon-green bg-surface-container-high"
                  : "border-surface-variant/20"
                } active:opacity-80`}
            >
              <MaterialCommunityIcons
                name="flash"
                size={24}
                color={energyLevel === "charged" ? "#abd600" : "#abd600/40"}
              />
              <Text
                className={`font-mono text-label-caps tracking-[0.1em] mt-2 ${energyLevel === "charged"
                    ? "text-neon-green font-bold"
                    : "text-on-surface-variant/60"
                  }`}
              >
                CHARGED
              </Text>
            </Pressable>
          </View>
        </View>


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
                    transform: [{ translateX: -12 }], // Half of thumb width (24)
                  }}
                  className="w-6 h-6 rounded-full bg-white border-2 border-neon-green items-center justify-center shadow-lg shadow-neon-green/80"
                >
                  <View className="w-2 h-2 rounded-full bg-neon-green" />
                </View>
              )}
            </View>


            <View className="flex-row justify-between mt-1">
              <Text className="font-mono text-[10px] text-on-surface-variant/40 tracking-[0.1em]">
                RECOVERY
              </Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/40 tracking-[0.1em]">
                MAX OUTPUT
              </Text>
            </View>
          </View>
        </View>


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

            <Pressable
              onPress={() => toggleMuscle("chest")}
              className={`w-[48%] min-h-[96px] p-stack-md rounded-xl border bg-surface-container/40 relative overflow-hidden active:opacity-85 ${selectedMuscles.chest
                  ? "border-neon-green bg-surface-container-high/80"
                  : "border-surface-variant/20"
                }`}
            >
              <Text
                className={`font-display text-body-lg font-bold ${selectedMuscles.chest ? "text-neon-green" : "text-on-surface"
                  }`}
              >
                Chest
              </Text>
              <Text
                className={`font-mono text-label-caps tracking-[0.05em] mt-1 ${selectedMuscles.chest
                    ? "text-neon-green/90"
                    : "text-on-surface-variant/40"
                  }`}
              >
                {selectedMuscles.chest ? "HIGH LOAD" : "MODERATE"}
              </Text>

              <View className="absolute bottom-[-10px] right-[-10px] opacity-10 pointer-events-none rotate-[-15deg]">
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={64}
                  color={selectedMuscles.chest ? "#abd600" : "#e5e2e1"}
                />
              </View>
            </Pressable>


            <Pressable
              onPress={() => toggleMuscle("back")}
              className={`w-[48%] min-h-[96px] p-stack-md rounded-xl border bg-surface-container/40 relative overflow-hidden active:opacity-85 ${selectedMuscles.back
                  ? "border-neon-green bg-surface-container-high/80"
                  : "border-surface-variant/20"
                }`}
            >
              <Text
                className={`font-display text-body-lg font-bold ${selectedMuscles.back ? "text-neon-green" : "text-on-surface"
                  }`}
              >
                Back
              </Text>
              <Text
                className={`font-mono text-label-caps tracking-[0.05em] mt-1 ${selectedMuscles.back
                    ? "text-neon-green/90"
                    : "text-on-surface-variant/40"
                  }`}
              >
                {selectedMuscles.back ? "HIGH LOAD" : "MODERATE"}
              </Text>

              <View className="absolute bottom-[-10px] right-[-10px] opacity-10 pointer-events-none">
                <MaterialCommunityIcons
                  name="human"
                  size={64}
                  color={selectedMuscles.back ? "#abd600" : "#e5e2e1"}
                />
              </View>
            </Pressable>


            <Pressable
              onPress={() => toggleMuscle("legs")}
              className={`w-[48%] min-h-[96px] p-stack-md rounded-xl border bg-surface-container/40 relative overflow-hidden active:opacity-85 ${selectedMuscles.legs
                  ? "border-neon-green bg-surface-container-high/80"
                  : "border-surface-variant/20"
                }`}
            >
              <Text
                className={`font-display text-body-lg font-bold ${selectedMuscles.legs ? "text-neon-green" : "text-on-surface"
                  }`}
              >
                Legs
              </Text>
              <Text
                className={`font-mono text-label-caps tracking-[0.05em] mt-1 ${selectedMuscles.legs
                    ? "text-neon-green/80"
                    : "text-on-surface-variant/40"
                  }`}
              >
                {selectedMuscles.legs ? "HIGH LOAD" : "RESTED"}
              </Text>

              <View className="absolute bottom-[-10px] right-[-10px] opacity-10 pointer-events-none rotate-[-10deg]">
                <MaterialCommunityIcons
                  name="run"
                  size={64}
                  color={selectedMuscles.legs ? "#abd600" : "#e5e2e1"}
                />
              </View>
            </Pressable>


            <Pressable
              onPress={() => toggleMuscle("arms")}
              className={`w-[48%] min-h-[96px] p-stack-md rounded-xl border bg-surface-container/40 relative overflow-hidden active:opacity-85 ${selectedMuscles.arms
                  ? "border-neon-green bg-surface-container-high/80"
                  : "border-surface-variant/20"
                }`}
            >
              <Text
                className={`font-display text-body-lg font-bold ${selectedMuscles.arms ? "text-neon-green" : "text-on-surface"
                  }`}
              >
                Arms
              </Text>
              <Text
                className={`font-mono text-label-caps tracking-[0.05em] mt-1 ${selectedMuscles.arms
                    ? "text-neon-green/90"
                    : "text-on-surface-variant/40"
                  }`}
              >
                {selectedMuscles.arms ? "HIGH LOAD" : "MODERATE"}
              </Text>

              <View className="absolute bottom-[-10px] right-[-10px] opacity-10 pointer-events-none rotate-[10deg]">
                <MaterialCommunityIcons
                  name="arm-flex"
                  size={64}
                  color={selectedMuscles.arms ? "#abd600" : "#e5e2e1"}
                />
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
