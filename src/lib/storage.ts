import type { School, Survey, UploadedFile, SurveyResponse } from '../types';
import { mockSchool, mockSurveys, mockFiles } from '../data/mockData';

const SCHOOL_KEY = 'school_data';
const SURVEYS_KEY = 'surveys_data';
const FILES_KEY = 'files_data';
const RESPONSES_KEY = 'survey_responses';

function initializeStorage() {
  if (!localStorage.getItem(SCHOOL_KEY)) {
    localStorage.setItem(SCHOOL_KEY, JSON.stringify(mockSchool));
  }
  if (!localStorage.getItem(SURVEYS_KEY)) {
    localStorage.setItem(SURVEYS_KEY, JSON.stringify(mockSurveys));
  }
  if (!localStorage.getItem(FILES_KEY)) {
    localStorage.setItem(FILES_KEY, JSON.stringify(mockFiles));
  }
  if (!localStorage.getItem(RESPONSES_KEY)) {
    localStorage.setItem(RESPONSES_KEY, JSON.stringify([]));
  }
}

initializeStorage();

export const storage = {
  getSchool: (): School => {
    const data = localStorage.getItem(SCHOOL_KEY);
    return data ? JSON.parse(data) : mockSchool;
  },

  saveSchool: (school: School): void => {
    localStorage.setItem(SCHOOL_KEY, JSON.stringify(school));
  },

  getSurveys: (): Survey[] => {
    const data = localStorage.getItem(SURVEYS_KEY);
    return data ? JSON.parse(data) : mockSurveys;
  },

  saveSurveys: (surveys: Survey[]): void => {
    localStorage.setItem(SURVEYS_KEY, JSON.stringify(surveys));
  },

  addSurvey: (survey: Survey): void => {
    const surveys = storage.getSurveys();
    surveys.push(survey);
    storage.saveSurveys(surveys);
  },

  updateSurvey: (id: string, updatedSurvey: Survey): void => {
    const surveys = storage.getSurveys();
    const index = surveys.findIndex((s) => s.id === id);
    if (index !== -1) {
      surveys[index] = updatedSurvey;
      storage.saveSurveys(surveys);
    }
  },

  deleteSurvey: (id: string): void => {
    const surveys = storage.getSurveys();
    const filtered = surveys.filter((s) => s.id !== id);
    storage.saveSurveys(filtered);
  },

  getFiles: (): UploadedFile[] => {
    const data = localStorage.getItem(FILES_KEY);
    return data ? JSON.parse(data) : mockFiles;
  },

  saveFiles: (files: UploadedFile[]): void => {
    localStorage.setItem(FILES_KEY, JSON.stringify(files));
  },

  addFile: (file: UploadedFile): void => {
    const files = storage.getFiles();
    files.push(file);
    storage.saveFiles(files);
  },

  deleteFile: (id: string): void => {
    const files = storage.getFiles();
    const filtered = files.filter((f) => f.id !== id);
    storage.saveFiles(filtered);
  },

  getResponses: (): SurveyResponse[] => {
    const data = localStorage.getItem(RESPONSES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveResponses: (responses: SurveyResponse[]): void => {
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
  },

  addResponse: (response: SurveyResponse): void => {
    const responses = storage.getResponses();
    responses.push(response);
    storage.saveResponses(responses);
  },

  getResponsesBySurvey: (surveyId: string): SurveyResponse[] => {
    const responses = storage.getResponses();
    return responses.filter((r) => r.surveyId === surveyId);
  },
};
