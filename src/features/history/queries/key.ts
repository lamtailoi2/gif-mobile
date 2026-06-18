export const historyQueryKey = {
    all: ['history'] as const,
    sessions: (userId: string) => [...historyQueryKey.all, 'sessions', userId] as const,
};

export enum EHistoryQueryKeys {
  LatestLogs = 'LatestLogs',
  SessionDetails = 'SessionDetails',
}