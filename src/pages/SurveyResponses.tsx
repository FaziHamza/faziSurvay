import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserX, Calendar } from 'lucide-react';
import { storage } from '../lib/storage';
import type { Survey, SurveyResponse } from '../types';

export function SurveyResponses() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    if (surveyId) {
      const surveys = storage.getSurveys();
      const foundSurvey = surveys.find((s) => s.id === surveyId);
      setSurvey(foundSurvey || null);

      const surveyResponses = storage.getResponsesBySurvey(surveyId);
      setResponses(surveyResponses);
    }
  }, [surveyId]);

  if (!survey) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">Survey not found</p>
          <button
            onClick={() => navigate('/survey-builder')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Survey Builder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate('/survey-builder')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Survey Builder
        </button>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h1>
          <p className="text-gray-600 mb-6">{survey.description}</p>
          <div className="flex gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{responses.length} responses</span>
            </div>
            <div className="flex items-center gap-2">
              <UserX className="w-4 h-4" />
              <span>{responses.filter(r => r.isAnonymous).length} anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created {new Date(survey.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No responses yet</h3>
          <p className="text-gray-600">Responses will appear here once users submit the survey.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {responses.map((response, index) => (
            <div key={response.id} className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-start mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Response #{index + 1}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    {response.isAnonymous ? (
                      <div className="flex items-center gap-1">
                        <UserX className="w-4 h-4" />
                        <span>Anonymous</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{response.respondentName}</span>
                      </div>
                    )}
                    <span>•</span>
                    <span>{new Date(response.submittedAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {survey.questions.map((question, qIndex) => {
                  const answer = response.answers[question.id];
                  return (
                    <div key={question.id}>
                      <p className="font-medium text-gray-900 mb-2">
                        {qIndex + 1}. {question.question}
                      </p>
                      <div className="pl-4 border-l-2 border-gray-200">
                        {Array.isArray(answer) ? (
                          <ul className="list-disc list-inside text-gray-700">
                            {answer.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-700">{answer || 'No answer provided'}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
