export const progressQueryKey = {
    all: ['progress'] as const,
    dashboard: () => [...progressQueryKey.all, 'dashboard'] as const,
};