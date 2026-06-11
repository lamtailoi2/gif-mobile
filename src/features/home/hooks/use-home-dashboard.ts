import { useQuery } from "@tanstack/react-query";
import { getHomeDashboardQuery } from "../queries";

/**
 * @param userId - Clerk user ID (filter sessions per user)
 * @param userName - Display name từ Clerk
 */
export const useHomeDashboard = (userId: string, userName: string) => {
  return useQuery(getHomeDashboardQuery(userId, userName));
};
