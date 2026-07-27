import { DEFAULT_ESTADO_ID } from '../data/estados';
import { DEFAULT_CATEGORY_ID } from '../data/eventTypes';

// Deliberately the bare key "user_preferences" (no "potof:" prefix), per spec.
const USER_PREFERENCES_KEY = 'user_preferences';

export interface UserPreferences {
  estado: string;
  categoria: string;
}

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  estado: DEFAULT_ESTADO_ID,
  categoria: DEFAULT_CATEGORY_ID,
};

// If "user_preferences" isn't in localStorage yet, seeds it with the app's default
// state so it always reflects what the user is effectively seeing.
export function getUserPreferences(): UserPreferences {
  const raw = localStorage.getItem(USER_PREFERENCES_KEY);
  if (!raw) {
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(DEFAULT_USER_PREFERENCES));
    return DEFAULT_USER_PREFERENCES;
  }

  try {
    return { ...DEFAULT_USER_PREFERENCES, ...(JSON.parse(raw) as Partial<UserPreferences>) };
  } catch {
    return DEFAULT_USER_PREFERENCES;
  }
}

export function setUserPreferredEstado(estado: string): void {
  const prefs = getUserPreferences();
  localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify({ ...prefs, estado }));
}

export function setUserPreferredCategoria(categoria: string): void {
  const prefs = getUserPreferences();
  localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify({ ...prefs, categoria }));
}
