import type { User, Role } from '../types';
import { multiSchoolStorage } from './multiSchoolStorage';

const USERS_KEY = 'school_users';

interface SchoolUsers {
  [schoolId: string]: User[];
}

const defaultUsers = (schoolId: string): User[] => [
  {
    id: `${schoolId}-admin-1`,
    email: 'admin@school.edu',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as Role,
    schoolId,
    createdAt: new Date().toISOString(),
  },
  {
    id: `${schoolId}-teacher-1`,
    email: 'teacher@school.edu',
    password: 'teacher123',
    name: 'Teacher User',
    role: 'teacher' as Role,
    schoolId,
    createdAt: new Date().toISOString(),
  },
  {
    id: `${schoolId}-viewer-1`,
    email: 'viewer@school.edu',
    password: 'viewer123',
    name: 'Viewer User',
    role: 'viewer' as Role,
    schoolId,
    createdAt: new Date().toISOString(),
  },
];

function initializeSchoolUsers() {
  const schools = multiSchoolStorage.getAllSchools();
  const existingUsers = getSchoolUsers();

  schools.forEach((school) => {
    if (!existingUsers[school.id] || existingUsers[school.id].length === 0) {
      existingUsers[school.id] = defaultUsers(school.id);
    }
  });

  localStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));
}

function getSchoolUsers(): SchoolUsers {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : {};
}

function saveSchoolUsers(users: SchoolUsers): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const schoolAuth = {
  initializeForSchool: (schoolId: string): void => {
    const allUsers = getSchoolUsers();
    if (!allUsers[schoolId] || allUsers[schoolId].length === 0) {
      allUsers[schoolId] = defaultUsers(schoolId);
      saveSchoolUsers(allUsers);
    }
  },

  getUsersBySchool: (schoolId: string): User[] => {
    const allUsers = getSchoolUsers();
    return (allUsers[schoolId] || []).map(({ password, ...user }) => user);
  },

  getAllUsersForSchool: (schoolId: string): User[] => {
    const allUsers = getSchoolUsers();
    return allUsers[schoolId] || [];
  },

  addUser: (user: User): void => {
    const allUsers = getSchoolUsers();
    if (!allUsers[user.schoolId]) {
      allUsers[user.schoolId] = [];
    }
    allUsers[user.schoolId].push(user);
    saveSchoolUsers(allUsers);
  },

  updateUser: (userId: string, updatedUser: User): void => {
    const allUsers = getSchoolUsers();
    const schoolId = updatedUser.schoolId;
    if (allUsers[schoolId]) {
      const index = allUsers[schoolId].findIndex((u) => u.id === userId);
      if (index !== -1) {
        allUsers[schoolId][index] = updatedUser;
        saveSchoolUsers(allUsers);
      }
    }
  },

  deleteUser: (userId: string, schoolId: string): void => {
    const allUsers = getSchoolUsers();
    if (allUsers[schoolId]) {
      allUsers[schoolId] = allUsers[schoolId].filter((u) => u.id !== userId);
      saveSchoolUsers(allUsers);
    }
  },

  validateCredentials: (email: string, password: string, schoolId: string): User | null => {
    const allUsers = getSchoolUsers();
    const schoolUsers = allUsers[schoolId] || [];
    const user = schoolUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  },
};

initializeSchoolUsers();
