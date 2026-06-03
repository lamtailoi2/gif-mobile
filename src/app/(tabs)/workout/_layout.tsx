import { Stack } from "expo-router";

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Workout",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Exercise Details",
        }}
      />
      <Stack.Screen
        name="active-session"
        options={{
          title: "Active Session",
        }}
      />
      <Stack.Screen
        name="session-complete"
        options={{
          title: "Session Complete",
        }}
      />
    </Stack>
  );
}
