import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { LayoutRectangle, Pressable, Text, View } from "react-native";

import { EMuscleGroup, MuscleGroup } from "../constants/filter-constants";
import { IExerciseFilterParams } from "../hooks/use-exercises-filter";
import { IExercise } from "../types/exercise";
import AdvancedFilterModal from "./advanced-filter-modal";

interface IMuscleGroupFilterProps {
  selectedMuscleGroup?: MuscleGroup;
  exercises: IExercise[];
  onMuscleGroupChange: (muscleGroup?: MuscleGroup) => void;
  filters: IExerciseFilterParams;
  onFiltersChange: (filters: IExerciseFilterParams) => void;
}

const MUSCLE_GROUPS: {
  label: string;
  value: MuscleGroup;
}[] = [
  { label: "Chest", value: EMuscleGroup.Chest },
  { label: "Back", value: EMuscleGroup.Back },
  { label: "Shoulders", value: EMuscleGroup.Shoulders },
  { label: "Arms", value: EMuscleGroup.Arms },
  { label: "Core", value: EMuscleGroup.Core },
  { label: "Legs", value: EMuscleGroup.Legs },
];

export default function MuscleGroupFilter({
  exercises,
  selectedMuscleGroup,
  onMuscleGroupChange,
  filters,
  onFiltersChange,
}: IMuscleGroupFilterProps) {
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showMuscleGroups, setShowMuscleGroups] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState<LayoutRectangle | null>(
    null,
  );

  const handleMuscleGroupPress = (muscleGroup: MuscleGroup) => {
    const newMuscleGroup =
      selectedMuscleGroup === muscleGroup ? undefined : muscleGroup;
    onMuscleGroupChange(newMuscleGroup);
    onFiltersChange({
      ...filters,
      muscleGroup: newMuscleGroup,
    });
  };

  return (
    <View className="relative px-gutter py-3 z-30">
      {showMuscleGroups && (
        <Pressable
          className="absolute top-0 left-0 right-0 bottom-[-500px] z-10"
          onPress={() => setShowMuscleGroups(false)}
        />
      )}

      <View className="flex-row items-center justify-between bg-neutral-900/40 p-2 rounded-2xl border border-neutral-400">
        {/* Nút bấm mở Muscle Groups */}
        <View
          onLayout={(event) => setAnchorLayout(event.nativeEvent.layout)}
          className="flex-1"
        >
          <Pressable
            onPress={() => setShowMuscleGroups(!showMuscleGroups)}
            className={`flex-row items-center justify-between px-4 py-2.5 rounded-xl active:opacity-70 ${
              showMuscleGroups || selectedMuscleGroup
                ? "bg-neutral-800"
                : "bg-transparent"
            }`}
          >
            <View className="flex-row items-center gap-2">
              <Text
                className="font-bold text-base tracking-wide"
                style={{ color: "#759a04", fontSize: 17 }}
              >
                {selectedMuscleGroup
                  ? `Muscle: ${MUSCLE_GROUPS.find((g) => g.value === selectedMuscleGroup)?.label}`
                  : "Muscle Groups"}
              </Text>
            </View>
            <MaterialIcons
              name={
                showMuscleGroups ? "keyboard-arrow-down" : "keyboard-arrow-up"
              }
              size={22}
              color="#759a04"
            />
          </Pressable>
        </View>

        {/* Đường chia tách nhỏ giữa 2 nút */}
        <View className="w-[1px] h-6 bg-neutral-800" />

        {/* Nút mở Advanced Filters */}
        <Pressable
          onPress={() => setShowAdvancedFilter(true)}
          className="flex-row items-center gap-2 px-4 py-2.5 rounded-xl active:opacity-70"
        >
          <MaterialIcons name="tune" size={20} color="#769d00" />
          <Text
            className="font-bold text-base tracking-wide"
            style={{ color: "#759a04", fontSize: 17 }}
          >
            Advanced Filters
          </Text>
        </Pressable>
      </View>

      {/* Dropdown Menu thiết kế dạng Grid 2 Cột hiện đại */}
      {showMuscleGroups && anchorLayout && (
        <View
          className="absolute z-20 left-gutter right-gutter rounded-2xl border bg-surface-container shadow-2xl p-3 flex-row flex-wrap justify-between"
          style={{
            top: anchorLayout.y + anchorLayout.height + 24,
            borderColor: "rgba(117, 154, 4, 0.3)",
            backgroundColor: "rgba(30, 30, 32, 0.98)",
          }}
        >
          {MUSCLE_GROUPS.map((group) => {
            const isSelected = selectedMuscleGroup === group.value;

            return (
              <Pressable
                key={group.value}
                onPress={() => {
                  handleMuscleGroupPress(group.value);
                  setShowMuscleGroups(false);
                }}
                className="w-[48%] my-1.5 active:opacity-80"
              >
                <View
                  className="w-full py-3.5 px-4 rounded-xl border items-center justify-center"
                  style={{
                    backgroundColor: isSelected
                      ? "rgba(182, 255, 0, 0.12)"
                      : "rgba(255, 255, 255, 0.03)",
                    borderColor: isSelected
                      ? "#B6FF00"
                      : "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Text
                    className="text-sm font-bold tracking-wider uppercase"
                    style={{
                      color: isSelected ? "#B6FF00" : "#A3A3A3",
                    }}
                  >
                    {group.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        visible={showAdvancedFilter}
        exercises={exercises}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClose={() => setShowAdvancedFilter(false)}
      />
    </View>
  );
}
