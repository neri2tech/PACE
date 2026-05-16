import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Bootstrap } from './components/Bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';

// Lazy load dashboards for faster initial bundle and smoother transitions
import { SuperadminDashboard } from './components/SuperadminDashboard';
import { TeacherDashboard } from './components/TeacherDashboardComponents';
import { StudentDashboard } from './components/Dashboards';
import { Auth as Login } from './components/Auth';

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
const LoadingScreen = () => null;

// PrivateRoute waits for loading before deciding
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && !allowedRoles.includes(role)) return <Navigate to={`/${role}`} replace />;
  
  // If role is missing, redirect to bootstrap
  if (!role) {
    return <Navigate to="/bootstrap" replace />;
  }
  
  return children;
};

function App() {
  React.useEffect(() => {
    // Only clear non-auth data; don't wipe role on version bump
    const APP_VERSION = '1.0.3';
    const currentVersion = localStorage.getItem('pace_version');
    if (currentVersion !== APP_VERSION) {
      const role = localStorage.getItem('pace_role'); // preserve role
      localStorage.clear();
      if (role) localStorage.setItem('pace_role', role); // restore role
      localStorage.setItem('pace_version', APP_VERSION);
      console.log('App updated: Cache cleared (pace_role preserved)');
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app-container">
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
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const RequireAuthRedirect = () => {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  
  // If role is missing, redirect to bootstrap to re-sync account
  if (!role) {
    console.warn("[Auth] No role found, redirecting to bootstrap");
    return <Navigate to="/bootstrap" replace />;
  }
  
  return <Navigate to={`/${role}`} replace />;
};

export default App;
