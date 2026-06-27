import { Button } from "@/components/ui/button";
import { getAllExercises } from "@/features/exercise-library/apis";
import ExerciseLibraryList from "@/features/exercise-library/components/exercise-library-list";
import { IExercise } from "@/features/exercise-library/types/exercise";
import { generateWorkoutPlan, getAiWorkoutPlan, saveAiWorkoutPlan } from "@/features/profile/ai-service/training-goals.service";
import { IWorkoutPlanResponse } from "@/features/profile/ai-service/types";
import AiScheduleDisplay from "@/features/profile/ai-service/components/ai-schedule-display";
import AppHeader from "@/components/app-header";
import { useTheme } from "@/hooks/use-theme";
import { getUserProfile } from "@/lib/profile";
import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ActivityIndicator, View, Text, Pressable, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import { EHomeQueryKeys } from "@/features/home/queries/key";

// Persistence keys
const getPlanCacheKey = (userId?: string) => userId ? `ai_workout_plan_cached_${userId}` : "ai_workout_plan_cached";

export default function WorkoutScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"library" | "ai">("library");
  const [loadingAi, setLoadingAi] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<IWorkoutPlanResponse | null>(null);
  const [exercises, setExercises] = useState<IExercise[]>([]);

  // Load plan and exercises library on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load exercise library
        const library = await getAllExercises();
        setExercises(library);

        if (!user?.id) return;
        const cacheKey = getPlanCacheKey(user.id);
        let planFromCache: IWorkoutPlanResponse | null = null;

        // Load plan from cache
        if (Platform.OS === "web") {
          const cached = localStorage.getItem(cacheKey);
          if (cached) planFromCache = JSON.parse(cached);
        } else {
          const cached = await SecureStore.getItemAsync(cacheKey);
          if (cached) planFromCache = JSON.parse(cached);
        }

        // Check Firestore if not in local cache
        if (!planFromCache) {
          planFromCache = await getAiWorkoutPlan(user.id);
          if (planFromCache) {
            if (Platform.OS === "web") {
              localStorage.setItem(cacheKey, JSON.stringify(planFromCache));
            } else {
              await SecureStore.setItemAsync(cacheKey, JSON.stringify(planFromCache));
            }
          }
        }

        if (planFromCache) setWorkoutPlan(planFromCache);
      } catch (error) {
        console.error("Failed to load initialized data:", error);
      }
    };

    initializeData();
  }, [user?.id]);

  const handleExercisePress = (exercise: IExercise) => {
    router.push({
      pathname: "/workout/guide/[id]",
      params: {
        id: exercise.id,
      },
    });
  };

  const handleRecommendPress = async () => {
    if (loadingAi) return;
    setLoadingAi(true);
    console.log("=== START AI PLAN GENERATION ===");
    try {
      const profile = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        ...getUserProfile(user),
      };
      console.log("Input Profile:", JSON.stringify(profile, null, 2));

      // Re-fetch exercises if library is empty
      let library = exercises;
      if (library.length === 0) {
        library = await getAllExercises();
        setExercises(library);
      }

      const result = await generateWorkoutPlan(profile);
      console.log("=== API RESPONSE SUCCESS ===");
      console.log(JSON.stringify(result, null, 2));

      // Save to state & local cache
      setWorkoutPlan(result);
      if (user?.id) {
        const cacheKey = getPlanCacheKey(user.id);
        if (Platform.OS === "web") {
          localStorage.setItem(cacheKey, JSON.stringify(result));
        } else {
          await SecureStore.setItemAsync(cacheKey, JSON.stringify(result));
        }
        await saveAiWorkoutPlan(user.id, result);
        
        // Send email notification to user about their new AI plan
        const userEmail = user.primaryEmailAddress?.emailAddress;
        if (userEmail) {
          const { sendAiPlanReadyEmail } = await import("@/lib/email");
          sendAiPlanReadyEmail(userEmail, user.firstName || "Hội viên");
        }
        
        // Invalidate Home Dashboard cache so it fetches the newly created AI plan immediately
        queryClient.invalidateQueries({
          queryKey: [EHomeQueryKeys.GetHomeDashboard, user.id],
        });
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
    } finally {
      setLoadingAi(false);
    }
  };

  const profile = getUserProfile(user);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      {/* Brand App Header */}
      <AppHeader title="Workout" avatarUrl={user?.imageUrl} />

      {/* Segmented Tab Switcher */}
      <View className="flex-row mx-gutter my-3 p-1 rounded-full bg-surface-container-high/60 border border-surface-variant/15">
        <Pressable
          onPress={() => setActiveTab("library")}
          className={`flex-1 py-2.5 rounded-full items-center justify-center flex-row gap-1.5 ${
            activeTab === "library" ? "bg-[#abd600]" : ""
          }`}
        >
          <MaterialIcons 
            name="format-list-bulleted" 
            size={16} 
            color={activeTab === "library" ? "#283500" : theme.onSurfaceVariant} 
          />
          <Text
            className={`font-body text-xs font-bold ${
              activeTab === "library" ? "text-[#283500]" : "text-on-surface-variant"
            }`}
          >
            Exercise Library
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab("ai")}
          className={`flex-1 py-2.5 rounded-full items-center justify-center flex-row gap-1.5 ${
            activeTab === "ai" ? "bg-[#abd600]" : ""
          }`}
        >
          <MaterialIcons 
            name="psychology" 
            size={16} 
            color={activeTab === "ai" ? "#283500" : theme.onSurfaceVariant} 
          />
          <Text
            className={`font-body text-xs font-bold ${
              activeTab === "ai" ? "text-[#283500]" : "text-on-surface-variant"
            }`}
          >
            AI Plan
          </Text>
        </Pressable>
      </View>

      {/* Tab Contents */}
      {activeTab === "library" ? (
        <ExerciseLibraryList onExercisePress={handleExercisePress} />
      ) : loadingAi ? (
        <View className="flex-1 justify-center items-center p-gutter gap-4">
          <ActivityIndicator size="large" color="#abd600" />
          <Text className="text-on-surface font-body text-sm font-semibold text-center px-6 leading-6">
            AI Coach is analyzing your metrics & creating an optimal workout plan...
          </Text>
        </View>
      ) : workoutPlan ? (
        <AiScheduleDisplay
          plan={workoutPlan}
          exerciseLibrary={exercises}
          onExercisePress={handleExercisePress}
          onRecreatePress={handleRecommendPress}
          loading={loadingAi}
        />
      ) : (
        <ScrollView className="flex-1 px-gutter" contentContainerClassName="py-4">
          <View className="p-6 rounded-2xl border bg-surface-container/50 border-surface-variant/25 items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-[#4b8eff]/10 items-center justify-center border border-[#4b8eff]/35">
              <MaterialIcons name="psychology" size={36} color="#4b8eff" />
            </View>
            <Text className="font-display text-xl font-bold text-on-surface text-center">
              Personalized AI Coach
            </Text>
            <Text className="font-body text-sm text-center leading-5 text-on-surface-variant">
              Create a smart workout plan based on your body metrics and specific goals.
            </Text>
            
            {/* User profile parameters summary */}
            <View className="w-full bg-surface-container-low/40 border border-surface-variant/10 p-4 rounded-xl gap-2.5 my-2">
              <Text className="font-body text-xs text-on-surface-variant font-bold">
                Your current metrics:
              </Text>
              <View className="flex-row justify-between border-b border-surface-variant/10 pb-2">
                <Text className="font-body text-xs text-on-surface-variant">Goal:</Text>
                <Text className="font-body text-xs text-on-surface font-bold">
                  {profile.goal === "lose_weight" 
                    ? "Lose Weight" 
                    : profile.goal === "build_muscle" 
                      ? "Build Muscle" 
                      : profile.goal === "improve_endurance" 
                        ? "Improve Endurance" 
                        : "Maintain Health"}
                </Text>
              </View>
              <View className="flex-row justify-between border-b border-surface-variant/10 pb-2">
                <Text className="font-body text-xs text-on-surface-variant">Level:</Text>
                <Text className="font-body text-xs text-on-surface font-bold">
                  {profile.level === "beginner" 
                    ? "Beginner" 
                    : profile.level === "intermediate" 
                      ? "Intermediate" 
                      : "Advanced"}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-body text-xs text-on-surface-variant">Days per week:</Text>
                <Text className="font-body text-xs text-on-surface font-bold">
                  {profile.daysPerWeek || 3} days
                </Text>
              </View>
            </View>

            <Button onPress={handleRecommendPress} className="w-full mt-2">
              Generate AI Plan
            </Button>
            
            <Text className="font-body text-[10px] text-on-surface-variant text-center opacity-60">
              *You can change your goals in the Profile tab at any time.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
