import { useQuery } from '@tanstack/react-query';
import { getHistoryOverview } from '../apis';
import { historyQueryKey } from './key';

export const useGetHistoryOverview = () => {
    return useQuery({
        queryKey: historyQueryKey.overview(),
        queryFn: getHistoryOverview,
    });
};