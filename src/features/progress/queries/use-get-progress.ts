import { useQuery } from '@tanstack/react-query';
import { getProgressDashboard } from '../apis';
import { progressQueryKey } from './key';

export const useGetProgressDashboard = (userId: string | undefined) => {
    return useQuery({
        queryKey: progressQueryKey.dashboard(userId || ''),
        queryFn: () => getProgressDashboard(userId as string),
        enabled: !!userId,
        retry: 1,
        throwOnError: false,
    });
};