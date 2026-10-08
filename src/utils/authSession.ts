export interface AuthUser {
  username: string;
  role: 'admin' | 'operator' | 'reseller' | 'viewer';
  loginAt: number;
}

const STORAGE_KEY = 'vpn_reseller_current_user';

export function getSavedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUser(username: string, _password?: string): AuthUser {
  const cleanUsername = username.trim() || 'user-001';
  
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
