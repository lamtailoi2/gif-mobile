import { queryOptions } from "@tanstack/react-query";
import { getHomeDashboard } from "../apis";
import { EHomeQueryKeys } from "./key";

export const getHomeDashboardQuery = () => {
  return queryOptions({
    queryKey: [EHomeQueryKeys.GetHomeDashboard],
    queryFn: async () => await getHomeDashboard(),
    staleTime: 1000 * 60 * 5,
  });
};
