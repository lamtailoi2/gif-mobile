import { queryOptions } from "@tanstack/react-query";
import { getHomeDashboard } from "../apis";
import { homeQueryKeys } from "./key";

export const getHomeDashboardQuery = () => {
  return queryOptions({
    queryKey: [homeQueryKeys.GetHomeDashboard],
    queryFn: async () => await getHomeDashboard(),
    staleTime: 1000 * 60 * 5,
  });
};
