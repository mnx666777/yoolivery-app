import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveJson<T>(key: string, value: T): Promise<void> {
  try {
    const s = JSON.stringify(value);
    await AsyncStorage.setItem(key, s);
  } catch {}
}

export async function loadJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const s = await AsyncStorage.getItem(key);
    if (!s) return fallback;
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

