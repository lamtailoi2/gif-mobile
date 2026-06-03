import { useQuery } from '@tanstack/react-query';
import { getProgressDashboard } from '../apis';
import { progressQueryKey } from './key';

export const useGetProgressDashboard = () => {
    return useQuery({
        queryKey: progressQueryKey.dashboard(),
        queryFn: getProgressDashboard,
    });
};