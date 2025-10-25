import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Palette, Upload, FileText, Eye, LogOut, User, Menu, X, Home, Database } from 'lucide-react';
import { useState } from 'react';
import { storage } from '../lib/storage';
import { auth } from '../lib/auth';
import clsx from 'clsx';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = auth.getCurrentUser();
  const school = storage.getSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'teacher', 'viewer'] },
    { path: '/admin', label: 'Branding', icon: Palette, roles: ['admin'] },
    { path: '/uploads', label: 'Uploads', icon: Upload, roles: ['admin', 'teacher'] },
    { path: '/survey-builder', label: 'Surveys', icon: FileText, roles: ['admin', 'teacher'] },
    { path: '/preview', label: 'Portal', icon: Eye, roles: ['admin', 'teacher', 'viewer'] },
    { path: '/data', label: 'Data', icon: Database, roles: ['admin'] },
  ];

  const visibleItems = navItems.filter((item) => user && item.roles.includes(user.role));

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={school.logo} alt={school.name} className="h-10 w-10 rounded-full object-cover" />
              <span className="text-xl font-bold text-gray-900">{school.name}</span>
            </Link>

            <div className="hidden md:flex gap-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium',
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                    style={isActive ? { backgroundColor: school.primaryColor } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: school.primaryColor }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs capitalize" style={{ color: school.primaryColor }}>{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen && user && (
          <div className="md:hidden border-t py-4 space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                  style={isActive ? { backgroundColor: school.primaryColor } : {}}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center gap-3 px-4 py-2 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: school.primaryColor }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm capitalize" style={{ color: school.primaryColor }}>{user.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
