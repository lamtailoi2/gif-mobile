import { Text, View } from "react-native";

interface IAiGreetingProps {
  userName: string;
  timeOfDay: "morning" | "afternoon" | "evening";
  workoutType: string;
}

const TIME_LABELS = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
};

export default function AiGreeting({
  userName,
  timeOfDay,
  workoutType,
}: IAiGreetingProps) {
  return (
    <View className="mt-stack-sm mb-base">
      <Text className="text-label-caps font-mono uppercase text-secondary opacity-80 mb-1">
        AI SYNC COMPLETE
      </Text>
      <Text className="text-headline-lg-mobile font-display text-primary tracking-tight">
        {TIME_LABELS[timeOfDay]}, {userName}.
      </Text>
      <Text className="text-headline-lg-mobile font-display text-primary-fixed-dim tracking-tight">
        Ready for {workoutType}?
      </Text>
    </View>
  );
}
