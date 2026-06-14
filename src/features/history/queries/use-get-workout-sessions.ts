import { useQuery } from '@tanstack/react-query';
import { getWorkoutHistory } from '../apis';
import { historyQueryKey } from './key';

export const useGetWorkoutSessions = (userId: string | undefined) => {
    return useQuery({
        queryKey: historyQueryKey.sessions(userId || ''),
        queryFn: () => getWorkoutHistory(userId as string),
        enabled: !!userId, // Chỉ gọi API khi đã có userId từ Clerk
    });
};