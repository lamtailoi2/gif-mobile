import AsyncStorage from '@react-native-async-storage/async-storage';
import { offlineCache } from '../offline-cache';

describe('offlineCache', () => {
  it('stores and reads cached data', async () => {
    await offlineCache.set('key', { value: 1 });

    await expect(offlineCache.get('key')).resolves.toEqual({ value: 1 });
  });

  it('returns null for missing or invalid entries', async () => {
    await AsyncStorage.setItem('bad', '{');

    await expect(offlineCache.get('missing')).resolves.toBeNull();
    await expect(offlineCache.get('bad')).resolves.toBeNull();
  });

  it('removes entries', async () => {
    await offlineCache.set('key', 'value');
    await offlineCache.remove('key');

    await expect(offlineCache.get('key')).resolves.toBeNull();
  });
});
