export type MuscleGroup =
  | "chest"
  | "shoulders"
  | "back"
  | "arms"
  | "legs"
  | "core";

export type RecoveryState = "recovered" | "fatigued" | "neutral";

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
  states: Partial<Record<MuscleGroup, RecoveryState>>;
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
