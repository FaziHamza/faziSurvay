import { Database, Info } from 'lucide-react';
import { storage } from '../lib/storage';

export function StorageInfo() {
  const school = storage.getSchool();
  const surveys = storage.getSurveys();
  const files = storage.getFiles();
  const responses = storage.getResponses();

  const calculateSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-5 h-5" style={{ color: school.primaryColor }} />
        <h3 className="font-semibold text-gray-900">Local Storage</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">School Data:</span>
          <span className="font-medium text-gray-900">✓</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Surveys:</span>
          <span className="font-medium text-gray-900">{surveys.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Files:</span>
          <span className="font-medium text-gray-900">{files.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Responses:</span>
          <span className="font-medium text-gray-900">{responses.length}</span>
        </div>
        <div className="flex justify-between border-t pt-2 mt-2">
          <span className="text-gray-600">Storage Used:</span>
          <span className="font-medium text-gray-900">{calculateSize()} KB</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-600">
            All data is stored locally in your browser and persists across sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
