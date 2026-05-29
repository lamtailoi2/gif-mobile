import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Exercise } from "@/types/common";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface ExerciseGuideProps {
  exercise: Exercise;
}

export default function ExerciseGuide({ exercise }: ExerciseGuideProps) {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Fixed Header with Back Button */}
      <View
        style={{
          paddingHorizontal: Spacing.containerPaddingMobile,
          paddingTop: Spacing.stackSm,
          paddingBottom: Spacing.stackSm,
          backgroundColor: theme.background,
          borderBottomWidth: 1,
          borderBottomColor: `${theme.border}40`,
          zIndex: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing.gutter,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              {
                padding: Spacing.stackSm,
                backgroundColor: `${theme.border}40`,
                borderRadius: Radius.lg,
                borderWidth: 1,
                borderColor: `${theme.border}66`,
                opacity: pressed ? 0.7 : 1,
                minWidth: 44,
                minHeight: 44,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <ThemedText style={{ fontSize: 20, fontWeight: "700" }}>
              ←
            </ThemedText>
          </Pressable>
          <ThemedText
            style={{
              flex: 1,
              fontSize: 18,
              fontWeight: "700",
              color: theme.onSurface,
            }}
          >
            Exercise Guide
          </ThemedText>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Spacing.containerPaddingMobile,
          paddingBottom: Spacing.stackLg,
        }}
      >
        {/* Featured Image */}
        {exercise.thumbnailUrl && (
          <View
            style={{
              width: "100%",
              height: 240,
              borderRadius: Radius.xl,
              overflow: "hidden",
              marginVertical: Spacing.stackMd,
              borderWidth: 1,
              borderColor: `${theme.border}40`,
            }}
          >
            <Image
              source={{ uri: exercise.thumbnailUrl }}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        )}

        {/* Title & Category */}
        <ThemedText
          style={{
            fontSize: 28,
            fontWeight: "800",
            marginBottom: Spacing.stackSm,
            color: theme.onSurface,
          }}
        >
          {exercise.name}
        </ThemedText>

        {/* Badge Row */}
        <View
          style={{
            flexDirection: "row",
            gap: Spacing.gutter,
            marginBottom: Spacing.stackMd,
          }}
        >
          <View
            style={{
              paddingHorizontal: Spacing.stackSm,
              paddingVertical: 6,
              borderRadius: Radius.full,
              backgroundColor: `${theme.secondaryContainer}33`,
              borderWidth: 1,
              borderColor: `${theme.secondaryContainer}66`,
            }}
          >
            <ThemedText
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: theme.secondaryContainer,
                textTransform: "uppercase",
              }}
            >
              {exercise.category}
            </ThemedText>
          </View>

          <View
            style={{
              paddingHorizontal: Spacing.stackSm,
              paddingVertical: 6,
              borderRadius: Radius.full,
              backgroundColor:
                exercise.difficulty === "Advanced"
                  ? `${theme.error}33`
                  : `${theme.primaryFixedDim}33`,
              borderWidth: 1,
              borderColor:
                exercise.difficulty === "Advanced"
                  ? `${theme.error}66`
                  : `${theme.primaryFixedDim}66`,
            }}
          >
            <ThemedText
              style={{
                fontSize: 12,
                fontWeight: "600",
                color:
                  exercise.difficulty === "Advanced"
                    ? theme.error
                    : theme.primaryFixedDim,
                textTransform: "uppercase",
              }}
            >
              {exercise.difficulty}
            </ThemedText>
          </View>
        </View>

        {/* Info Grid */}
        <View style={{ marginBottom: Spacing.stackMd }}>
          <View
            style={{
              flexDirection: "row",
              gap: Spacing.gutter,
              marginBottom: Spacing.gutter,
            }}
          >
            {/* Targets */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <MaterialIcons
                name="fitness-center"
                size={14}
                color={theme.primaryFixedDim}
              />

              <ThemedText
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: theme.onSurfaceVariant,
                  textTransform: "uppercase",
                  marginLeft: 6,
                  opacity: 0.7,
                }}
              >
                Targets
              </ThemedText>
            </View>

            {/* Equipment */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <MaterialIcons
                name="build"
                size={14}
                color={theme.primaryFixedDim}
              />

              <ThemedText
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: theme.onSurfaceVariant,
                  textTransform: "uppercase",
                  marginLeft: 6,
                  opacity: 0.7,
                }}
              >
                Equipment
              </ThemedText>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: Spacing.gutter,
            }}
          >
            {/* Sets */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <MaterialIcons
                name="bar-chart"
                size={14}
                color={theme.primaryFixedDim}
              />

              <ThemedText
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: theme.onSurfaceVariant,
                  textTransform: "uppercase",
                  marginLeft: 6,
                  opacity: 0.7,
                }}
              >
                Sets
              </ThemedText>
            </View>

            {/* Reps */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <MaterialIcons
                name="repeat"
                size={14}
                color={theme.primaryFixedDim}
              />

              <ThemedText
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: theme.onSurfaceVariant,
                  textTransform: "uppercase",
                  marginLeft: 6,
                  opacity: 0.7,
                }}
              >
                Reps
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <ThemedView
          style={{
            borderRadius: Radius.lg,
            backgroundColor: `${theme.surfaceContainer}99`,
            borderWidth: 1,
            borderColor: `${theme.border}40`,
            padding: Spacing.stackMd,
            marginBottom: Spacing.stackMd,
          }}
        >
          <ThemedText
            style={{
              fontSize: 14,
              fontWeight: "600",
              marginBottom: Spacing.stackSm,
              color: theme.onSurface,
              textTransform: "uppercase",
            }}
          >
            📋 Instructions
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 14,
              lineHeight: 22,
              color: theme.onSurfaceVariant,
            }}
          >
            Follow proper form by maintaining control throughout the movement.
            Focus on the target muscle group and avoid using momentum. Start
            with a weight that allows you to complete all reps with good form,
            then gradually increase resistance as you get stronger.
          </ThemedText>
        </ThemedView>

        {/* CTA Button */}
        <Pressable
          style={({ pressed }) => [
            {
              paddingVertical: Spacing.stackSm,
              paddingHorizontal: Spacing.stackMd,
              borderRadius: Radius.lg,
              backgroundColor: pressed
                ? theme.primaryFixedDim
                : theme.primaryFixedDim,
              alignItems: "center",
              opacity: pressed ? 0.9 : 1,
              marginBottom: Spacing.stackLg,
            },
          ]}
        >
          <ThemedText
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: theme.onPrimary,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Add to Workout
          </ThemedText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
