import { useQuery } from '@tanstack/react-query';
import { getSessionById } from '../apis';
import { IWorkoutSession } from '@/interfaces/workout-session.interface';

import { EHistoryQueryKeys } from './key';

export const useGetSessionDetails = (sessionId: string) => {
  return useQuery({
    queryKey: [EHistoryQueryKeys.SessionDetails, sessionId],
    queryFn: async () => {
      const data = await getSessionById(sessionId);
      return data as (IWorkoutSession & { id: string }) | null;
    },
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
