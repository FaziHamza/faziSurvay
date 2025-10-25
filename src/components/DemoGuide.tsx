import { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle } from 'lucide-react';
import { storage } from '../lib/storage';
import { auth } from '../lib/auth';

export function DemoGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const user = auth.getCurrentUser();
  const school = storage.getSchool();

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('demo_guide_seen');
    if (!hasSeenGuide && user) {
      setIsOpen(true);
    }
  }, [user]);

  const handleClose = () => {
    localStorage.setItem('demo_guide_seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen || !user) return null;

  const adminFeatures = [
    'Customize branding (colors, logo, fonts)',
    'Create and manage surveys',
    'Upload and organize files',
    'View all survey responses',
    'Export/import data',
    'Preview mode to see draft content',
  ];

  const teacherFeatures = [
    'Create surveys for students',
    'Upload teaching materials',
    'View survey responses',
    'Access the school portal',
  ];

  const viewerFeatures = [
    'View school portal',
    'Take surveys (with anonymous option)',
    'Download resources',
    'Access announcements',
  ];

  const features = user.role === 'admin' ? adminFeatures : user.role === 'teacher' ? teacherFeatures : viewerFeatures;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div
          className="p-6 text-white rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${school.primaryColor}, ${school.secondaryColor})`,
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Welcome to {school.name}!</h2>
                <p className="text-white/90">Demo Version - All features unlocked</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: `${school.primaryColor}20`, color: school.primaryColor }}>
              <span className="font-semibold capitalize">Logged in as: {user.role}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              What you can do as a {user.role}:
            </h3>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: school.primaryColor }} />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Demo Credentials:</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Admin:</span>
                <span className="font-mono text-gray-900">admin@school.edu / admin123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Teacher:</span>
                <span className="font-mono text-gray-900">teacher@school.edu / teacher123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Viewer:</span>
                <span className="font-mono text-gray-900">viewer@school.edu / viewer123</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Logout and login with different credentials to experience different roles.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 Quick Demo Path:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              {user.role === 'admin' && (
                <>
                  <li>Customize branding in the Branding page</li>
                  <li>Create a new survey in Survey Builder</li>
                  <li>Upload a file in Uploads</li>
                  <li>Preview the portal to see your changes</li>
                  <li>View survey responses in Survey Builder</li>
                  <li>Export your data from Data Management</li>
                </>
              )}
              {user.role === 'teacher' && (
                <>
                  <li>View existing surveys in Survey Builder</li>
                  <li>Upload teaching materials in Uploads</li>
                  <li>Check survey responses</li>
                  <li>View the portal to take a survey</li>
                </>
              )}
              {user.role === 'viewer' && (
                <>
                  <li>Explore the school portal</li>
                  <li>Take a survey with or without anonymity</li>
                  <li>Download resources</li>
                  <li>View announcements and gallery</li>
                </>
              )}
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              <strong>Note:</strong> All data is stored in your browser's local storage. No backend required!
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: school.primaryColor }}
          >
            Got it, let's explore!
          </button>
        </div>
      </div>
    </div>
  );
}
