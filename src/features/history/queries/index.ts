import { useQuery } from '@tanstack/react-query';
import { historyQueryKey } from './key';
import { getWorkoutSessions } from '../apis';

export const useGetWorkoutSessions = () => {
    return useQuery({
        queryKey: historyQueryKey.sessions(),
        queryFn: getWorkoutSessions,
    });
};