/**
 * Remembers an invite code between someone clicking /join/:code and finishing signup.
 * Kept in localStorage so it survives the signup redirects.
 */
const KEY = "jobz_invite_code";

export const rememberInviteCode = (code: string) => {
  try {
    localStorage.setItem(KEY, code.trim().toUpperCase());
  } catch {
    /* storage blocked — the invite simply isn't credited */
  }
};

export const readInviteCode = (): string | null => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const clearInviteCode = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};
