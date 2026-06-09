export const historyQueryKey = {
    all: ['history'] as const,
    sessions: () => [...historyQueryKey.all, 'sessions'] as const,
};