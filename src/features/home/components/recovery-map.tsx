import { Pressable, Text, View } from "react-native";

import { GIFColors } from "@/constants/theme";
import { IRecoveryMap } from "../types/dashboard";
import GlassPanel from "./glass-panel";

interface IRecoveryMapProps {
  recovery: IRecoveryMap;
  onDetailsPress?: () => void;
}

const GREEN_GLOW = {
  shadowColor: GIFColors.primaryFixedDim,
  shadowOpacity: 0.8,
  shadowRadius: 15,
  shadowOffset: { width: 0, height: 0 },
  elevation: 6,
};

const BLUE_GLOW = {
  shadowColor: GIFColors.secondary,
  shadowOpacity: 0.6,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 0 },
  elevation: 6,
};

export default function RecoveryMap({
  recovery,
  onDetailsPress,
}: IRecoveryMapProps) {
  const chestRecovered = recovery.states.chest === "recovered";
  const shouldersFatigued = recovery.states.shoulders === "fatigued";

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

      <View className="w-full h-48 rounded-lg bg-surface-container-low/50 border border-white/5 items-center justify-center overflow-hidden">
        <View className="w-24 h-40 items-center">
          <View className="w-8 h-10 border border-white/20 rounded-full mb-1" />

          <View className="w-16 h-20 border border-white/20 rounded-md relative">
            {chestRecovered && (
              <View
                className="absolute top-2 left-1/2 w-12 h-6 bg-primary-fixed-dim/60 rounded-full"
                style={[{ transform: [{ translateX: -24 }] }, GREEN_GLOW]}
              />
            )}
          </View>

          {shouldersFatigued && (
            <>
              <View
                className="absolute top-12 -left-1 w-6 h-8 bg-secondary/50 rounded-full"
                style={BLUE_GLOW}
              />
              <View
                className="absolute top-12 -right-1 w-6 h-8 bg-secondary/50 rounded-full"
                style={BLUE_GLOW}
              />
            </>
          )}
        </View>

        <View className="absolute bottom-3 left-3 right-3 flex-row justify-between">
          <View className="flex-row items-center gap-1">
            <View
              className="w-2 h-2 rounded-full bg-primary-fixed-dim"
              style={GREEN_GLOW}
            />
            <Text className="text-[10px] font-mono text-on-surface-variant uppercase">
              Recovered
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View
              className="w-2 h-2 rounded-full bg-secondary"
              style={BLUE_GLOW}
            />
            <Text className="text-[10px] font-mono text-on-surface-variant uppercase">
              Fatigued
            </Text>
          </View>
        </View>
      </View>
    </GlassPanel>
  );
}
