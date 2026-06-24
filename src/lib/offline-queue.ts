import AsyncStorage from "@react-native-async-storage/async-storage";

const QUEUE_KEY = "offline_mutations";

export interface QueuedMutation {
  name: string;
  payload: unknown;
  createdAt: string;
}

export const offlineQueue = {
  async enqueue(mutation: Omit<QueuedMutation, "createdAt">): Promise<void> {
    try {
      const queue = await this.getAll();
      queue.push({ ...mutation, createdAt: new Date().toISOString() });
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn("[offline-queue] Failed to enqueue:", e);
    }
  },

  async getAll(): Promise<QueuedMutation[]> {
    try {
      const raw = await AsyncStorage.getItem(QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async dequeue(): Promise<QueuedMutation | null> {
    try {
      const queue = await this.getAll();
      if (queue.length === 0) return null;
      const [first, ...rest] = queue;
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(rest));
      return first;
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(QUEUE_KEY);
    } catch {}
  },
};
