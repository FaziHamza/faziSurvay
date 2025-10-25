import type { User, AuthToken, Role } from '../types';

const AUTH_KEY = 'auth_token';

const mockUsers = [
  { id: '1', email: 'admin@school.edu', password: 'admin123', name: 'Admin User', role: 'admin' as Role },
  { id: '2', email: 'teacher@school.edu', password: 'teacher123', name: 'Teacher User', role: 'teacher' as Role },
  { id: '3', email: 'viewer@school.edu', password: 'viewer123', name: 'Viewer User', role: 'viewer' as Role },
];

function generateMockJWT(user: User): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
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
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = generateMockJWT(userWithoutPassword);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    const authToken: AuthToken = {
      token,
      user: userWithoutPassword,
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

  getMockUsers: () => mockUsers.map(({ password, ...user }) => user),
};
