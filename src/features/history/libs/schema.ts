// src/features/history/libs/schema.ts
import { z } from 'zod';
import { EIntensity } from '../types/history';

export const workoutSessionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    time: z.string(),
    durationMinutes: z.number().min(0),
    caloriesBurned: z.number().min(0),
    exercisesCount: z.number().min(0),
    intensity: z.nativeEnum(EIntensity),
    type: z.string().min(1, 'Workout type is required'),
    muscleGroups: z.array(z.string()),
});

export type IWorkoutSessionSchema = z.infer<typeof workoutSessionSchema>;