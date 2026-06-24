import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { GIFColors } from "@/constants/theme";
import { IStreak } from "../types/dashboard";
import GlassPanel from "./glass-panel";

interface IStreakCardProps {
  streak: IStreak;
}

export default function StreakCard({ streak }: IStreakCardProps) {
  return (
    <GlassPanel className="p-6 min-h-[220px]">
      <View className="flex-row justify-between items-center gap-2">
        <Text
          numberOfLines={1}
          className="flex-1 text-body-md font-display text-on-background"
        >
          Training Streak
        </Text>
        <View className="w-8 h-8 rounded-full bg-surface-container-high/50 border border-white/5 items-center justify-center shrink-0">
          <MaterialIcons
            name="local-fire-department"
            size={18}
            color={GIFColors.secondary}
          />
        </View>
      </View>

      <View className="mt-auto pt-stack-md">
        <View className="flex-row items-baseline gap-2">
          <Text className="text-display-lg font-display text-primary tracking-tighter">
            {streak.days}
          </Text>
          <Text className="text-body-lg font-body text-on-surface-variant">
            Weeks
          </Text>
        </View>

        <View className="mt-2 h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
          <View
            className="h-full w-full rounded-full bg-secondary"
            style={{
              shadowColor: GIFColors.secondary,
              shadowOpacity: 0.5,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 0 },
              elevation: 4,
            }}
          />
        </View>

        <Text className="text-label-caps font-mono text-on-surface-variant opacity-70 mt-3 uppercase">
          TOP {streak.percentile}% CONSISTENCY
        </Text>
      </View>
    </GlassPanel>
  );
}
