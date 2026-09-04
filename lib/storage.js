const STORAGE_KEY_SURVIVORS = 'kdm_showdown_survivors';
const STORAGE_KEY_VIEW_MODE = 'kdm_showdown_view_mode';
const STORAGE_KEY_ACTIVE_INDEX = 'kdm_showdown_active_survivor';

export const sanitizeSurvivor = (survivor, createDefault) => {
  const def = createDefault();
  if (!survivor || typeof survivor !== 'object') return def;

  const result = {
    name: typeof survivor.name === 'string' ? survivor.name : '',
    accuracy: typeof survivor.accuracy === 'number' ? survivor.accuracy : 0,
    strength: typeof survivor.strength === 'number' ? survivor.strength : 0,
    luck: typeof survivor.luck === 'number' ? survivor.luck : 0,
    blindSpot: Boolean(survivor.blindSpot),
    activeWeaponIndex: typeof survivor.activeWeaponIndex === 'number' ? survivor.activeWeaponIndex : 0,
    weapons: []
  };

  if (Array.isArray(survivor.weapons) && survivor.weapons.length > 0) {
    result.weapons = survivor.weapons.map((w, idx) => ({
      name: w?.name || `Weapon ${idx + 1}`,
      accuracy: typeof w?.accuracy === 'number' ? w.accuracy : 0,
      strength: typeof w?.strength === 'number' ? w.strength : 0,
      traits: Array.isArray(w?.traits) ? w.traits : []
    }));
  } else {
    // Migrate from older flat weaponAccuracy / weaponStrength format
    result.weapons = [
      {
        name: 'Weapon 1',
        accuracy: typeof survivor.weaponAccuracy === 'number' ? survivor.weaponAccuracy : 0,
        strength: typeof survivor.weaponStrength === 'number' ? survivor.weaponStrength : 0,
        traits: []
      },
      {
        name: 'Weapon 2',
        accuracy: 0,
        strength: 0,
        traits: []
      }
    ];
  }

  while (result.weapons.length < 2) {
    result.weapons.push({
      name: `Weapon ${result.weapons.length + 1}`,
      accuracy: 0,
      strength: 0,
      traits: []
    });
  }

  return result;
};

export const saveSurvivorsToStorage = (survivors) => {
  if (typeof window === 'undefined') return;
  try {
    const json = JSON.stringify(survivors);

    // 1. Save to LocalStorage (Unlimited client-side persistence)
    window.localStorage.setItem(STORAGE_KEY_SURVIVORS, json);

    // 2. Save to Cookies (1 year expiry, SameSite Lax)
    const encoded = encodeURIComponent(json);
    if (encoded.length < 3800) {
      document.cookie = `${STORAGE_KEY_SURVIVORS}=${encoded}; path=/; max-age=31536000; SameSite=Lax`;
    }
  } catch (err) {
    console.warn('Could not persist survivors to storage/cookies:', err);
  }
};

export const loadSurvivorsFromStorage = (createDefault) => {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Try LocalStorage
    const fromLocal = window.localStorage.getItem(STORAGE_KEY_SURVIVORS);
    if (fromLocal) {
      const parsed = JSON.parse(fromLocal);
      if (Array.isArray(parsed) && parsed.length === 4) {
        return parsed.map(s => sanitizeSurvivor(s, createDefault));
      }
    }

    // 2. Fallback to Cookie
    const match = document.cookie.match(new RegExp('(^|; )' + STORAGE_KEY_SURVIVORS + '=([^;]*)'));
    if (match && match[2]) {
      const parsed = JSON.parse(decodeURIComponent(match[2]));
      if (Array.isArray(parsed) && parsed.length === 4) {
        return parsed.map(s => sanitizeSurvivor(s, createDefault));
      }
    }
  } catch (err) {
    console.warn('Could not read survivors from storage/cookies:', err);
  }
  return null;
};

export const clearSurvivorsStorage = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY_SURVIVORS);
    document.cookie = `${STORAGE_KEY_SURVIVORS}=; path=/; max-age=0; SameSite=Lax`;
  } catch (err) {
    console.warn('Could not clear storage:', err);
  }
};

export const saveViewPreferences = ({ viewMode, activeSurvivorIndex }) => {
  if (typeof window === 'undefined') return;
  try {
    if (viewMode) window.localStorage.setItem(STORAGE_KEY_VIEW_MODE, viewMode);
    if (typeof activeSurvivorIndex === 'number') {
      window.localStorage.setItem(STORAGE_KEY_ACTIVE_INDEX, String(activeSurvivorIndex));
    }
  } catch (e) {}
};

export const loadViewPreferences = () => {
  if (typeof window === 'undefined') return {};
  try {
    const viewMode = window.localStorage.getItem(STORAGE_KEY_VIEW_MODE);
    const activeIndexStr = window.localStorage.getItem(STORAGE_KEY_ACTIVE_INDEX);
    const activeSurvivorIndex = activeIndexStr !== null ? parseInt(activeIndexStr, 10) : undefined;
    return {
      viewMode: viewMode === 'tv' || viewMode === 'single' ? viewMode : undefined,
      activeSurvivorIndex: Number.isInteger(activeSurvivorIndex) ? activeSurvivorIndex : undefined
    };
  } catch (e) {
    return {};
  }
};
