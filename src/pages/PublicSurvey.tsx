import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { CheckCircle } from 'lucide-react';
import type { School, Survey } from '../types';

export function PublicSurvey() {
  const [school, setSchool] = useState<School>(storage.getSchool());
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSchool(storage.getSchool());
    setSurveys(storage.getSurveys());
  }, []);

  const publishedSurveys = surveys.filter((s) => s.status === 'published');
  const survey = publishedSurveys[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const fontClass = `font-${school.font}`;

  if (submitted) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${fontClass}`}>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600">Your response has been recorded.</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-4 ${fontClass}`}>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <p className="text-gray-600">No surveys available at the moment.</p>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your answer..."
                />
              )}

              {question.type === 'multiple-choice' && (
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        required={question.required}
                        className="w-4 h-4 text-blue-600"
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
                      className="flex items-center justify-center w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={rating}
                        required={question.required}
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
                      className="flex items-center justify-center flex-1 p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        required={question.required}
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
            className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
            style={{ backgroundColor: school.primaryColor }}
          >
            Submit Survey
          </button>
        </form>
      </div>
    </div>
  );
}
