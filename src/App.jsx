import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Bootstrap } from './components/Bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';

// Lazy load dashboards for faster initial bundle and smoother transitions
const SuperadminDashboard = lazy(() => import('./components/SuperadminDashboard').then(m => ({ default: m.SuperadminDashboard })));
const TeacherDashboard = lazy(() => import('./components/TeacherDashboardComponents').then(m => ({ default: m.TeacherDashboard })));
const StudentDashboard = lazy(() => import('./components/Dashboards').then(m => ({ default: m.StudentDashboard })));
const Login = lazy(() => import('./components/Auth').then(m => ({ default: m.Auth })));

// Error Boundary for graceful recovery
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Critical Runtime Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem', textAlign: 'center', background: '#f9fafb' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>Something went wrong</h2>
          <p style={{ color: '#4b5563', marginBottom: '2rem' }}>We encountered an unexpected error. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '0.75rem 1.5rem', background: '#0a2f38', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Refresh Application</button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingScreen />}>
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
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
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
