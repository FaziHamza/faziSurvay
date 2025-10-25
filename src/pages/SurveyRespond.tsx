import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, UserX, User } from 'lucide-react';
import { storage } from '../lib/storage';
import { auth } from '../lib/auth';
import type { School, Survey, SurveyResponse } from '../types';

export function SurveyRespond() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const user = auth.getCurrentUser();
  const [school, setSchool] = useState<School>(storage.getSchool());
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: string]: string | string[] }>({});
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSchool(storage.getSchool());
    if (surveyId) {
      const surveys = storage.getSurveys();
      const foundSurvey = surveys.find((s) => s.id === surveyId);
      setSurvey(foundSurvey || null);
    }
  }, [surveyId]);

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!survey) return;

    const response: SurveyResponse = {
      id: `response_${Date.now()}`,
      surveyId: survey.id,
      respondentId: isAnonymous ? null : user?.id || null,
      respondentName: isAnonymous ? null : user?.name || null,
      isAnonymous,
      answers,
      submittedAt: new Date().toISOString(),
    };

    storage.addResponse(response);
    setSubmitted(true);
  };

  const fontClass = `font-${school.font}`;

  if (submitted) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${fontClass}`}>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: school.primaryColor }} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your response has been recorded {isAnonymous ? 'anonymously' : ''}.
          </p>
          <button
            onClick={() => navigate('/preview')}
            className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: school.primaryColor }}
          >
            Back to Portal
          </button>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${fontClass}`}>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <p className="text-gray-600">Survey not found</p>
          <button
            onClick={() => navigate('/preview')}
            className="mt-4 px-6 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: school.primaryColor }}
          >
            Back to Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-12 px-4 ${fontClass}`}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={school.logo}
              alt={school.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
              <p className="text-gray-600">{school.tagline}</p>
            </div>
          </div>
          <div className="border-t pt-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{survey.title}</h2>
            <p className="text-gray-600">{survey.description}</p>
          </div>
        </div>

        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isAnonymous ? (
                  <UserX className="w-5 h-5 text-gray-600" />
                ) : (
                  <User className="w-5 h-5" style={{ color: school.primaryColor }} />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {isAnonymous ? 'Anonymous Response' : `Responding as ${user.name}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isAnonymous ? 'Your identity will not be recorded' : `Role: ${user.role}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isAnonymous
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'text-white hover:opacity-90'
                }`}
                style={!isAnonymous ? { backgroundColor: school.primaryColor } : {}}
              >
                {isAnonymous ? 'Identify Myself' : 'Submit Anonymously'}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {survey.questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                {index + 1}. {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {question.type === 'text' && (
                <textarea
                  required={question.required}
                  rows={4}
                  value={(answers[question.id] as string) || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: school.primaryColor }}
                  placeholder="Your answer..."
                />
              )}

              {question.type === 'multiple-choice' && (
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        required={question.required}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-4 h-4"
                        style={{ accentColor: school.primaryColor }}
                      />
                      <span className="text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'rating' && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <label
                      key={rating}
                      className={`flex items-center justify-center w-12 h-12 border-2 rounded-lg cursor-pointer transition-all ${
                        answers[question.id] === String(rating)
                          ? 'border-2 shadow-md'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={
                        answers[question.id] === String(rating)
                          ? { borderColor: school.primaryColor, backgroundColor: `${school.primaryColor}10` }
                          : {}
                      }
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={rating}
                        required={question.required}
                        checked={answers[question.id] === String(rating)}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-lg font-semibold text-gray-700">{rating}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'yes-no' && (
                <div className="flex gap-4">
                  {['Yes', 'No'].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center justify-center flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        answers[question.id] === option
                          ? 'border-2 shadow-md'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={
                        answers[question.id] === option
                          ? { borderColor: school.primaryColor, backgroundColor: `${school.primaryColor}10` }
                          : {}
                      }
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        required={question.required}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-lg font-semibold text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: school.primaryColor }}
          >
            Submit Survey
          </button>
        </form>
      </div>
    </div>
  );
}
