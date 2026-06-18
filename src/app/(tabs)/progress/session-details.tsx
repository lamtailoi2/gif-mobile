import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useGetSessionDetails } from "@/features/history/queries";

export default function SessionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: session, isLoading, isError } = useGetSessionDetails(id ?? "");

  const totalSets = useMemo(() => {
    if (!session?.exerciseLogs) return 0;
    return session.exerciseLogs.reduce((acc, ex) => acc + ex.sets.length, 0);
  }, [session]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#abd600" />
      </SafeAreaView>
    );
  }

  if (isError || !session) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-container-mobile">
        <MaterialIcons name="error-outline" size={48} color="#ffb4ab" />
        <Text className="font-display text-body-lg font-bold text-error mt-4 text-center">
          Could not load session details
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 px-6 py-3 rounded-xl bg-surface-container border border-surface-variant/20 active:opacity-70"
        >
          <Text className="font-display text-body-md font-bold text-on-surface">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const durationMin = Math.round((session.durationSec || 0) / 60);
  const totalVolume = session.totalVolume || 0;
  const totalExercises = session.exerciseLogs?.length || 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-container-mobile py-stack-sm flex-row items-center border-b border-surface-variant/10">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 justify-center items-center rounded-full bg-surface-container/60 border border-surface-variant/25 active:opacity-70 mr-4"
        >
          <MaterialIcons name="arrow-back" size={22} color="#e5e2e1" />
        </Pressable>
        <View className="flex-1">
          <Text className="font-display text-headline-sm font-bold text-on-surface" numberOfLines={1}>
            {session.routineName || "Workout Session"}
          </Text>
          <Text className="font-body text-body-sm text-on-surface-variant/70">
            {new Date(session.completedAt).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerClassName="px-container-mobile pt-stack-sm pb-stack-lg gap-6" showsVerticalScrollIndicator={false}>
        
        {/* Session Stats */}
        <View className="bg-surface-container/40 border border-surface-variant/20 rounded-xl p-4 gap-3 shadow-sm">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="lightning-bolt" size={16} color="#abd600" />
            <Text className="font-mono text-label-caps text-neon-green tracking-[0.1em]">
              SESSION STATS
            </Text>
          </View>
          <View className="flex-row justify-between">
            <View className="items-center gap-1">
              <Text className="font-display text-[22px] font-bold text-neon-green">
                {totalVolume.toLocaleString()}
              </Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 tracking-[0.08em]">VOL (lbs)</Text>
            </View>
            <View className="w-px bg-surface-variant/20" />
            <View className="items-center gap-1">
              <Text className="font-display text-[22px] font-bold text-electric-blue">
                {totalSets}
              </Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 tracking-[0.08em]">SETS</Text>
            </View>
            <View className="w-px bg-surface-variant/20" />
            <View className="items-center gap-1">
              <Text className="font-display text-[22px] font-bold text-on-surface">
                {totalExercises}
              </Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 tracking-[0.08em]">EXERCISES</Text>
            </View>
            <View className="w-px bg-surface-variant/20" />
            <View className="items-center gap-1">
              <Text className="font-display text-[22px] font-bold text-on-surface">
                {durationMin}
              </Text>
              <Text className="font-mono text-[10px] text-on-surface-variant/50 tracking-[0.08em]">MIN</Text>
            </View>
          </View>
        </View>

        {/* Exercises List */}
        <View className="gap-4">
          <Text className="font-display text-body-lg font-bold text-on-surface mb-1">
            Exercise Logs
          </Text>
          
          {!session.exerciseLogs || session.exerciseLogs.length === 0 ? (
            <View className="bg-surface-container/30 border border-surface-variant/10 rounded-xl p-6 items-center">
              <Text className="font-body text-body-md text-on-surface-variant/60">No detailed logs found for this session.</Text>
            </View>
          ) : (
            session.exerciseLogs.map((exercise, index) => (
              <View key={exercise.exerciseId + index} className="bg-surface-container/40 border border-surface-variant/20 rounded-xl overflow-hidden shadow-sm">
                {/* Exercise Header */}
                <View className="px-4 py-3 bg-surface-container-high/50 flex-row items-center justify-between">
                  <Text className="font-display text-body-lg font-bold text-electric-blue">
                    {index + 1}. {exercise.exerciseName}
                  </Text>
                  <Text className="font-mono text-[11px] text-on-surface-variant/50">{exercise.sets.length} sets</Text>
                </View>

                {/* Sets Header */}
                <View className="flex-row items-center px-4 py-2 border-b border-surface-variant/10">
                  <Text className="font-mono text-[10px] text-on-surface-variant/50 w-8 text-center">SET</Text>
                  <Text className="font-mono text-[10px] text-on-surface-variant/50 flex-1 ml-2 text-center">WEIGHT (LBS)</Text>
                  <Text className="font-mono text-[10px] text-on-surface-variant/50 flex-1 ml-2 text-center">REPS</Text>
                </View>

                {/* Sets List */}
                {exercise.sets.map((set, setIndex) => (
                  <View key={setIndex} className="flex-row items-center px-4 py-3 border-b border-surface-variant/5">
                    {/* Set Number */}
                    <View className="w-8 items-center justify-center">
                      <View className="w-6 h-6 rounded-md items-center justify-center bg-surface-variant/20">
                        <Text className="font-mono text-label-caps text-on-surface-variant">
                          {setIndex + 1}
                        </Text>
                      </View>
                    </View>

                    {/* Weight */}
                    <View className="flex-1 ml-2 items-center justify-center">
                      <Text className="font-display text-body-md font-bold text-on-surface">
                        {set.weight}
                      </Text>
                    </View>

                    {/* Reps */}
                    <View className="flex-1 ml-2 items-center justify-center">
                      <Text className="font-display text-body-md font-bold text-on-surface">
                        {set.reps}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
