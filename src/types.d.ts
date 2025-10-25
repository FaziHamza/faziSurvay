export type Role = 'admin' | 'teacher' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthToken {
  token: string;
  user: User;
  expiresAt: number;
}

export interface School {
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  tagline: string;
  template: 'modern' | 'classic' | 'minimal' | 'vibrant';
  font: 'inter' | 'roboto' | 'poppins' | 'playfair';
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  status: 'draft' | 'published';
  createdAt: string;
}

export interface Question {
  id: string;
  type: 'text' | 'multiple-choice' | 'rating' | 'yes-no';
  question: string;
  options?: string[];
  required: boolean;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string | null;
  respondentName: string | null;
  isAnonymous: boolean;
  answers: { [questionId: string]: string | string[] };
  submittedAt: string;
}
