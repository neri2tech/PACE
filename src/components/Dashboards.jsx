import React from 'react';
import { SuperadminDashboard } from './SuperadminDashboard';
import { TeacherDashboard } from './TeacherDashboardComponents';

export { SuperadminDashboard };
export { TeacherDashboard };

export const StudentDashboard = () => (
  <div style={{ padding: '2rem', maxWidth: '900px' }}>
    <div className="animate-slide-up" style={{ marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Student Portal</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>Track your learning journey and access resources.</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
      {['My Progress', 'Resources', 'Assignments', 'Messages'].map((item, i) => (
        <div key={item} className="card animate-slide-up" style={{ animationDelay: `${i * 100}ms`, padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{item}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Coming soon</p>
        </div>
      ))}
    </div>
  </div>
);

export { Auth as Login } from './Auth';
