import { Button } from "@/components/ui/button";
import { getAllExercises } from "@/features/exercise-library/apis";
import ExerciseLibraryList from "@/features/exercise-library/components/exercise-library-list";
import { IExercise } from "@/features/exercise-library/types/exercise";
import { generateWorkoutPlan } from "@/features/profile/ai-service/training-goals.service";
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

// Persistence keys
const PLAN_CACHE_KEY = "ai_workout_plan_cached";

export default function WorkoutScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"library" | "ai">("library");
  const [loadingAi, setLoadingAi] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<IWorkoutPlanResponse | null>(null);
  const [exercises, setExercises] = useState<IExercise[]>([]);

  // Load plan and exercises library on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load plan from cache
        if (Platform.OS === "web") {
          const cached = localStorage.getItem(PLAN_CACHE_KEY);
          if (cached) setWorkoutPlan(JSON.parse(cached));
        } else {
          const cached = await SecureStore.getItemAsync(PLAN_CACHE_KEY);
          if (cached) setWorkoutPlan(JSON.parse(cached));
        }

        // Load exercise library
        const library = await getAllExercises();
        setExercises(library);
      } catch (error) {
        console.error("Failed to load initialized data:", error);
      }
    };

    initializeData();
  }, []);

  const handleExercisePress = (exercise: IExercise) => {
    router.push({
      pathname: "../(tabs)/workout/[id]",
      params: {
        id: exercise.id,
        name: exercise.name,
        slug: exercise.slug || "",
        category: exercise.category,
        difficulty: exercise.difficulty,
        muscleGroups: JSON.stringify(exercise.muscleGroups),
        equipment: JSON.stringify(exercise.equipment),
        defaultReps: String(exercise.defaultReps),
        thumbnailUrl: exercise.thumbnailUrl || "",
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
      if (Platform.OS === "web") {
        localStorage.setItem(PLAN_CACHE_KEY, JSON.stringify(result));
      } else {
        await SecureStore.setItemAsync(PLAN_CACHE_KEY, JSON.stringify(result));
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
            Thư viện bài tập
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
            Lịch tập AI
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
            HLV AI đang phân tích thể chất & thiết lập lịch tập tối ưu cho bạn...
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
              HLV AI Cá Nhân Hóa
            </Text>
            <Text className="font-body text-sm text-center leading-5 text-on-surface-variant">
              Tạo lịch tập thông minh dựa trên thông số cơ thể và mục tiêu riêng của bạn.
            </Text>
            
            {/* User profile parameters summary */}
            <View className="w-full bg-surface-container-low/40 border border-surface-variant/10 p-4 rounded-xl gap-2.5 my-2">
              <Text className="font-body text-xs text-on-surface-variant font-bold">
                Thông số hiện tại của bạn:
              </Text>
              <View className="flex-row justify-between border-b border-surface-variant/10 pb-2">
                <Text className="font-body text-xs text-on-surface-variant">Mục tiêu:</Text>
                <Text className="font-body text-xs text-on-surface font-bold">
                  {profile.goal === "lose_weight" 
                    ? "Giảm cân" 
                    : profile.goal === "build_muscle" 
                      ? "Tăng cơ" 
                      : profile.goal === "improve_endurance" 
                        ? "Tăng thể lực" 
                        : "Duy trì sức khỏe"}
                </Text>
              </View>
              <View className="flex-row justify-between border-b border-surface-variant/10 pb-2">
                <Text className="font-body text-xs text-on-surface-variant">Trình độ:</Text>
                <Text className="font-body text-xs text-on-surface font-bold">
                  {profile.level === "beginner" 
                    ? "Mới bắt đầu" 
                    : profile.level === "intermediate" 
                      ? "Trung bình" 
                      : "Nâng cao"}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-body text-xs text-on-surface-variant">Số ngày tập/tuần:</Text>
                <Text className="font-body text-xs text-on-surface font-bold">
                  {profile.daysPerWeek || 3} ngày
                </Text>
              </View>
            </View>

            <Button onPress={handleRecommendPress} className="w-full mt-2">
              Bắt đầu thiết lập lịch tập AI
            </Button>
            
            <Text className="font-body text-[10px] text-on-surface-variant text-center opacity-60">
              *Bạn có thể thay đổi mục tiêu ở tab Profile bất cứ lúc nào.
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
