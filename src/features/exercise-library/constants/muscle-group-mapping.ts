import type { MuscleSlug } from "@/features/home/types/dashboard";

/**
 * High-level Muscle Group → Detailed MuscleSlug mapping
 * Used by Muscle Groups Dropdown filter
 */
export const MUSCLE_GROUP_MAPPING: Record<string, MuscleSlug[]> = {
  chest: ["chest"],

  back: ["upper-back", "lower-back", "trapezius"],

  shoulders: ["deltoids"],

  arms: ["biceps", "triceps", "forearm"],

  core: ["abs", "obliques"],

  legs: [
    "quadriceps",
    "hamstring",
    "gluteal",
    "calves",
    "adductors",
    "tibialis",
  ],
};

/**
 * All available body parts from MuscleSlug type
 * Used by Advanced Filter Modal
 */
export const ALL_BODY_PARTS: MuscleSlug[] = [
  "chest",

  "upper-back",
  "lower-back",
  "trapezius",

  "deltoids",

  "biceps",
  "triceps",
  "forearm",

  "abs",
  "obliques",

  "quadriceps",
  "hamstring",
  "gluteal",
  "calves",
  "adductors",
  "tibialis",
];
