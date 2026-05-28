import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Exercise } from "@/types/common";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ExerciseFilterParams,
  useExerciseFilter,
} from "../hooks/useExercisesFilter";
import { getAllExercisesQuery } from "../queries";
import ExerciseCard from "./ExerciseCard";

interface ExerciseLibraryListProps {
  filters?: ExerciseFilterParams;
  onExercisePress?: (exercise: Exercise) => void;
}

const MUSCLE_GROUPS = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
];

export default function ExerciseLibraryList({
  filters: initialFilters = {},
  onExercisePress,
}: ExerciseLibraryListProps) {
  const { data: exercises = [], isLoading } = useQuery(getAllExercisesQuery());
  const theme = useTheme();

  const [filters, setFilters] = useState<ExerciseFilterParams>(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("All");

  const filtered = useExerciseFilter(exercises, filters);

  // Filter by search query
  const searchFiltered = filtered.filter((ex) =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter by muscle group
  const finalFiltered =
    selectedMuscleGroup === "All"
      ? searchFiltered
      : searchFiltered.filter((ex) =>
          ex.muscleGroups.some((mg) =>
            mg.toLowerCase().includes(selectedMuscleGroup.toLowerCase()),
          ),
        );

  if (isLoading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={theme.primaryFixedDim} />
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={finalFiltered}
      renderItem={({ item }) => (
        <ExerciseCard exercise={item} onPress={onExercisePress} />
      )}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <SafeAreaView>
          {/* Search Bar */}
          <View
            style={{
              marginBottom: Spacing.stackMd,

              height: 58,

              borderRadius: 24,

              backgroundColor: "rgba(42,42,42,0.7)",

              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",

              flexDirection: "row",
              alignItems: "center",

              paddingHorizontal: 18,
            }}
          >
            <MaterialIcons
              name="search"
              size={22}
              color="rgba(255,255,255,0.45)"
            />

            <TextInput
              placeholder="Search exercises..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                flex: 1,
                marginLeft: 12,

                color: "#fff",

                fontSize: 16,
                fontWeight: "500",
              }}
            />

            <Pressable>
              <MaterialIcons
                name="mic"
                size={22}
                color={theme.primaryFixedDim}
              />
            </Pressable>
          </View>

          {/* Muscle Group Filter */}
          {/* Muscle Group Filter */}
          <View style={{ marginBottom: Spacing.stackMd }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: Spacing.stackSm,
              }}
            >
              <ThemedText
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  color: theme.onSurfaceVariant,
                  opacity: 0.6,
                }}
              >
                Muscle Groups
              </ThemedText>
              <Pressable
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <MaterialIcons
                  name="tune"
                  size={16}
                  color={theme.primaryFixedDim}
                />
                <ThemedText
                  style={{
                    color: theme.primaryFixedDim,
                    fontSize: 16,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Advanced Filters
                </ThemedText>
              </Pressable>
            </View>

            {/*Horizontal Scroll */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 12,
                paddingHorizontal: Spacing.containerPaddingMobile,
              }}
              style={{
                marginHorizontal: -Spacing.containerPaddingMobile,
              }}
            >
              {MUSCLE_GROUPS.map((group) => {
                const isSelected = selectedMuscleGroup === group;

                return (
                  <View
                    key={group}
                    style={{
                      borderWidth: 1,
                      borderColor: isSelected
                        ? "#B6FF00"
                        : "rgba(255, 255, 255, 0.25)",
                      borderRadius: 999,
                      overflow: "visible",
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                    }}
                  >
                    <Pressable
                      onPress={() => setSelectedMuscleGroup(group)}
                      style={({ pressed }) => [
                        {
                          paddingHorizontal: 40,
                          paddingVertical: 50,
                          borderRadius: 999,
                          justifyContent: "center",
                          alignItems: "center",

                          backgroundColor: isSelected
                            ? "rgba(182, 255, 0, 0.2)"
                            : "rgba(42, 42, 42, 0.3)",

                          shadowColor: isSelected ? "#B6FF00" : "transparent",
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: isSelected ? 0.4 : 0,
                          shadowRadius: isSelected ? 10 : 0,
                          elevation: isSelected ? 5 : 0,

                          opacity: pressed ? 0.85 : 1,
                          transform: [{ scale: pressed ? 0.97 : 1 }],
                        },
                      ]}
                    >
                      <ThemedText
                        style={{
                          fontSize: 15,
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: 0.9,
                          color: isSelected
                            ? "#B6FF00"
                            : "rgba(255, 255, 255, 0.75)",
                        }}
                      >
                        {group}
                      </ThemedText>
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      }
      ListEmptyComponent={
        <ThemedView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: Spacing.containerPaddingMobile,
          }}
        >
          <ThemedText
            style={{
              fontSize: 16,
              color: theme.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            No exercises found
          </ThemedText>
        </ThemedView>
      }
      contentContainerStyle={{
        padding: Spacing.containerPaddingMobile,
        paddingTop: 0,
      }}
    />
  );
}
