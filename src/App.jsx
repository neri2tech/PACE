import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SuperadminDashboard, TeacherDashboard, StudentDashboard, Login } from './components/Dashboards';

// Dummy Auth Context/Provider for initial scaffolding
const isAuthenticated = true;
const userRole = 'teacher'; // 'superadmin', 'teacher', 'student'

const PrivateRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Superadmin Routes */}
          <Route 
            path="/superadmin/*" 
            element={
              <PrivateRoute allowedRoles={['superadmin']}>
                <SuperadminDashboard />
              </PrivateRoute>
            } 
          />

          {/* Teacher Routes */}
          <Route 
            path="/teacher/*" 
            element={
              <PrivateRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </PrivateRoute>
            } 
          />

          {/* Student Routes */}
          <Route 
            path="/student/*" 
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            } 
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={`/${userRole}`} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
