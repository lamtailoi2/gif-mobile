export interface IGeneratedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
}

export interface IDaySchedule {
  day: string; // e.g., "Ngày 1", "Ngày 2"
  focus: string; // e.g., "Chest & Triceps"
  exercises: IGeneratedExercise[];
}

export interface IWorkoutPlanResponse {
  userAssessment: string; // AI assessment in Vietnamese
  schedule: IDaySchedule[];
}

// types/exercise.ts
export interface IExercise {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  equipment: string;      // ← string, không phải string[]
  muscleGroups: string[];
  defaultSets: number;
  defaultReps: number;
  slug?: string;
  thumbnailUrl?: string;
  instructionUrl?: string;
}