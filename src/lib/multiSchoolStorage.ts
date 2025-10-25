import type { School } from '../types';

const SCHOOLS_KEY = 'schools_list';
const ACTIVE_SCHOOL_KEY = 'active_school_id';

const defaultSchools: School[] = [
  {
    id: 'school-1',
    name: 'Riverside High School',
    logo: 'https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg?auto=compress&cs=tinysrgb&w=200',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    tagline: 'Excellence in Education Since 1985',
    template: 'modern',
    font: 'inter',
    createdAt: new Date().toISOString(),
  },
];

function initializeMultiSchoolStorage() {
  if (!localStorage.getItem(SCHOOLS_KEY)) {
    localStorage.setItem(SCHOOLS_KEY, JSON.stringify(defaultSchools));
  }
  if (!localStorage.getItem(ACTIVE_SCHOOL_KEY)) {
    localStorage.setItem(ACTIVE_SCHOOL_KEY, defaultSchools[0].id);
  }
}

initializeMultiSchoolStorage();

export const multiSchoolStorage = {
  getAllSchools: (): School[] => {
    const data = localStorage.getItem(SCHOOLS_KEY);
    return data ? JSON.parse(data) : defaultSchools;
  },

  getSchoolById: (id: string): School | undefined => {
    const schools = multiSchoolStorage.getAllSchools();
    return schools.find((s) => s.id === id);
  },

  getActiveSchoolId: (): string => {
    return localStorage.getItem(ACTIVE_SCHOOL_KEY) || defaultSchools[0].id;
  },

  setActiveSchoolId: (schoolId: string): void => {
    localStorage.setItem(ACTIVE_SCHOOL_KEY, schoolId);
  },

  getActiveSchool: (): School => {
    const activeId = multiSchoolStorage.getActiveSchoolId();
    const school = multiSchoolStorage.getSchoolById(activeId);
    return school || defaultSchools[0];
  },

  addSchool: (school: School): void => {
    const schools = multiSchoolStorage.getAllSchools();
    schools.push(school);
    localStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
  },

  updateSchool: (id: string, updatedSchool: School): void => {
    const schools = multiSchoolStorage.getAllSchools();
    const index = schools.findIndex((s) => s.id === id);
    if (index !== -1) {
      schools[index] = updatedSchool;
      localStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
    }
  },

  deleteSchool: (id: string): void => {
    const schools = multiSchoolStorage.getAllSchools();
    const filtered = schools.filter((s) => s.id !== id);
    localStorage.setItem(SCHOOLS_KEY, JSON.stringify(filtered));

    if (multiSchoolStorage.getActiveSchoolId() === id && filtered.length > 0) {
      multiSchoolStorage.setActiveSchoolId(filtered[0].id);
    }
  },

  switchSchool: (schoolId: string): void => {
    const school = multiSchoolStorage.getSchoolById(schoolId);
    if (school) {
      multiSchoolStorage.setActiveSchoolId(schoolId);
      window.location.reload();
    }
  },
};
