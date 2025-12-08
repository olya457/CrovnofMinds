import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ImageSourcePropType } from 'react-native';

export type CrestKey = 'crown' | 'book' | 'compass' | 'torch' | 'quill' | 'sword';

export const CREST_IMAGES: Record<CrestKey, ImageSourcePropType> = {
  crown:   require('../assets/crest_crown.png'),
  book:    require('../assets/crest_book.png'),
  compass: require('../assets/crest_compass.png'),
  torch:   require('../assets/crest_torch.png'),
  quill:   require('../assets/crest_quill.png'),
  sword:   require('../assets/crest_sword.png'),
};

const KEY_NAME  = 'profile_name';
const KEY_CREST = 'profile_crest'; 
const KEY_RANK  = 'rank_level';    

export async function getProfileName(): Promise<string> {
  return (await AsyncStorage.getItem(KEY_NAME)) ?? '';
}
export async function setProfileName(name: string) {
  await AsyncStorage.setItem(KEY_NAME, name);
}

export async function getProfileCrest(): Promise<CrestKey | null> {
  const raw = await AsyncStorage.getItem(KEY_CREST);
  return (raw as CrestKey) ?? null;
}
export async function setProfileCrest(key: CrestKey) {
  await AsyncStorage.setItem(KEY_CREST, key);
}

const RANK_TITLES = ['Page', 'Knight', 'Baron', 'Count', 'Duke', 'Monarch'];
export async function getCurrentRankTitle(): Promise<string> {
  const raw = await AsyncStorage.getItem(KEY_RANK);
  const n = raw ? Math.max(0, Math.min(5, parseInt(raw, 10))) : 0;
  return RANK_TITLES[n] ?? RANK_TITLES[0];
}
