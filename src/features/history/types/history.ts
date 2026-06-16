export enum EIntensity {
    HighIntensity = 'HIGH INTENSITY',
    Intense = 'INTENSE',
    Normal = 'NORMAL',
}

export interface IWorkoutSession {
    id: string;
    date: string;
    time: string;
    intensity: EIntensity;
    type: string;
    muscleGroups: string[];
}