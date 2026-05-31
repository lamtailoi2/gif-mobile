import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { FilterTag } from "@/components/ui/filter-tag";
import type { MuscleSlug } from "@/features/home/types/dashboard";
import {
  CATEGORY_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "../constants/filter-constants";
import { ALL_BODY_PARTS } from "../constants/muscle-group-mapping";
import { IExerciseFilterParams } from "../hooks/use-exercises-filter";
import { IExercise } from "../types/exercise";

interface IAdvancedFilterModalProps {
  visible: boolean;
  exercises: IExercise[];
  filters: IExerciseFilterParams;
  onFiltersChange: (filters: IExerciseFilterParams) => void;
  onClose: () => void;
}

export default function AdvancedFilterModal({
  visible,
  exercises,
  filters,
  onFiltersChange,
  onClose,
}: IAdvancedFilterModalProps) {
  const [localFilters, setLocalFilters] =
    useState<IExerciseFilterParams>(filters);

  // Sync localFilters when parent filters change or modal opens/closes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  const handleBodyPartToggle = (bodyPart: MuscleSlug) => {
    const bodyParts = localFilters.bodyParts || [];
    const newBodyParts = bodyParts.includes(bodyPart)
      ? bodyParts.filter((bp) => bp !== bodyPart)
      : [...bodyParts, bodyPart];
    setLocalFilters({ ...localFilters, bodyParts: newBodyParts });
  };

  const handleDifficultyToggle = (difficulty: string) => {
    const newDifficulty =
      localFilters.difficulty === difficulty ? undefined : difficulty;
    setLocalFilters({ ...localFilters, difficulty: newDifficulty });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategory =
      localFilters.category === category ? undefined : category;
    setLocalFilters({ ...localFilters, category: newCategory });
  };

  const handleClearAll = () => {
    setLocalFilters({});
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <View
        className="flex-1"
        style={{ backgroundColor: "rgba(24, 24, 27, 0.98)" }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-outline/20 px-6 py-5">
          <View>
            <Text className="text-2xl font-black text-white tracking-tight">
              Filters
            </Text>
            <Text className="text-xs font-medium text-neutral-400 mt-0.5">
              Refine your exercise library
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            className="w-9 h-9 items-center justify-center rounded-full bg-neutral-800 active:bg-neutral-700"
          >
            <Text className="text-sm font-bold text-neutral-400">✕</Text>
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1 px-6 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Body Parts */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-white tracking-wide mb-3">
              Body Parts
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {ALL_BODY_PARTS.map((bodyPart) => (
                <View key={bodyPart} className="w-[31%] my-1.5">
                  <FilterTag
                    label={bodyPart.replace("-", " ")}
                    checked={
                      localFilters.bodyParts?.includes(bodyPart) || false
                    }
                    onChange={() => handleBodyPartToggle(bodyPart)}
                  />
                </View>
              ))}
            </View>
          </View>

          <View className="h-[1px] bg-outline/10 my-2" />

          {/* Difficulty */}
          <View className="mb-6 mt-2">
            <Text className="text-lg font-bold text-white tracking-wide mb-3">
              Difficulty
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {DIFFICULTY_OPTIONS.map((difficulty) => (
                <FilterTag
                  key={difficulty}
                  label={difficulty}
                  checked={localFilters.difficulty === difficulty}
                  onChange={() => handleDifficultyToggle(difficulty)}
                />
              ))}
            </View>
          </View>

          <View className="h-[1px] bg-outline/10 my-2" />

          {/* Category */}
          <View className="mb-8 mt-2">
            <Text className="text-lg font-bold text-white tracking-wide mb-3">
              Category
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((category) => (
                <FilterTag
                  key={category}
                  label={category}
                  checked={localFilters.category === category}
                  onChange={() => handleCategoryToggle(category)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer - Clear All & Apply */}
        <View className="border-t border-outline/10 px-6 py-5 flex-row gap-4 bg-neutral-900/50">
          <Pressable
            onPress={handleClearAll}
            className="flex-1 border border-[#4b8eff]/40 py-3.5 rounded-xl justify-center items-center active:scale-[0.98] active:opacity-80"
          >
            <Text className="text-sm font-bold text-[#4b8eff] tracking-wide">
              Clear All
            </Text>
          </Pressable>

          <Pressable
            onPress={handleApply}
            className="flex-[1.5] bg-[#abd600] py-3.5 rounded-xl justify-center items-center active:scale-[0.98] shadow-lg shadow-[#abd600]/20"
          >
            <Text className="text-sm font-black text-[#283500] tracking-wide uppercase">
              Apply Filters
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
