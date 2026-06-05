import { z } from 'zod';
import { EIntensity } from '../types/history';

export const workoutSessionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required'),
    date: z.string(),
    time: z.string(),
    durationMinutes: z.number().min(0),
    caloriesBurned: z.number().min(0),
    exercisesCount: z.number().min(0),
    intensity: z.nativeEnum(EIntensity),
    muscleGroups: z.array(z.string()),
});

export type IWorkoutSessionSchema = z.infer<typeof workoutSessionSchema>;