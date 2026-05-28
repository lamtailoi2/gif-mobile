import { ERecoveryState, IHomeDashboard } from "../types/dashboard";

const MOCK_DASHBOARD: IHomeDashboard = {
  user: {
    name: "Alex",
    avatarUrl: undefined,
  },
  greetingTimeOfDay: "evening",
  hasNotification: true,
  readiness: {
    score: 85,
    label: "Optimal",
  },
  streak: {
    days: 12,
    percentile: 5,
  },
  todaysWorkout: {
    type: "Push Day",
    focus: "Chest & Triceps",
    durationMin: 65,
    intensity: "High",
    load: "Progressive",
  },
  recoveryMap: {
    states: {
      chest: ERecoveryState.Recovered,
      triceps: ERecoveryState.Recovered,
      deltoids: ERecoveryState.Fatigued,
      trapezius: ERecoveryState.Fatigued,
      abs: ERecoveryState.Recovered,
    },
  },
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getHomeDashboard = async (): Promise<IHomeDashboard> => {
  await wait(300);
  return MOCK_DASHBOARD;
};
