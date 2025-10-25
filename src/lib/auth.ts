import type { User, AuthToken, Role } from '../types';
import { multiSchoolStorage } from './multiSchoolStorage';
import { schoolAuth } from './schoolAuth';

const AUTH_KEY = 'auth_token';

function generateMockJWT(user: User): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    schoolId: user.schoolId,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(`mock-signature-${user.id}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

export const auth = {
  login: (email: string, password: string): AuthToken | null => {
    const activeSchoolId = multiSchoolStorage.getActiveSchoolId();
    const user = schoolAuth.validateCredentials(email, password, activeSchoolId);

    if (!user) {
      return null;
    }

    const token = generateMockJWT(user);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    const authToken: AuthToken = {
      token,
      user,
      expiresAt,
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(authToken));
    return authToken;
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser: (): User | null => {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return null;

    try {
      const authToken: AuthToken = JSON.parse(authData);

      if (Date.now() > authToken.expiresAt) {
        auth.logout();
        return null;
      }

      const payload = decodeJWT(authToken.token);
      if (!payload) {
        auth.logout();
        return null;
      }

      const activeSchoolId = multiSchoolStorage.getActiveSchoolId();
      if (authToken.user.schoolId !== activeSchoolId) {
        auth.logout();
        return null;
      }

      return authToken.user;
    } catch {
      auth.logout();
      return null;
    }
  },

  getToken: (): string | null => {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return null;

    try {
      const authToken: AuthToken = JSON.parse(authData);

      if (Date.now() > authToken.expiresAt) {
        auth.logout();
        return null;
      }

      return authToken.token;
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return auth.getCurrentUser() !== null;
  },

  hasRole: (role: Role): boolean => {
    const user = auth.getCurrentUser();
    return user?.role === role;
  },

  hasAnyRole: (roles: Role[]): boolean => {
    const user = auth.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  },

  getMockUsers: () => {
    const activeSchoolId = multiSchoolStorage.getActiveSchoolId();
    return schoolAuth.getUsersBySchool(activeSchoolId);
  },
};
