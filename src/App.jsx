import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SuperadminDashboard, TeacherDashboard, StudentDashboard, Login } from './components/Dashboards';
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
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
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
          {/* Default – redirect based on role if logged in */}
          <Route
            path="/"
            element={
              <RequireAuthRedirect />
            }
          />
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
