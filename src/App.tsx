import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AdminBranding } from './pages/AdminBranding';
import { SchoolManagement } from './pages/SchoolManagement';
import { UserManagement } from './pages/UserManagement';
import { Uploads } from './pages/Uploads';
import { SurveyBuilder } from './pages/SurveyBuilder';
import { PreviewPortal } from './pages/PreviewPortal';
import { PublicSurvey } from './pages/PublicSurvey';
import { SurveyRespond } from './pages/SurveyRespond';
import { SurveyResponses } from './pages/SurveyResponses';
import { DataManagement } from './pages/DataManagement';
import { auth } from './lib/auth';

function App() {
  const user = auth.getCurrentUser();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/public-survey" element={<PublicSurvey />} />
          <Route path="/survey/:surveyId" element={<SurveyRespond />} />

          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route
                    path="/"
                    element={
                      user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'teacher', 'viewer']}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/schools"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <SchoolManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminBranding />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/uploads"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                        <Uploads />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/survey-builder"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                        <SurveyBuilder />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/preview"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'teacher', 'viewer']}>
                        <PreviewPortal />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/survey/:surveyId/responses"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'teacher']}>
                        <SurveyResponses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/data"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <DataManagement />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
