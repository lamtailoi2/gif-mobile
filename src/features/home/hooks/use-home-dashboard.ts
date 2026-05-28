import { useQuery } from "@tanstack/react-query";
import { getHomeDashboardQuery } from "../queries";

export const useHomeDashboard = () => {
  return useQuery(getHomeDashboardQuery());
};
