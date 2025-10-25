import type { School, Survey, UploadedFile, SurveyResponse } from '../types';

export const mockSchool: School = {
  id: 'school-1',
  name: 'Riverside High School',
  logo: 'https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg?auto=compress&cs=tinysrgb&w=200',
  primaryColor: '#1e40af',
  secondaryColor: '#3b82f6',
  tagline: 'Excellence in Education Since 1985',
  template: 'modern',
  font: 'inter',
  createdAt: '2025-10-01T10:00:00Z',
};

export const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Student Satisfaction Survey',
    description: 'Help us understand your experience at our school',
    status: 'published',
    createdAt: '2025-10-10T10:00:00Z',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'How satisfied are you with the quality of education?',
        required: true,
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'What is your favorite subject?',
        options: ['Math', 'Science', 'English', 'History', 'Arts', 'Physical Education'],
        required: true,
      },
      {
        id: 'q3',
        type: 'yes-no',
        question: 'Do you feel supported by your teachers?',
        required: true,
      },
      {
        id: 'q4',
        type: 'text',
        question: 'What improvements would you suggest?',
        required: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Parent Feedback Form',
    description: 'We value your input on school programs and activities',
    status: 'published',
    createdAt: '2025-10-08T14:30:00Z',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: 'How would you rate communication from the school?',
        required: true,
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'How often do you visit the school portal?',
        options: ['Daily', 'Weekly', 'Monthly', 'Rarely'],
        required: true,
      },
      {
        id: 'q3',
        type: 'text',
        question: 'What features would you like to see added to the portal?',
        required: false,
      },
    ],
  },
  {
    id: '3',
    title: 'Course Registration Interest',
    description: 'Express your interest in upcoming elective courses',
    status: 'draft',
    createdAt: '2025-10-15T09:15:00Z',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Which elective are you most interested in?',
        options: ['Creative Writing', 'Web Design', 'Environmental Science', 'Music Theory'],
        required: true,
      },
      {
        id: 'q2',
        type: 'yes-no',
        question: 'Are you interested in after-school activities?',
        required: true,
      },
    ],
  },
];

export const mockFiles: UploadedFile[] = [
  {
    id: 'f1',
    name: 'school-logo.png',
    type: 'image/png',
    url: 'https://images.pexels.com/photos/207662/pexels-photo-207662.jpeg?auto=compress&cs=tinysrgb&w=400',
    size: 245678,
    uploadedAt: '2025-10-12T11:20:00Z',
  },
  {
    id: 'f2',
    name: 'student-handbook-2025.pdf',
    type: 'application/pdf',
    url: '#',
    size: 1524000,
    uploadedAt: '2025-10-10T08:45:00Z',
  },
  {
    id: 'f3',
    name: 'campus-map.jpg',
    type: 'image/jpeg',
    url: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=400',
    size: 892340,
    uploadedAt: '2025-10-09T15:30:00Z',
  },
  {
    id: 'f4',
    name: 'sports-team-photo.jpg',
    type: 'image/jpeg',
    url: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
    size: 1134560,
    uploadedAt: '2025-10-08T13:10:00Z',
  },
  {
    id: 'f5',
    name: 'cafeteria-menu.pdf',
    type: 'application/pdf',
    url: '#',
    size: 456780,
    uploadedAt: '2025-10-05T09:00:00Z',
  },
];

export const mockResponses: SurveyResponse[] = [
  {
    id: 'r1',
    surveyId: '1',
    respondentId: '2',
    respondentName: 'Teacher User',
    isAnonymous: false,
    answers: {
      q1: '5',
      q2: 'Science',
      q3: 'Yes',
      q4: 'More hands-on lab activities would be beneficial.',
    },
    submittedAt: '2025-10-20T14:30:00Z',
  },
  {
    id: 'r2',
    surveyId: '1',
    respondentId: null,
    respondentName: null,
    isAnonymous: true,
    answers: {
      q1: '4',
      q2: 'Math',
      q3: 'Yes',
      q4: 'Better cafeteria food options.',
    },
    submittedAt: '2025-10-19T11:20:00Z',
  },
  {
    id: 'r3',
    surveyId: '2',
    respondentId: '3',
    respondentName: 'Viewer User',
    isAnonymous: false,
    answers: {
      q1: '5',
      q2: 'Weekly',
      q3: 'A mobile app would be great!',
    },
    submittedAt: '2025-10-18T09:15:00Z',
  },
  {
    id: 'r4',
    surveyId: '1',
    respondentId: null,
    respondentName: null,
    isAnonymous: true,
    answers: {
      q1: '4',
      q2: 'English',
      q3: 'Yes',
      q4: '',
    },
    submittedAt: '2025-10-17T16:45:00Z',
  },
];
