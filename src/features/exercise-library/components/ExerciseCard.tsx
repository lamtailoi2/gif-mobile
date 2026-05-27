import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import { Exercise } from "@/types/common";
import { Image, Pressable, StyleSheet } from "react-native";

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: (exercise: Exercise) => void;
}

export default function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
  const theme = useTheme();

  return (
    <Pressable onPress={() => onPress?.(exercise)}>
      <ThemedView
        style={[
          styles.container,
          {
            borderColor: theme.backgroundSelected,
            backgroundColor: theme.backgroundElement,
          },
        ]}
      >
        {/* Thumbnail */}
        {exercise.thumbnailUrl && (
          <Image
            source={{ uri: exercise.thumbnailUrl }}
            style={styles.thumbnail}
          />
        )}

        {/* Content */}
        <ThemedView style={styles.content}>
          <ThemedText style={styles.title}>{exercise.name}</ThemedText>

          <ThemedView style={styles.meta}>
            <ThemedText style={styles.metaText}>{exercise.category}</ThemedText>
            <ThemedText style={styles.metaText}>
              {exercise.difficulty}
            </ThemedText>
          </ThemedView>

          <ThemedText style={styles.muscleGroups}>
            {exercise.muscleGroups.join(", ")}
          </ThemedText>

          {exercise.equipment && (
            <ThemedText style={styles.equipment}>
              Equipment: {exercise.equipment}
            </ThemedText>
          )}

          <ThemedView style={styles.reps}>
            <ThemedText style={styles.repText}>
              {exercise.defaultSets} sets x {exercise.defaultReps} reps
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
  },
  thumbnail: {
    width: "100%",
    height: 150,
    backgroundColor: "#f0f0f0",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    opacity: 0.7,
    textTransform: "capitalize",
  },
  muscleGroups: {
    fontSize: 13,
    opacity: 0.8,
    marginBottom: 6,
  },
  equipment: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  reps: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  repText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
