export const progressQueryKey = {
    all: ['progress'] as const,
    dashboard: (userId: string) => [...progressQueryKey.all, 'dashboard', userId] as const,
};