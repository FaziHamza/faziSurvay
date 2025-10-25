import { useState } from 'react';
import { Database, Download, Upload, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { storage } from '../lib/storage';
import { auth } from '../lib/auth';

export function DataManagement() {
  const school = storage.getSchool();
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const exportData = () => {
    const data = {
      school: storage.getSchool(),
      surveys: storage.getSurveys(),
      files: storage.getFiles(),
      responses: storage.getResponses(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `school-portal-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setMessage('Data exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        if (data.school) storage.saveSchool(data.school);
        if (data.surveys) storage.saveSurveys(data.surveys);
        if (data.files) storage.saveFiles(data.files);
        if (data.responses) storage.saveResponses(data.responses);

        setMessage('Data imported successfully! Refreshing page...');
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        setMessage('Error importing data. Please check the file format.');
        setTimeout(() => setMessage(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    localStorage.clear();
    setMessage('All data cleared! Redirecting to login...');
    setTimeout(() => window.location.href = '/login', 2000);
  };

  const getStorageStats = () => {
    const surveys = storage.getSurveys();
    const files = storage.getFiles();
    const responses = storage.getResponses();

    return {
      surveys: surveys.length,
      files: files.length,
      responses: responses.length,
      publishedSurveys: surveys.filter(s => s.status === 'published').length,
      draftSurveys: surveys.filter(s => s.status === 'draft').length,
      anonymousResponses: responses.filter(r => r.isAnonymous).length,
    };
  };

  const stats = getStorageStats();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
          <p className="text-gray-600">Manage your local storage data, import and export settings</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{message}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${school.primaryColor}20`, color: school.primaryColor }}>
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Storage Statistics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Surveys:</span>
                <span className="font-semibold text-gray-900">{stats.surveys}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm pl-4">Published:</span>
                <span className="font-medium text-gray-700">{stats.publishedSurveys}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm pl-4">Drafts:</span>
                <span className="font-medium text-gray-700">{stats.draftSurveys}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Uploaded Files:</span>
                <span className="font-semibold text-gray-900">{stats.files}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Responses:</span>
                <span className="font-semibold text-gray-900">{stats.responses}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 text-sm pl-4">Anonymous:</span>
                <span className="font-medium text-gray-700">{stats.anonymousResponses}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Local Storage</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>All data is stored locally in your browser</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>No external database or backend required</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Data persists across browser sessions</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Export and import your data anytime</span>
              </p>
              <p className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>Clearing browser data will remove all information</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Export Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download all your portal data as a JSON file. This includes branding, surveys, files, and responses.
            </p>
            <button
              onClick={exportData}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors font-medium"
              style={{ backgroundColor: school.primaryColor }}
            >
              <Download className="w-5 h-5" />
              Export All Data
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Import Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Import previously exported data. This will replace all existing data with the imported data.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
              id="import-data"
            />
            <label
              htmlFor="import-data"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium cursor-pointer"
            >
              <Upload className="w-5 h-5" />
              Import Data
            </label>
          </div>

          <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700">
                  Clear all data from local storage. This action cannot be undone. You will be logged out and all data will be permanently deleted.
                </p>
              </div>
            </div>
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Trash2 className="w-5 h-5" />
                Clear All Data
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-red-900">Are you absolutely sure? This cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={clearAllData}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Yes, Delete Everything
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
