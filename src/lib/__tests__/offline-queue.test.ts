import { offlineQueue } from '../offline-queue';

describe('offlineQueue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-23T10:00:00.000Z'));
  });

  it('enqueues mutations with createdAt', async () => {
    await offlineQueue.enqueue({ name: 'saveWorkoutSession', payload: { id: 's1' } });

    await expect(offlineQueue.getAll()).resolves.toEqual([
      { name: 'saveWorkoutSession', payload: { id: 's1' }, createdAt: '2026-07-23T10:00:00.000Z' },
    ]);
  });

  it('dequeues first mutation and keeps the rest', async () => {
    await offlineQueue.enqueue({ name: 'first', payload: 1 });
    await offlineQueue.enqueue({ name: 'second', payload: 2 });

    await expect(offlineQueue.dequeue()).resolves.toMatchObject({ name: 'first', payload: 1 });
    await expect(offlineQueue.getAll()).resolves.toEqual([
      expect.objectContaining({ name: 'second', payload: 2 }),
    ]);
  });

  it('clears the queue', async () => {
    await offlineQueue.enqueue({ name: 'first', payload: 1 });
    await offlineQueue.clear();

    await expect(offlineQueue.getAll()).resolves.toEqual([]);
  });
});
