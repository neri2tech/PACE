import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SuperadminDashboard, TeacherDashboard, StudentDashboard, Login } from './components/Dashboards';
import { Bootstrap } from './components/Bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';

// PrivateRoute now reads auth state from context
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

function App() {
  React.useEffect(() => {
    const APP_VERSION = '1.0.1'; // Update this to force a clear-out
    const currentVersion = localStorage.getItem('pace_version');
    if (currentVersion !== APP_VERSION) {
      localStorage.clear();
      localStorage.setItem('pace_version', APP_VERSION);
      console.log('App updated: Cache cleared');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/bootstrap" element={<Bootstrap />} />
          {/* Protected routes – wrapped in Layout for header+sidebar */}
          <Route
            path="/superadmin/*"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <Layout>
                  <SuperadminDashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/*"
            element={
              <PrivateRoute allowedRoles={["teacher"]}>
                <Layout>
                  <TeacherDashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/student/*"
            element={
              <PrivateRoute allowedRoles={["student"]}>
                <Layout>
                  <StudentDashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          {/* Catch-all redirect to login or dashboard */}
          <Route path="*" element={<RequireAuthRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Helper component to redirect root based on current role
const RequireAuthRedirect = () => {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${role}`} replace />;
};

export default App;
