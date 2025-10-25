import { useNavigate } from 'react-router-dom';
import { Palette, Upload, FileText, Eye, TrendingUp, Users, Calendar, Database } from 'lucide-react';
import { storage } from '../lib/storage';
import { auth } from '../lib/auth';
import { DemoGuide } from '../components/DemoGuide';

export function Dashboard() {
  const navigate = useNavigate();
  const user = auth.getCurrentUser();
  const school = storage.getSchool();
  const surveys = storage.getSurveys();
  const files = storage.getFiles();
  const responses = storage.getResponses();

  const publishedSurveys = surveys.filter(s => s.status === 'published');
  const draftSurveys = surveys.filter(s => s.status === 'draft');
  const recentResponses = responses.slice(-5).reverse();

  const adminCards = [
    {
      title: 'Branding',
      description: 'Customize portal appearance',
      icon: Palette,
      color: school.primaryColor,
      path: '/admin',
      stats: `${school.name}`,
    },
    {
      title: 'Surveys',
      description: 'Create and manage surveys',
      icon: FileText,
      color: '#10b981',
      path: '/survey-builder',
      stats: `${surveys.length} total, ${publishedSurveys.length} published`,
    },
    {
      title: 'Uploads',
      description: 'Manage files and resources',
      icon: Upload,
      color: '#f59e0b',
      path: '/uploads',
      stats: `${files.length} files`,
    },
    {
      title: 'Portal Preview',
      description: 'View live portal',
      icon: Eye,
      color: '#6366f1',
      path: '/preview',
      stats: 'See what users see',
    },
    {
      title: 'Data Management',
      description: 'Export, import, and manage data',
      icon: Database,
      color: '#8b5cf6',
      path: '/data',
      stats: `${responses.length} responses stored`,
    },
  ];

  const teacherCards = [
    {
      title: 'Surveys',
      description: 'Create and view surveys',
      icon: FileText,
      color: '#10b981',
      path: '/survey-builder',
      stats: `${surveys.length} surveys`,
    },
    {
      title: 'Uploads',
      description: 'Upload teaching materials',
      icon: Upload,
      color: '#f59e0b',
      path: '/uploads',
      stats: `${files.length} files`,
    },
    {
      title: 'Portal',
      description: 'View school portal',
      icon: Eye,
      color: '#6366f1',
      path: '/preview',
      stats: `${publishedSurveys.length} active surveys`,
    },
  ];

  const viewerCards = [
    {
      title: 'School Portal',
      description: 'View announcements and resources',
      icon: Eye,
      color: school.primaryColor,
      path: '/preview',
      stats: `${publishedSurveys.length} surveys available`,
    },
  ];

  const cards = user?.role === 'admin' ? adminCards : user?.role === 'teacher' ? teacherCards : viewerCards;

  return (
    <>
      <DemoGuide />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          className="bg-gradient-to-r text-white rounded-2xl shadow-lg p-8 mb-8"
          style={{
            background: `linear-gradient(135deg, ${school.primaryColor}, ${school.secondaryColor})`,
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-white/90 text-lg">
                {user?.role === 'admin' && 'Manage your school portal and content'}
                {user?.role === 'teacher' && 'Create surveys and upload materials'}
                {user?.role === 'viewer' && 'Explore the school portal'}
              </p>
            </div>
            <img src={school.logo} alt={school.name} className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-left group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: card.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{card.description}</p>
                <p className="text-xs font-medium" style={{ color: card.color }}>
                  {card.stats}
                </p>
              </button>
            );
          })}
        </div>

        {user?.role !== 'viewer' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${school.primaryColor}20`, color: school.primaryColor }}>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Quick Stats</h2>
                  <p className="text-sm text-gray-600">Overview of your portal</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Total Surveys</span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: school.primaryColor }}>{surveys.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Total Responses</span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: school.primaryColor }}>{responses.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Uploaded Files</span>
                  </div>
                  <span className="text-2xl font-bold" style={{ color: school.primaryColor }}>{files.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${school.primaryColor}20`, color: school.primaryColor }}>
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                  <p className="text-sm text-gray-600">Latest survey responses</p>
                </div>
              </div>
              <div className="space-y-3">
                {recentResponses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No responses yet</p>
                  </div>
                ) : (
                  recentResponses.map((response) => {
                    const survey = surveys.find(s => s.id === response.surveyId);
                    return (
                      <div key={response.id} className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{survey?.title || 'Unknown Survey'}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {response.isAnonymous ? 'Anonymous' : response.respondentName} • {new Date(response.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
