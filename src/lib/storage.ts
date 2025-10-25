import type { School, Survey, UploadedFile, SurveyResponse } from '../types';
import { mockSchool, mockSurveys, mockFiles, mockResponses } from '../data/mockData';
import { multiSchoolStorage } from './multiSchoolStorage';

function getSchoolKey(key: string): string {
  const schoolId = multiSchoolStorage.getActiveSchoolId();
  return `${key}_${schoolId}`;
}

const SCHOOL_KEY = 'school_data';
const SURVEYS_KEY = 'surveys_data';
const FILES_KEY = 'files_data';
const RESPONSES_KEY = 'survey_responses';

function initializeStorage() {
  const schoolKey = getSchoolKey(SCHOOL_KEY);
  const surveysKey = getSchoolKey(SURVEYS_KEY);
  const filesKey = getSchoolKey(FILES_KEY);
  const responsesKey = getSchoolKey(RESPONSES_KEY);

  if (!localStorage.getItem(schoolKey)) {
    const activeSchool = multiSchoolStorage.getActiveSchool();
    localStorage.setItem(schoolKey, JSON.stringify(activeSchool));
  }
  if (!localStorage.getItem(surveysKey)) {
    localStorage.setItem(surveysKey, JSON.stringify(mockSurveys));
  }
  if (!localStorage.getItem(filesKey)) {
    localStorage.setItem(filesKey, JSON.stringify(mockFiles));
  }
  if (!localStorage.getItem(responsesKey)) {
    localStorage.setItem(responsesKey, JSON.stringify(mockResponses));
  }
}

initializeStorage();

export const storage = {
  getSchool: (): School => {
    const activeSchool = multiSchoolStorage.getActiveSchool();
    const data = localStorage.getItem(getSchoolKey(SCHOOL_KEY));
    return data ? JSON.parse(data) : activeSchool;
  },

  saveSchool: (school: School): void => {
    localStorage.setItem(getSchoolKey(SCHOOL_KEY), JSON.stringify(school));
    multiSchoolStorage.updateSchool(school.id, school);
  },

  getSurveys: (): Survey[] => {
    const data = localStorage.getItem(getSchoolKey(SURVEYS_KEY));
    return data ? JSON.parse(data) : mockSurveys;
  },

  saveSurveys: (surveys: Survey[]): void => {
    localStorage.setItem(getSchoolKey(SURVEYS_KEY), JSON.stringify(surveys));
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
    const data = localStorage.getItem(getSchoolKey(FILES_KEY));
    return data ? JSON.parse(data) : mockFiles;
  },

  saveFiles: (files: UploadedFile[]): void => {
    localStorage.setItem(getSchoolKey(FILES_KEY), JSON.stringify(files));
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
    const data = localStorage.getItem(getSchoolKey(RESPONSES_KEY));
    return data ? JSON.parse(data) : [];
  },

  saveResponses: (responses: SurveyResponse[]): void => {
    localStorage.setItem(getSchoolKey(RESPONSES_KEY), JSON.stringify(responses));
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
