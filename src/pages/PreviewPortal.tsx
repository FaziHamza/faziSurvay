import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../lib/storage';
import { auth } from '../lib/auth';
import { FileText, Download, Eye, EyeOff } from 'lucide-react';
import type { School, Survey, UploadedFile } from '../types';

export function PreviewPortal() {
  const navigate = useNavigate();
  const user = auth.getCurrentUser();
  const [school, setSchool] = useState<School>(storage.getSchool());
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);

  useEffect(() => {
    setSchool(storage.getSchool());
    setSurveys(storage.getSurveys());
    setFiles(storage.getFiles());
  }, []);

  const isAdmin = user?.role === 'admin';
  const displayedSurveys = showDrafts ? surveys : surveys.filter((s) => s.status === 'published');
  const imageFiles = files.filter((f) => f.type.startsWith('image/'));

  const handleTakeSurvey = (surveyId: string) => {
    navigate(`/survey/${surveyId}`);
  };

  const fontClass = `font-${school.font}`;

  return (
    <div className={`min-h-screen bg-gray-50 ${fontClass}`}>
      <div
        className="text-white py-16 px-4"
        style={{
          background: `linear-gradient(135deg, ${school.primaryColor}, ${school.secondaryColor})`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-4">
            <img
              src={school.logo}
              alt={school.name}
              className="h-24 w-24 rounded-full object-cover border-4 border-white"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2">{school.name}</h1>
              <p className="text-xl text-white/90">{school.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {isAdmin && (
          <div className="mb-6 flex justify-between items-center bg-white rounded-lg shadow-md p-4">
            <div>
              <h3 className="font-semibold text-gray-900">Preview Mode</h3>
              <p className="text-sm text-gray-600">Toggle to view draft content</p>
            </div>
            <button
              onClick={() => setShowDrafts(!showDrafts)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showDrafts
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
              style={showDrafts ? { backgroundColor: `${school.primaryColor}20`, color: school.primaryColor } : {}}
            >
              {showDrafts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showDrafts ? 'Showing All' : 'Published Only'}
            </button>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6" style={{ color: school.primaryColor }} />
              Active Surveys
            </h2>
            <div className="space-y-4">
              {displayedSurveys.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No surveys available</p>
              ) : (
                displayedSurveys.map((survey) => (
                  <div key={survey.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900">{survey.title}</h3>
                      {survey.status === 'draft' && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Draft</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{survey.description}</p>
                    <button
                      onClick={() => handleTakeSurvey(survey.id)}
                      className="text-sm font-medium hover:opacity-80"
                      style={{ color: school.primaryColor }}
                    >
                      Take Survey →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Download className="w-6 h-6" style={{ color: school.primaryColor }} />
              Resources
            </h2>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-medium text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      {file.type.split('/')[1].toUpperCase()}
                    </p>
                  </div>
                  <button className="hover:opacity-80" style={{ color: school.primaryColor }}>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imageFiles.map((file) => (
              <img
                key={file.id}
                src={file.url}
                alt={file.name}
                className="w-full h-40 object-cover rounded-lg border border-gray-200"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
