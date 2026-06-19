import { getAllExercises } from "@/features/exercise-library/apis";
import { IExercise } from "@/features/exercise-library/types/exercise";
import {
  generateWorkoutPlan,
  saveAiWorkoutPlan,
} from "@/features/profile/ai-service/training-goals.service";
import AppHeader from "@/components/app-header";
import { useTheme } from "@/hooks/use-theme";
import { getUserProfile } from "@/lib/profile";
import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import { EHomeQueryKeys } from "@/features/home/queries/key";

const getPlanCacheKey = (userId?: string) =>
  userId ? `ai_workout_plan_cached_${userId}` : "ai_workout_plan_cached";

export default function CreatePlanScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profile = getUserProfile(user);

  const goalLabel =
    profile.goal === "lose_weight"
      ? "Lose Weight"
      : profile.goal === "build_muscle"
        ? "Build Muscle"
        : profile.goal === "improve_endurance"
          ? "Improve Endurance"
          : "Maintain Health";

  const levelLabel =
    profile.level === "beginner"
      ? "Beginner"
      : profile.level === "intermediate"
        ? "Intermediate"
        : "Advanced";

  const handleGenerate = useCallback(async () => {
    if (loading || !user?.id) return;
    setLoading(true);
    setError(null);

    try {
      const profileData = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        ...getUserProfile(user),
      };

      const library = await getAllExercises();

      const result = await generateWorkoutPlan(profileData);

      const cacheKey = getPlanCacheKey(user.id);
      if (Platform.OS === "web") {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } else {
        await SecureStore.setItemAsync(cacheKey, JSON.stringify(result));
      }
      await saveAiWorkoutPlan(user.id, result);

      queryClient.invalidateQueries({
        queryKey: [EHomeQueryKeys.GetHomeDashboard, user.id],
      });

      router.replace("/(tabs)/workout");
    } catch (e) {
      console.error("AI Generation failed:", e);
      setError("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, user, queryClient, router]);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: theme.background }}>
      <View className="flex-row justify-between items-center px-container-mobile py-4">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-surface-container active:opacity-70"
        >
          <MaterialIcons name="arrow-back" size={22} color="#e5e2e1" />
        </Pressable>
        <Text className="text-headline-lg-mobile font-display tracking-tighter text-primary-fixed-dim">
          AI Coach
        </Text>
        <View className="w-10 h-10" />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center px-gutter gap-4">
          <ActivityIndicator size="large" color="#abd600" />
          <Text className="text-on-surface font-body text-sm font-semibold text-center px-6 leading-6">
            AI Coach is analyzing your metrics {"&"} creating an optimal workout
            plan...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-container-mobile"
          contentContainerClassName="py-4"
        >
          <View className="p-6 rounded-2xl border bg-surface-container/50 border-surface-variant/25 items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-electric-blue/10 items-center justify-center border border-electric-blue/35">
              <MaterialIcons name="psychology" size={36} color="#4b8eff" />
            </View>
            <Text className="font-display text-xl font-bold text-on-surface text-center">
              Personalized AI Coach
            </Text>
            <Text className="font-body text-sm text-center leading-5 text-on-surface-variant">
              Create a smart workout plan based on your body metrics and specific
              goals.
            </Text>

            <View className="w-full bg-surface-container-low/40 border border-surface-variant/10 p-4 rounded-xl gap-2.5 my-2">
              <Text className="font-body text-xs text-on-surface-variant font-bold">
                Your current metrics:
              </Text>
              <View className="flex-row justify-between border-b border-surface-variant/10 pb-2">
                <Text className="font-body text-xs text-on-surface-variant">
                  Goal:
                </Text>
                <Text className="font-body text-xs text-on-surface font-bold">
                  {goalLabel}
                </Text>
              </View>
              <View className="flex-row justify-between border-b border-surface-variant/10 pb-2">
                <Text className="font-body text-xs text-on-surface-variant">
                  Level:
                </Text>
                <Text className="font-body text-xs text-on-surface font-bold">
                  {levelLabel}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-body text-xs text-on-surface-variant">
                  Days per week:
                </Text>
                <Text className="font-body text-xs text-on-surface font-bold">
                  {profile.daysPerWeek || 3} days
                </Text>
              </View>
            </View>

            {error && (
              <View className="w-full bg-error/10 border border-error/30 p-3 rounded-xl">
                <Text className="font-body text-xs text-error text-center">
                  {error}
                </Text>
              </View>
            )}

            <Pressable
              onPress={handleGenerate}
              className="w-full py-4 bg-neon-green rounded-xl items-center active:opacity-80 active:scale-95"
            >
              <Text className="font-display text-body-md font-bold text-background uppercase tracking-wider">
                Generate AI Plan
              </Text>
            </Pressable>

            <Text className="font-body text-[10px] text-on-surface-variant text-center opacity-60">
              *You can change your goals in the Profile tab at any time.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
