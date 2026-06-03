import type { MuscleSlug } from "@/features/home/types/dashboard";

export interface IExecutionStep {
  step: number;
  title: string;
  description: string;
}

export interface IMistake {
  title: string;
  description: string;
  icon?: "priority_high" | "close";
}

export interface IAlternativeExercise {
  name: string;
  picture: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface IExerciseGuide {
  exerciseId: string;
  executionSteps: IExecutionStep[];
  mistakes: IMistake[];
  alternatives: IAlternativeExercise[];
  primaryMuscles: MuscleSlug[];
  secondaryMuscles: MuscleSlug[];
}
