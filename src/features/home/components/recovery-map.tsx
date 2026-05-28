import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Body, { ExtendedBodyPart } from "react-native-body-highlighter";

import { GIFColors } from "@/constants/theme";
import { ERecoveryState, IRecoveryMap, MuscleSlug } from "../types/dashboard";
import GlassPanel from "./glass-panel";

interface IRecoveryMapProps {
  recovery: IRecoveryMap;
  onDetailsPress?: () => void;
}

const STATE_COLOR: Record<ERecoveryState, string> = {
  [ERecoveryState.Recovered]: GIFColors.primaryFixedDim,
  [ERecoveryState.Fatigued]: GIFColors.secondary,
  [ERecoveryState.Neutral]: GIFColors.surfaceContainerHigh,
};

const STATE_INTENSITY: Record<ERecoveryState, number> = {
  [ERecoveryState.Recovered]: 1,
  [ERecoveryState.Fatigued]: 2,
  [ERecoveryState.Neutral]: 0,
};

const toBodyData = (
  states: Partial<Record<MuscleSlug, ERecoveryState>>,
): ExtendedBodyPart[] =>
  Object.entries(states).map(([slug, state]) => ({
    slug: slug as MuscleSlug,
    color: STATE_COLOR[state as ERecoveryState],
    intensity: STATE_INTENSITY[state as ERecoveryState],
  }));

const GLOW = (color: string) => ({
  shadowColor: color,
  shadowOpacity: 0.8,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 0 },
  elevation: 4,
});

export default function RecoveryMap({
  recovery,
  onDetailsPress,
}: IRecoveryMapProps) {
  const [side, setSide] = useState<"front" | "back">("front");
  const data = toBodyData(recovery.states);

  return (
    <GlassPanel className="p-6">
      <View className="flex-row justify-between items-center mb-stack-md">
        <Text className="text-body-lg font-display text-on-background">
          Recovery Map
        </Text>
        <Pressable onPress={onDetailsPress} className="active:opacity-70">
          <Text className="text-sm font-mono text-primary-fixed-dim uppercase">
            Details
          </Text>
        </Pressable>
      </View>

      <View className="w-full rounded-lg bg-surface-container-low/50 border border-white/5 items-center justify-center overflow-hidden py-4">
        <Body
          data={data}
          side={side}
          gender="male"
          scale={1.1}
          border={GIFColors.outlineVariant}
          defaultFill={GIFColors.surfaceContainerHigh}
        />

        <View className="absolute top-3 right-3 flex-row rounded-full bg-surface-container-high/70 border border-white/10 p-0.5">
          <Pressable
            onPress={() => setSide("front")}
            className={`px-3 py-1 rounded-full ${side === "front" ? "bg-primary-fixed-dim" : ""}`}
          >
            <Text
              className={`text-[10px] font-mono uppercase ${side === "front" ? "text-on-primary-fixed" : "text-on-surface-variant"}`}
            >
              Front
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSide("back")}
            className={`px-3 py-1 rounded-full ${side === "back" ? "bg-primary-fixed-dim" : ""}`}
          >
            <Text
              className={`text-[10px] font-mono uppercase ${side === "back" ? "text-on-primary-fixed" : "text-on-surface-variant"}`}
            >
              Back
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-row justify-between mt-3 px-1">
        <View className="flex-row items-center gap-1.5">
          <View
            className="w-2 h-2 rounded-full bg-primary-fixed-dim"
            style={GLOW(GIFColors.primaryFixedDim)}
          />
          <Text className="text-[10px] font-mono text-on-surface-variant uppercase">
            Recovered
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View
            className="w-2 h-2 rounded-full bg-secondary"
            style={GLOW(GIFColors.secondary)}
          />
          <Text className="text-[10px] font-mono text-on-surface-variant uppercase">
            Fatigued
          </Text>
        </View>
      </View>
    </GlassPanel>
  );
}
