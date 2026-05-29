import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { GIFColors } from "@/constants/theme";
import { ITodaysWorkout } from "../types/dashboard";
import GlassPanel from "./glass-panel";

interface ITodaysWorkoutCardProps {
  workout: ITodaysWorkout;
  onPress?: () => void;
}

export default function TodaysWorkoutCard({
  workout,
  onPress,
}: ITodaysWorkoutCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="active:opacity-90 active:scale-[0.99]"
    >
      <GlassPanel className="p-1">
        <View className="bg-surface/90 rounded-md p-5 border border-white/5">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="flex-row items-center gap-1 px-2 py-0.5 rounded border bg-primary-fixed-dim/20 border-primary-fixed-dim/30">
                  <MaterialIcons
                    name="smart-toy"
                    size={10}
                    color={GIFColors.primaryFixedDim}
                  />
                  <Text className="text-[10px] font-mono text-primary-fixed-dim uppercase tracking-widest">
                    AI REC
                  </Text>
                </View>
                <Text className="text-label-caps font-mono text-on-surface-variant uppercase">
                  Today&apos;s Protocol
                </Text>
              </View>
              <Text className="text-headline-md font-display text-primary">
                {workout.type}
              </Text>
              <Text className="text-body-md font-body text-on-surface-variant">
                Focus: {workout.focus}
              </Text>
            </View>

            <View
              className="w-12 h-12 rounded-full bg-primary-fixed-dim items-center justify-center"
              style={{
                shadowColor: GIFColors.primaryFixedDim,
                shadowOpacity: 0.4,
                shadowRadius: 15,
                shadowOffset: { width: 0, height: 0 },
                elevation: 8,
              }}
            >
              <MaterialIcons
                name="play-arrow"
                size={28}
                color={GIFColors.onPrimaryFixed}
              />
            </View>
          </View>

          <View className="flex-row gap-gutter mt-stack-md border-t border-white/10 pt-4">
            <View className="flex-col">
              <Text className="text-[10px] font-mono text-on-surface-variant mb-1 uppercase">
                DURATION
              </Text>
              <Text className="text-body-lg font-display font-bold text-primary">
                {workout.durationMin} min
              </Text>
            </View>

            <View className="flex-col">
              <Text className="text-[10px] font-mono text-on-surface-variant mb-1 uppercase">
                INTENSITY
              </Text>
              <Text className="text-body-lg font-display font-bold text-primary">
                {workout.intensity}
              </Text>
            </View>

            <View className="flex-col ml-auto items-end">
              <Text className="text-[10px] font-mono text-on-surface-variant mb-1 uppercase">
                LOAD
              </Text>
              <Text className="text-body-lg font-display font-bold text-primary">
                {workout.load}
              </Text>
            </View>
          </View>
        </View>
      </GlassPanel>
    </Pressable>
  );
}
