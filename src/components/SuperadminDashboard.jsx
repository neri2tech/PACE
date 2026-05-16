import React, { useState, useEffect } from 'react';
import { Users, School, BarChart3, Settings, UserPlus, BookOpen } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import { firebaseApp, firebaseConfig, auth, db } from '../firebase';
import { StudentRegistration } from './StudentRegistration';

export const SuperadminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', subject: '' });
  const [teachersList, setTeachersList] = useState([
    { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@pace.edu', subject: 'Mathematics', status: 'Active' },
    { id: 2, name: 'Marcus Cole', email: 'marcus.c@pace.edu', subject: 'History', status: 'Active' },
  ]);

  const handleInviteTeacher = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      // Create a secondary app instance to create user without logging out the current admin
      const { initializeApp: initApp } = await import('firebase/app');
      const { getAuth: getSecondaryAuth, createUserWithEmailAndPassword: createUser, signOut: secondarySignOut } = await import('firebase/auth');
      
      const secondaryApp = initApp(firebaseConfig, 'SecondaryAdmin');
      const secondaryAuth = getSecondaryAuth(secondaryApp);

      // 1. Create Teacher Auth Account
      const tempPassword = Math.random().toString(36).slice(-8);
      const userCredential = await createUser(secondaryAuth, newTeacher.email, tempPassword);
      const newUid = userCredential.user.uid;
      
      // Sign out of the secondary app immediately
      await secondarySignOut(secondaryAuth);
      
      // 2. Save Teacher to 'users' collection (centralized role management)
      await setDoc(doc(db, 'users', newUid), {
        name: newTeacher.name,
        email: newTeacher.email,
        subject: newTeacher.subject,
        status: 'Active',
        role: 'teacher',
        createdAt: new Date().toISOString()
      });

      // 3. Update local state
      setTeachersList([...teachersList, { id: newUid, ...newTeacher, status: 'Active' }]);
      
      alert(`Teacher created successfully!\nEmail: ${newTeacher.email}\nTemp Password: ${tempPassword}`);
      
      setNewTeacher({ name: '', email: '', subject: '' });
      setShowInviteModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed to invite teacher: ' + err.message);
    } finally {
      setIsInviting(false);
    }
  };

  // Dummy Data for the UI
  const schoolStats = {
    totalStudents: 1250,
    activeTeachers: teachersList.length,
    averageProgress: 72,
    atRiskStudents: 85
  };

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
          className={activeTab === 'students' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={() => setActiveTab('students')}
        ><BookOpen size={18}/> Student Management</button>
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
            <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
              <UserPlus size={18}/> Invite Teacher
            </button>
          </div>

          {showInviteModal && (
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <h3>Invite New Teacher</h3>
              <form onSubmit={handleInviteTeacher} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                  <input type="text" className="form-input" required value={newTeacher.name} onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                  <input type="email" className="form-input" required value={newTeacher.email} onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Subject</label>
                  <input type="text" className="form-input" required value={newTeacher.subject} onChange={(e) => setNewTeacher({...newTeacher, subject: e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isInviting}>
                  {isInviting ? 'Inviting...' : 'Send Invite'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowInviteModal(false)}>Cancel</button>
              </form>
            </div>
          )}
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Subject</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachersList.map((teacher, index) => (
                <tr key={teacher.id || index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{teacher.name}</td>
                  <td style={{ padding: '1rem' }}>{teacher.email}</td>
                  <td style={{ padding: '1rem' }}>{teacher.subject}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={teacher.status === 'Active' ? 'status-badge status-green' : 'status-badge status-yellow'}>
                      {teacher.status || 'Active'}
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

      {activeTab === 'students' && (
        <StudentRegistration />
      )}
    </div>
  );
};
