import { queryOptions } from "@tanstack/react-query";
import { getHomeDashboard } from "../apis";
import { getReadiness } from "../apis/get-readiness";
import { getStreak } from "../apis/get-streak";
import { getTodaysWorkout } from "../apis/get-todays-workout";
import { getRecoveryMap } from "../apis/get-recovery-map";
import { EHomeQueryKeys } from "./key";

export const getHomeDashboardQuery = (userId: string, userName: string) => {
  return queryOptions({
    queryKey: [EHomeQueryKeys.GetHomeDashboard, userId],
    queryFn: async () => await getHomeDashboard(userId, userName),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  });
};

export const getReadinessQuery = (userId: string) => {
  return queryOptions({
    queryKey: [EHomeQueryKeys.GetReadiness, userId],
    queryFn: async () => await getReadiness(userId),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  });
};

export const getStreakQuery = (userId: string) => {
  return queryOptions({
    queryKey: [EHomeQueryKeys.GetStreak, userId],
    queryFn: async () => await getStreak(userId),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  });
};

export const getTodaysWorkoutQuery = (userId: string) => {
  return queryOptions({
    queryKey: [EHomeQueryKeys.GetTodaysWorkout, userId],
    queryFn: async () => await getTodaysWorkout(userId),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  });
};

export const getRecoveryMapQuery = (userId: string) => {
  return queryOptions({
    queryKey: [EHomeQueryKeys.GetRecoveryMap, userId],
    queryFn: async () => await getRecoveryMap(userId),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  });
};
