import { useUser } from "@clerk/expo";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { MuscleGroup } from "../constants/filter-constants";
import {
  IExerciseFilterParams,
  useExerciseFilter,
} from "../hooks/use-exercises-filter";
import { useFilteredExercisesCount } from "../hooks/use-filtered-exercises-count";
import { getAllExercisesQuery } from "../queries";
import { IExercise } from "../types/exercise";
import ExerciseCard from "./exercise-card";
import ExerciseLibraryHeader from "./exercise-library-header";
import ExerciseSearchInput from "./exercise-search-input";
import MuscleGroupFilter from "./muscle-group-filter";

interface IExerciseLibraryListProps {
  onExercisePress?: (exercise: IExercise) => void;
}

export default function ExerciseLibraryList({
  onExercisePress,
}: IExerciseLibraryListProps) {
  const { data: exercises = [], isLoading } = useQuery(getAllExercisesQuery());
  const { user } = useUser();
  const [filters, setFilters] = useState<IExerciseFilterParams>({});
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup>();
  const [searchQuery, setSearchQuery] = useState("");

  const theme = useTheme();

  // Apply filters first
  const filteredByParams = useExerciseFilter(exercises, filters);

  // Then apply search filter
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredByParams;
    }

    const query = searchQuery.toLowerCase();
    return filteredByParams.filter((exercise) => {
      const nameMatch = exercise.name.toLowerCase().includes(query);
      const muscleMatch = exercise.muscleGroups.some((muscle) =>
        muscle.toLowerCase().includes(query),
      );
      const categoryMatch = exercise.category.toLowerCase().includes(query);
      return nameMatch || muscleMatch || categoryMatch;
    });
  }, [filteredByParams, searchQuery]);

  const exercisesCount = useFilteredExercisesCount(exercises, filters);

  const handleMuscleGroupChange = (muscleGroup?: MuscleGroup) => {
    setSelectedMuscleGroup(muscleGroup);
  };

  const handleFiltersChange = (newFilters: IExerciseFilterParams) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Fixed Header */}
      <ExerciseLibraryHeader avatarUrl={user?.imageUrl} />

      {/* Search Input */}
      <ExerciseSearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search exercises..."
      />

      {/* Floating Filter Layer */}
      <View className="z-50">
        <MuscleGroupFilter
          selectedMuscleGroup={selectedMuscleGroup}
          onMuscleGroupChange={handleMuscleGroupChange}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Count */}
        <View className="items-end px-gutter pb-4">
          <View className="flex-row items-center gap-1.5 bg-neutral-900/30 px-3 py-1.5 rounded-full border border-neutral-800/50">
            <View className="w-1.5 h-1.5 rounded-full bg-[#B6FF00]" />

            <Text className="text-lg font-medium text-neutral-400 tracking-wide">
              Total:{" "}
              <Text className="font-extrabold text-white text-[#B6FF00]">
                {filtered.length}
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        renderItem={({ item }) => (
          <ExerciseCard exercise={item} onPress={onExercisePress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-gutter pb-10"
      />
    </View>
  );
}
