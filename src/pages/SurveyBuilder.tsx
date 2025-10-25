import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Edit, Trash2, BarChart3 } from 'lucide-react';
import { storage } from '../lib/storage';
import { SurveyForm } from '../components/SurveyForm';
import type { Survey } from '../types';
import clsx from 'clsx';

export function SurveyBuilder() {
  const navigate = useNavigate();
  const school = storage.getSchool();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<Survey | undefined>();
  const [responseCounts, setResponseCounts] = useState<{ [surveyId: string]: number }>({});

  useEffect(() => {
    const loadedSurveys = storage.getSurveys();
    setSurveys(loadedSurveys);

    const counts: { [surveyId: string]: number } = {};
    loadedSurveys.forEach((survey) => {
      counts[survey.id] = storage.getResponsesBySurvey(survey.id).length;
    });
    setResponseCounts(counts);
  }, []);

  const handleCreate = () => {
    setEditingSurvey(undefined);
    setShowForm(true);
  };

  const handleEdit = (survey: Survey) => {
    setEditingSurvey(survey);
    setShowForm(true);
  };

  const handleSave = (survey: Survey) => {
    if (editingSurvey) {
      storage.updateSurvey(survey.id, survey);
    } else {
      storage.addSurvey(survey);
    }
    const loadedSurveys = storage.getSurveys();
    setSurveys(loadedSurveys);

    const counts: { [surveyId: string]: number } = {};
    loadedSurveys.forEach((s) => {
      counts[s.id] = storage.getResponsesBySurvey(s.id).length;
    });
    setResponseCounts(counts);

    setShowForm(false);
    setEditingSurvey(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this survey?')) {
      storage.deleteSurvey(id);
      setSurveys(storage.getSurveys());
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSurvey(undefined);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Survey Builder</h1>
            <p className="text-gray-600">Create and manage surveys for your community</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors font-medium shadow-md"
            style={{ backgroundColor: school.primaryColor }}
          >
            <Plus className="w-5 h-5" />
            Create Survey
          </button>
        </div>

        <div className="grid gap-4">
          {surveys.length === 0 && !showForm ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <FileText className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No surveys yet</h3>
              <p className="text-gray-600 mb-6">Create your first survey to start collecting feedback</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors font-medium shadow-md"
                style={{ backgroundColor: school.primaryColor }}
              >
                <Plus className="w-5 h-5" />
                Create Your First Survey
              </button>
            </div>
          ) : !showForm ? (
            surveys.map((survey) => (
              <div
                key={survey.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 mt-1" style={{ color: school.primaryColor }} />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{survey.title}</h3>
                      <p className="text-gray-600 mt-1">{survey.description}</p>
                    </div>
                  </div>
                  <span
                    className={clsx(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      survey.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {survey.status}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    {survey.questions.length} questions • {responseCounts[survey.id] || 0} responses • Created {new Date(survey.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/survey/${survey.id}/responses`)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium"
                      style={{ color: school.primaryColor }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${school.primaryColor}10`}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Responses ({responseCounts[survey.id] || 0})
                    </button>
                    <button
                      onClick={() => handleEdit(survey)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(survey.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : null}
        </div>
      </div>

      {showForm && (
        <SurveyForm
          survey={editingSurvey}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
