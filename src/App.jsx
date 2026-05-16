import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SuperadminDashboard, TeacherDashboard, StudentDashboard, Login } from './components/Dashboards';
import { Bootstrap } from './components/Bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';

// Loading Spinner for auth transitions
const LoadingScreen = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100vh', background: 'var(--color-background)', gap: '1rem'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '50%',
      border: '4px solid var(--color-border)',
      borderTopColor: 'var(--color-secondary)',
      animation: 'spin 0.8s linear infinite'
    }} />
    <p style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}>Loading PACE...</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// PrivateRoute waits for loading before deciding
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && !allowedRoles.includes(role)) return <Navigate to={`/${role}`} replace />;
  // If role is briefly null but user is authenticated, show loading
  if (!role) return <LoadingScreen />;
  return children;
};

function App() {
  React.useEffect(() => {
    // Only clear non-auth data; don't wipe role on version bump
    const APP_VERSION = '1.0.2';
    const currentVersion = localStorage.getItem('pace_version');
    if (currentVersion !== APP_VERSION) {
      const role = localStorage.getItem('role'); // preserve role
      localStorage.clear();
      if (role) localStorage.setItem('role', role); // restore role
      localStorage.setItem('pace_version', APP_VERSION);
      console.log('App updated: Cache cleared (role preserved)');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/bootstrap" element={<Bootstrap />} />

          <Route path="/superadmin/*" element={
            <PrivateRoute allowedRoles={['superadmin']}>
              <Layout><SuperadminDashboard /></Layout>
            </PrivateRoute>
          } />
          <Route path="/teacher/*" element={
            <PrivateRoute allowedRoles={['teacher']}>
              <Layout><TeacherDashboard /></Layout>
            </PrivateRoute>
          } />
          <Route path="/student/*" element={
            <PrivateRoute allowedRoles={['student']}>
              <Layout><StudentDashboard /></Layout>
            </PrivateRoute>
          } />

          <Route path="*" element={<RequireAuthRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const RequireAuthRedirect = () => {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!role) return <LoadingScreen />;
  return <Navigate to={`/${role}`} replace />;
};

export default App;
