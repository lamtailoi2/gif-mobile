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
  description: string;
  type: "easier" | "harder" | "home";
}

export interface IExerciseGuide {
  exerciseId: string;
  executionSteps: IExecutionStep[];
  mistakes: IMistake[];
  alternatives: IAlternativeExercise[];
  primaryMuscles: MuscleSlug[];
  secondaryMuscles: MuscleSlug[];
}
