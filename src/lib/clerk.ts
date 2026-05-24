import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

async function getToken(key: string) {
  if (isWeb) return null;
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

async function saveToken(key: string, value: string) {
  if (isWeb) return;
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    return;
  }
}

export const tokenCache = { getToken, saveToken };
