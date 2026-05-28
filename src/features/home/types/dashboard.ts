import type { Slug } from "react-native-body-highlighter";

export type MuscleSlug = Slug;

export enum ERecoveryState {
  Recovered = "recovered",
  Fatigued = "fatigued",
  Neutral = "neutral",
}

export interface IDashboardUser {
  name: string;
  avatarUrl?: string;
}

export interface IReadiness {
  score: number;
  label: string;
}

export interface IStreak {
  days: number;
  percentile: number;
}

export interface ITodaysWorkout {
  type: string;
  focus: string;
  durationMin: number;
  intensity: string;
  load: string;
}

export interface IRecoveryMap {
  states: Partial<Record<MuscleSlug, ERecoveryState>>;
}

export interface IHomeDashboard {
  user: IDashboardUser;
  greetingTimeOfDay: "morning" | "afternoon" | "evening";
  hasNotification: boolean;
  readiness: IReadiness;
  streak: IStreak;
  todaysWorkout: ITodaysWorkout;
  recoveryMap: IRecoveryMap;
}
