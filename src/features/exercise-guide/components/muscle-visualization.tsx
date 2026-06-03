import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Body, { ExtendedBodyPart } from "react-native-body-highlighter";

import { GIFColors } from "@/constants/theme";
import type { MuscleSlug } from "@/features/home/types/dashboard";

interface IMuscleVisualizationProps {
  primaryMuscles: MuscleSlug[];
  secondaryMuscles: MuscleSlug[];
}

const PRIMARY_COLOR = "#abd600"; // Neon Green
const SECONDARY_COLOR = "#adc6ff"; // Electric Blue

const toBodyData = (
  primaryMuscles: MuscleSlug[],
  secondaryMuscles: MuscleSlug[],
): ExtendedBodyPart[] => {
  const data: ExtendedBodyPart[] = [];

  // Primary muscles - Neon Green with high intensity
  primaryMuscles.forEach((slug) => {
    data.push({
      slug,
      color: PRIMARY_COLOR,
      intensity: 2,
    });
  });

  // Secondary muscles - Electric Blue with lower intensity
  secondaryMuscles.forEach((slug) => {
    data.push({
      slug,
      color: SECONDARY_COLOR,
      intensity: 1,
    });
  });

  return data;
};

const GLOW = (color: string) => ({
  shadowColor: color,
  shadowOpacity: 0.8,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 0 },
  elevation: 4,
});

export default function MuscleVisualization({
  primaryMuscles,
  secondaryMuscles,
}: IMuscleVisualizationProps) {
  const [side, setSide] = useState<"front" | "back">("front");
  const data = toBodyData(primaryMuscles, secondaryMuscles);

  return (
    <View className="glass-card p-6 rounded-xl relative overflow-hidden flex flex-col items-center bg-surface-container/40 border border-white/10">
      <Text className="text-label-caps font-label-caps text-on-surface-variant/60 uppercase mb-4 self-start">
        Muscle Groups
      </Text>

      <View className="w-full rounded-lg bg-surface-container-low/50 border border-white/5 items-center justify-center overflow-hidden py-4">
        <Body
          data={data}
          side={side}
          gender="male"
          scale={1.1}
          border={GIFColors.outlineVariant}
          defaultFill={GIFColors.surfaceContainerHigh}
        />

        {/* Front/Back Toggle */}
        <View className="absolute top-3 right-3 flex-row rounded-full bg-surface-container-high/70 border border-white/10 p-0.5">
          <Pressable
            onPress={() => setSide("front")}
            className={`px-3 py-1 rounded-full ${
              side === "front" ? "bg-primary-fixed-dim" : ""
            }`}
          >
            <Text
              className={`text-[10px] font-mono uppercase ${
                side === "front"
                  ? "text-on-primary-fixed"
                  : "text-on-surface-variant"
              }`}
            >
              Front
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSide("back")}
            className={`px-3 py-1 rounded-full ${
              side === "back" ? "bg-primary-fixed-dim" : ""
            }`}
          >
            <Text
              className={`text-[10px] font-mono uppercase ${
                side === "back"
                  ? "text-on-primary-fixed"
                  : "text-on-surface-variant"
              }`}
            >
              Back
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Legend */}
      <View className="flex-row justify-between mt-4 w-full px-1 gap-2">
        <View className="flex-1 flex-row items-center gap-1.5">
          <View
            className="w-2 h-2 rounded-full"
            style={[{ backgroundColor: PRIMARY_COLOR }, GLOW(PRIMARY_COLOR)]}
          />
          <Text className="text-[10px] font-mono text-on-surface-variant uppercase">
            Primary
          </Text>
        </View>
        <View className="flex-1 flex-row items-center gap-1.5">
          <View
            className="w-2 h-2 rounded-full"
            style={[
              { backgroundColor: SECONDARY_COLOR },
              GLOW(SECONDARY_COLOR),
            ]}
          />
          <Text className="text-[10px] font-mono text-on-surface-variant uppercase">
            Secondary
          </Text>
        </View>
      </View>
    </View>
  );
}
