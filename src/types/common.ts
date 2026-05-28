export type Exercise = {
  id: string;
  name: string;
  slug: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: string;
  instructionUrl?: string;
  thumbnailUrl?: string;
  defaultSets: number;
  defaultReps: number;
};
