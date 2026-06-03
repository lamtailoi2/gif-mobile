/**
 * Muscle Group Types & Enums
 */

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "core"
  | "legs";

export enum EMuscleGroup {
  Chest = "chest",
  Back = "back",
  Shoulders = "shoulders",
  Arms = "arms",
  Core = "core",
  Legs = "legs",
}

/**
 * Fixed difficulty levels - matches Firestore schema
 */
export const DIFFICULTY_OPTIONS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export type DifficultyType = (typeof DIFFICULTY_OPTIONS)[number];

/**
 * Fixed exercise categories - matches Firestore schema
 */
export const CATEGORY_OPTIONS = [
  "strength",
  "cardio",
  "flexibility",
  "plyometric",
] as const;
export type CategoryType = (typeof CATEGORY_OPTIONS)[number];
