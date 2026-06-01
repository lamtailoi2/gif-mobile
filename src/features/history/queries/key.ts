export const historyQueryKey = {
    all: ['history'] as const,
    overview: () => [...historyQueryKey.all, 'overview'] as const,
    sessions: () => [...historyQueryKey.all, 'sessions'] as const,
};