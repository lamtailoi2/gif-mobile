import AppHeader from "@/components/app-header";
import { BottomTabInset, GIFColors, MaxContentWidth } from "@/constants/theme";
import AiGreeting from "@/features/home/components/ai-greeting";
import ReadinessGauge from "@/features/home/components/readiness-gauge";
import RecoveryMap from "@/features/home/components/recovery-map";
import StreakCard from "@/features/home/components/streak-card";
import TodaysWorkoutCard from "@/features/home/components/todays-workout-card";
import { useHomeDashboard } from "@/features/home/hooks/use-home-dashboard";
import { useUser } from "@clerk/expo";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  const { data, isLoading } = useHomeDashboard();
  const { user } = useUser();
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: GIFColors.background }}
    >
      <AppHeader
        avatarUrl={user?.imageUrl}
        hasNotification={data?.hasNotification ?? false}
        onNotificationPress={() => console.log("notification pressed")}
      />

      {isLoading || !data ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={GIFColors.primaryFixedDim} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: BottomTabInset + 120,
            maxWidth: MaxContentWidth,
            width: "100%",
            alignSelf: "center",
            gap: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <AiGreeting
            userName={data.user.name}
            timeOfDay={data.greetingTimeOfDay}
            workoutType={data.todaysWorkout.type}
          />

          <View className="flex-row gap-stack-md">
            <View className="flex-1">
              <ReadinessGauge readiness={data.readiness} />
            </View>
            <View className="flex-1">
              <StreakCard streak={data.streak} />
            </View>
          </View>

          <TodaysWorkoutCard
            workout={data.todaysWorkout}
            onPress={() => console.log("workout pressed")}
          />

          <RecoveryMap
            recovery={data.recoveryMap}
            onDetailsPress={() => console.log("recovery details pressed")}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
