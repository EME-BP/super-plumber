const USERNAME_KEY = "plumber.username";
const MAX_KEY = "plumber.unlockedMax";
const OLD_L2_KEY = "plumber.unlockedLevel2";

export function loadUsername() {
  try {
    return (localStorage.getItem(USERNAME_KEY) || "").slice(0, 16);
  } catch {
    return "";
  }
}

export function saveUsername(name) {
  try {
    localStorage.setItem(USERNAME_KEY, (name || "").trim().slice(0, 16));
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadUnlockedMax() {
  try {
    const stored = Number(localStorage.getItem(MAX_KEY));
    if (Number.isFinite(stored) && stored >= 1) return Math.min(4, stored);
    if (localStorage.getItem(OLD_L2_KEY) === "1") return 2;
    return 1;
  } catch {
    return 1;
  }
}

export function saveUnlockedMax(max) {
  try {
    localStorage.setItem(MAX_KEY, String(Math.min(4, Math.max(1, max))));
  } catch {
    /* ignore quota / private mode */
  }
}
