import { IExercise } from "@/features/exercise-library/types/exercise";

/**
 * Kiểm tra xem một bài tập là tính theo Lần (Reps) hay Thời gian (Seconds).
 * Dựa vào category và slug của bài tập.
 */
export const isTimeBasedExercise = (exercise: IExercise | undefined): boolean => {
  if (!exercise) return false;

  const timeBasedCategories = ["cardio", "stretching", "yoga", "plyometrics"];
  const timeBasedKeywords = ["plank", "hold", "sit", "run", "jump rope", "mountain climber"];

  const categoryMatch = exercise.category ? timeBasedCategories.includes(exercise.category.toLowerCase()) : false;
  
  const nameMatch = exercise.name 
    ? timeBasedKeywords.some(keyword => exercise.name.toLowerCase().includes(keyword))
    : false;
    
  const slugMatch = exercise.slug 
    ? timeBasedKeywords.some(keyword => exercise.slug.toLowerCase().includes(keyword))
    : false;

  return categoryMatch || nameMatch || slugMatch;
};
