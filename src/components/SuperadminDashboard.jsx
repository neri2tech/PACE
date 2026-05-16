import React, { useState } from 'react';
import { Users, School, BarChart3, Settings, UserPlus, BookOpen } from 'lucide-react';

export const SuperadminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Dummy Data for the UI
  const schoolStats = {
    totalStudents: 1250,
    activeTeachers: 45,
    averageProgress: 72,
    atRiskStudents: 85
  };

  const teachersList = [
    { id: 1, name: 'Sarah Jenkins', subject: 'Mathematics', grade: '10th', status: 'Active' },
    { id: 2, name: 'Marcus Cole', subject: 'History', grade: '9th', status: 'Active' },
    { id: 3, name: 'Elena Rodriguez', subject: 'Science', grade: '11th', status: 'Pending' },
  ];

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Springfield High School - Command Center</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Superadmin Dashboard</p>
        </div>
        <button className="btn btn-primary"><Settings size={18}/> School Settings</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        <button 
          className={activeTab === 'overview' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={() => setActiveTab('overview')}
        ><BarChart3 size={18}/> Global Overview</button>
        <button 
          className={activeTab === 'teachers' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={() => setActiveTab('teachers')}
        ><Users size={18}/> Teacher Management</button>
        <button 
          className={activeTab === 'classes' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={() => setActiveTab('classes')}
        ><BookOpen size={18}/> Class Management</button>
      </div>

      {/* Content Area */}
      {activeTab === 'overview' && (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>School Performance Pulse</h2>
          <div className="data-grid">
            <div className="card">
              <h3 style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Students</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>{schoolStats.totalStudents}</p>
            </div>
            <div className="card">
              <h3 style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Active Teachers</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>{schoolStats.activeTeachers}</p>
            </div>
            <div className="card">
              <h3 style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Avg. Progress</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-status-green)' }}>{schoolStats.averageProgress}%</p>
            </div>
            <div className="card">
              <h3 style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>At-Risk Students</h3>
              <p style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-status-red)' }}>{schoolStats.atRiskStudents}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'teachers' && (
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Teacher Directory</h2>
            <button className="btn btn-primary"><UserPlus size={18}/> Invite Teacher</button>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Subject</th>
                <th style={{ padding: '1rem' }}>Grade Assigned</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachersList.map(teacher => (
                <tr key={teacher.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{teacher.name}</td>
                  <td style={{ padding: '1rem' }}>{teacher.subject}</td>
                  <td style={{ padding: '1rem' }}>{teacher.grade}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={teacher.status === 'Active' ? 'status-badge status-green' : 'status-badge status-yellow'}>
                      {teacher.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'classes' && (
        <div className="card">
          <h2>Class Configuration</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Map teachers to class rosters here. Use bulk import for rapid setup.</p>
          <div style={{ marginTop: '1.5rem', padding: '2rem', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
            <School size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
            <h3>Upload Global Master Roster</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Import a school-wide CSV to auto-generate classes and assign teachers.</p>
            <button className="btn btn-primary">Select CSV File</button>
          </div>
        </div>
      )}
    </div>
  );
};
