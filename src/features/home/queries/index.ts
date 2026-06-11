import { queryOptions } from "@tanstack/react-query";
import { getHomeDashboard } from "../apis";
import { EHomeQueryKeys } from "./key";

export const getHomeDashboardQuery = (userId: string, userName: string) => {
  return queryOptions({
    queryKey: [EHomeQueryKeys.GetHomeDashboard, userId],
    queryFn: async () => await getHomeDashboard(userId, userName),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });
};
