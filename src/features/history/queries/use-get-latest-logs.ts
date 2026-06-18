import { useQuery } from '@tanstack/react-query';
import { getLatestSessionFullLogs } from '../apis';
import { useUser } from '@clerk/expo';

import { EHistoryQueryKeys } from './key';

export const useGetLatestLogs = () => {
  const { user } = useUser();
  const userId = user?.id;

  return useQuery({
    queryKey: [EHistoryQueryKeys.LatestLogs, userId],
    queryFn: () => getLatestSessionFullLogs(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};
