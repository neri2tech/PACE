import React, { useState } from 'react';
import { SuperadminDashboard as RealSuperadminDashboard } from './SuperadminDashboard';
import { StudentRegistration } from './StudentRegistration';
import { 
  ClassPerformanceGrid, 
  StudentInterventionView, 
  ResourceManager, 
  TeacherFlexibilityControls 
} from './TeacherDashboardComponents';

export const SuperadminDashboard = RealSuperadminDashboard;

export const TeacherDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Dummy Data for Class Heatmap
  const mockStudents = [
    { id: 1, name: 'Alice Johnson', status: 'On Track', statusColor: 'green', progress: 85 },
    { id: 2, name: 'Bobby Smith', status: 'Slowing Down', statusColor: 'yellow', progress: 60 },
    { id: 3, name: 'Charlie Davis', status: 'Stagnant', statusColor: 'red', progress: 30 },
    { id: 4, name: 'Diana Prince', status: 'On Track', statusColor: 'green', progress: 92 },
  ];

  return (
    <div className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Teacher Command Center</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Monitor progress and deploy interventions.</p>
      </div>

      <ClassPerformanceGrid 
        students={mockStudents} 
        onSelectStudent={setSelectedStudent} 
      />

      <StudentInterventionView 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <ResourceManager />
        <TeacherFlexibilityControls />
      </div>

      <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
        <StudentRegistration />
      </div>
    </div>
  );
};

export const StudentDashboard = () => (
  <div className="main-content">
    <h1>Student Dashboard</h1>
    <p>Welcome to your learning portal.</p>
  </div>
);

export const Login = () => (
  <div className="main-content">
    <h1>PACE Login</h1>
    <p>Please select your role to continue.</p>
  </div>
);
