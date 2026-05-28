import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Exercise } from "@/types/common";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: (exercise: Exercise) => void;
}

export default function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
  const theme = useTheme();

  const equipmentText = Array.isArray(exercise.equipment)
    ? exercise.equipment.join(", ")
    : exercise.equipment || "Equipment";

  return (
    <Pressable
      onPress={() => onPress?.(exercise)}
      style={({ pressed }) => [
        styles.pressableContainer,
        {
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <ThemedView
        style={[
          styles.container,
          {
            backgroundColor: `${theme.surfaceContainer}99`,
            borderColor: `${theme.border}40`,
          },
        ]}
      >
        {/* Thumbnail */}
        {exercise.thumbnailUrl && (
          <View
            style={[
              styles.thumbnailContainer,
              { borderColor: `${theme.border}40` },
            ]}
          >
            <Image
              source={{ uri: exercise.thumbnailUrl }}
              style={styles.thumbnail}
            />
          </View>
        )}

        {/* Content Container */}
        <View style={styles.contentWrapper}>
          {/* Left Content */}
          <View style={styles.mainContent}>
            {/* Category */}
            <ThemedText
              style={[
                styles.categoryLabel,
                { color: theme.secondaryContainer },
              ]}
            >
              {exercise.category}
            </ThemedText>

            {/* Title */}
            <ThemedText style={[styles.title, { color: theme.onSurface }]}>
              {exercise.name}
            </ThemedText>

            {/* Muscle Groups */}
            <ThemedText
              style={[styles.muscleGroups, { color: theme.onSurfaceVariant }]}
            >
              {exercise.muscleGroups.join(", ")}
            </ThemedText>

            {/* Meta Info Row */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <MaterialIcons
                  name="fitness-center"
                  size={14}
                  color={theme.onSurfaceVariant}
                />
                <ThemedText
                  style={[styles.metaValue, { color: theme.onSurfaceVariant }]}
                >
                  {equipmentText}
                </ThemedText>
              </View>

              <View style={styles.metaItem}>
                <MaterialIcons
                  name="schedule"
                  size={14}
                  color={theme.onSurfaceVariant}
                />
                <ThemedText
                  style={[styles.metaValue, { color: theme.onSurfaceVariant }]}
                >
                  {exercise.defaultReps} reps
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Right Content: Difficulty & Buttons */}
          <View style={styles.rightContent}>
            {/* Difficulty Badge */}
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor:
                    exercise.difficulty === "Advanced"
                      ? `${theme.error}33`
                      : exercise.difficulty === "Intermediate"
                        ? `${theme.outlineVariant}33`
                        : `${theme.primaryFixedDim}33`,
                  borderColor:
                    exercise.difficulty === "Advanced"
                      ? `${theme.error}66`
                      : exercise.difficulty === "Intermediate"
                        ? `${theme.outlineVariant}66`
                        : `${theme.primaryFixedDim}66`,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.difficultyText,
                  {
                    color:
                      exercise.difficulty === "Advanced"
                        ? theme.error
                        : exercise.difficulty === "Intermediate"
                          ? theme.onSurfaceVariant
                          : theme.primaryFixedDim,
                  },
                ]}
              >
                {exercise.difficulty}
              </ThemedText>
            </View>

            {/* Chevron */}
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={theme.onSurfaceVariant}
              style={{ opacity: 0.5 }}
            />

            {/* Add Button */}
            <Pressable
              onPress={() => onPress?.(exercise)}
              style={({ pressed: addPressed }) => [
                styles.addButton,
                {
                  backgroundColor: addPressed
                    ? theme.primaryFixedDim
                    : `${theme.primaryFixedDim}20`,
                  borderColor: theme.primaryFixedDim,
                },
              ]}
            >
              <MaterialIcons
                name="add"
                size={20}
                color={theme.primaryFixedDim}
              />
            </Pressable>
          </View>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {},
  container: {
    borderRadius: Radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: Spacing.gutter,
    flexDirection: "row",
  },
  thumbnailContainer: {
    width: 100,
    height: 100,
    borderRightWidth: 1,
    overflow: "hidden",
    flexShrink: 0,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  contentWrapper: {
    flex: 1,
    flexDirection: "row",
    padding: Spacing.stackMd,
    gap: Spacing.gutter,
    alignItems: "flex-start",
  },
  mainContent: {
    flex: 1,
    gap: 4,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  muscleGroups: {
    fontSize: 15,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.gutter,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  rightContent: {
    alignItems: "flex-end",
    gap: 8,
    justifyContent: "flex-start",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});
