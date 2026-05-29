import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

import { GIFColors } from "@/constants/theme";
import { IReadiness } from "../types/dashboard";
import GlassPanel from "./glass-panel";

interface IReadinessGaugeProps {
  readiness: IReadiness;
}

const SIZE = 128;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ReadinessGauge({ readiness }: IReadinessGaugeProps) {
  const clamped = Math.max(0, Math.min(100, readiness.score));
  const dashOffset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <GlassPanel className="p-6 min-h-[220px] items-center justify-center">
      <View className="w-full flex-row justify-between items-center gap-2 mb-2">
        <Text
          numberOfLines={1}
          className="flex-1 text-body-md font-display text-on-background"
        >
          Readiness
        </Text>
        <MaterialIcons
          name="bolt"
          size={20}
          color={GIFColors.onSurfaceVariant}
        />
      </View>

      <View
        style={{ width: SIZE, height: SIZE }}
        className="items-center justify-center mt-2"
      >
        <Svg width={SIZE} height={SIZE} style={{ position: "absolute" }}>
          <Defs>
            <LinearGradient id="readinessGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={GIFColors.secondary} />
              <Stop offset="1" stopColor={GIFColors.primaryFixedDim} />
            </LinearGradient>
          </Defs>

          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#1A1A1A"
            strokeWidth={STROKE_WIDTH}
            fill="transparent"
          />

          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#readinessGradient)"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={dashOffset}
            fill="transparent"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>

        <View className="items-center justify-center">
          <View className="flex-row items-baseline">
            <Text className="text-[32px] font-display font-bold text-primary tracking-tighter">
              {clamped}
            </Text>
            <Text className="text-xl font-display text-primary">%</Text>
          </View>
          <Text className="text-[10px] font-mono text-primary-fixed-dim uppercase tracking-widest -mt-1">
            {readiness.label}
          </Text>
        </View>
      </View>
    </GlassPanel>
  );
}
