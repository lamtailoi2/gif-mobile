import React from "react";
import { useLocalSearchParams } from "expo-router";
import ActiveSession from "@/features/workout-session/components/active-session";

export default function WorkoutActiveSessionScreen() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  return <ActiveSession routineId={routineId ?? ""} />;
}
