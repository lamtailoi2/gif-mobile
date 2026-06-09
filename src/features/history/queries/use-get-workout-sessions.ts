import { useQuery } from '@tanstack/react-query';
import { getWorkoutHistory } from '../apis';
import { historyQueryKey } from './key';

export const useGetWorkoutSessions = () => {
    return useQuery({
        queryKey: historyQueryKey.sessions(),
        queryFn: getWorkoutHistory,
    });
};