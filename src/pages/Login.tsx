import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Building2 } from 'lucide-react';
import { auth } from '../lib/auth';
import { storage } from '../lib/storage';
import { multiSchoolStorage } from '../lib/multiSchoolStorage';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const school = storage.getSchool();
  const activeSchool = multiSchoolStorage.getActiveSchool();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const authToken = auth.login(email, password);

      if (!authToken) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      navigate('/dashboard');
      setIsLoading(false);
    }, 500);
  };

  const quickLogin = (role: 'admin' | 'teacher' | 'viewer') => {
    const credentials = {
      admin: { email: 'admin@school.edu', password: 'admin123' },
      teacher: { email: 'teacher@school.edu', password: 'teacher123' },
      viewer: { email: 'viewer@school.edu', password: 'viewer123' },
    };

    setEmail(credentials[role].email);
    setPassword(credentials[role].password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            {school.logo && (
              <img
                src={school.logo}
                alt={school.name}
                className="h-20 w-20 mx-auto rounded-full object-cover mb-4"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{school.name}</h1>
            <p className="text-gray-600">{school.tagline}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@school.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: school.primaryColor }}
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3 text-center">Quick Login (Demo)</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('admin')}
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => quickLogin('teacher')}
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => quickLogin('viewer')}
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Viewer
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-blue-900" />
              <p className="text-xs text-blue-900 font-medium">
                Logging in to: {activeSchool.name}
              </p>
            </div>
            <p className="text-xs text-blue-900 font-medium mb-2">Demo Credentials:</p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>Admin: admin@school.edu / admin123</li>
              <li>Teacher: teacher@school.edu / teacher123</li>
              <li>Viewer: viewer@school.edu / viewer123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
