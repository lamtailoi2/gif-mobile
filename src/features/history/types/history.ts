export enum EIntensity {
    HighIntensity = 'HIGH INTENSITY',
    Intense = 'INTENSE',
    Normal = 'NORMAL',
}

export interface IWorkoutSession {
    id: string;
    title: string;
    date: string;
    time: string;
    durationMinutes: number;
    caloriesBurned: number;
    exercisesCount: number;
    intensity: EIntensity;
    type: string;
    muscleGroups: string[];
}