export interface AuthUser {
  username: string;
  role: 'admin' | 'operator' | 'reseller' | 'viewer';
  loginAt: number;
}

const STORAGE_KEY = 'vpn_reseller_current_user';
const RECENT_USERS_KEY = 'vpn_reseller_recent_users';

export function getSavedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUser(username: string): AuthUser {
  const cleanUsername = username.trim() || 'operator-01';
  
  let role: AuthUser['role'] = 'operator';
  if (cleanUsername.toLowerCase().includes('admin')) {
    role = 'admin';
  } else if (cleanUsername.toLowerCase().includes('reseller')) {
    role = 'reseller';
  } else if (cleanUsername.toLowerCase().includes('viewer')) {
    role = 'viewer';
  }

  const user: AuthUser = {
    username: cleanUsername,
    role,
    loginAt: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    // Also update recent user history
    const recent = getRecentUsers();
    const updated = [cleanUsername, ...recent.filter(u => u !== cleanUsername)].slice(0, 5);
    localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save user session:', err);
  }

  return user;
}

export function clearUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function getRecentUsers(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_USERS_KEY);
    if (!raw) return ['admin-01', 'operator-sg', 'reseller-vpn'];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return ['admin-01', 'operator-sg', 'reseller-vpn'];
  } catch {
    return ['admin-01', 'operator-sg', 'reseller-vpn'];
  }
}
