import React, { useState, useEffect } from 'react';
import { 
  Users, School, BarChart3, Settings, UserPlus, BookOpen, 
  TrendingUp, AlertTriangle, CheckCircle, Clock, Award,
  ChevronRight, Activity, Target, Zap, RefreshCw
} from 'lucide-react';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, firebaseConfig } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { StudentRegistration } from './StudentRegistration';

// Skeleton loader component
const Skeleton = ({ width = '100%', height = '1rem', style = {} }) => (
  <div style={{
    width, height, borderRadius: '6px',
    background: 'linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    ...style
  }} />
);

// Stat card with animated counter
const StatCard = ({ icon: Icon, label, value, sub, color, delay = 0 }) => (
  <div className="card animate-slide-up" style={{
    animationDelay: `${delay}ms`,
    display: 'flex', flexDirection: 'column', gap: '1rem',
    borderTop: `4px solid ${color}`, padding: '1.5rem'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{label}</p>
        <p style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--color-primary)', lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>{sub}</p>}
      </div>
      <div style={{ background: `${color}18`, borderRadius: '12px', padding: '0.75rem', display: 'flex' }}>
        <Icon size={24} color={color} />
      </div>
    </div>
  </div>
);

export const SuperadminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', subject: '' });
  const [teachersList, setTeachersList] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [schoolInfo, setSchoolInfo] = useState(null);

  // Load real data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingTeachers(true);
        // Fetch teachers
        const teachersSnap = await getDocs(collection(db, 'users'));
        const teachers = teachersSnap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(u => u.role === 'teacher');
        setTeachersList(teachers);

        // Fetch school info from current user doc
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) setSchoolInfo(userDoc.data());
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        // Use defaults on error
        setTeachersList([]);
      } finally {
        setLoadingTeachers(false);
      }
    };
    fetchData();
  }, [user]);

  const handleInviteTeacher = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      const { initializeApp: initApp, getApps } = await import('firebase/app');
      const { getAuth: getSecondaryAuth, createUserWithEmailAndPassword: createUser, signOut: secondarySignOut } = await import('firebase/auth');

      const existingApps = getApps();
      const secondaryApp = existingApps.find(a => a.name === 'SecondaryAdmin') 
        || initApp(firebaseConfig, 'SecondaryAdmin');
      const secondaryAuth = getSecondaryAuth(secondaryApp);

      const tempPassword = `Pace${Math.random().toString(36).slice(-6)}!`;
      const userCredential = await createUser(secondaryAuth, newTeacher.email, tempPassword);
      const newUid = userCredential.user.uid;
      await secondarySignOut(secondaryAuth);

      const teacherData = {
        name: newTeacher.name, email: newTeacher.email,
        subject: newTeacher.subject, status: 'Active',
        role: 'teacher', createdAt: new Date().toISOString(),
        schoolId: schoolInfo?.schoolId || user?.uid
      };
      await setDoc(doc(db, 'users', newUid), teacherData);
      setTeachersList(prev => [...prev, { id: newUid, ...teacherData }]);

      alert(`✅ Teacher created!\nEmail: ${newTeacher.email}\nTemp Password: ${tempPassword}\n\nShare these credentials securely.`);
      setNewTeacher({ name: '', email: '', subject: '' });
      setShowInviteModal(false);
    } catch (err) {
      console.error(err);
      alert('Failed: ' + err.message);
    } finally {
      setIsInviting(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'students', label: 'Students', icon: BookOpen },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px' }}>
      {/* Header */}
      <div className="animate-slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            {schoolInfo?.schoolName || 'School Command Center'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Welcome back, <strong>{schoolInfo?.firstName || user?.email?.split('@')[0]}</strong> · Superadmin Dashboard
          </p>
        </div>
        <button className="btn btn-primary" style={{ gap: '0.5rem' }} onClick={() => setShowInviteModal(true)}>
          <UserPlus size={16} /> Invite Teacher
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: 'var(--color-background)', padding: '0.375rem', borderRadius: '12px', width: 'fit-content' }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none',
            background: activeTab === id ? 'white' : 'transparent',
            color: activeTab === id ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontWeight: activeTab === id ? '700' : '500',
            boxShadow: activeTab === id ? 'var(--shadow-sm)' : 'none',
            cursor: 'pointer', transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem'
          }}>
            <Icon size={16} />{label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="data-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', marginBottom: '2rem' }}>
            <StatCard icon={Users} label="Active Teachers" value={loadingTeachers ? '—' : teachersList.length} sub="Registered staff" color="var(--color-secondary)" delay={0} />
            <StatCard icon={BookOpen} label="Students" value="—" sub="Sync Firestore to load" color="var(--color-accent)" delay={100} />
            <StatCard icon={TrendingUp} label="Avg. Progress" value="72%" sub="School-wide metric" color="var(--color-status-green)" delay={200} />
            <StatCard icon={AlertTriangle} label="At-Risk" value="—" sub="Needs intervention" color="var(--color-status-red)" delay={300} />
          </div>

          {/* Activity feed */}
          <div className="card animate-slide-up" style={{ animationDelay: '400ms', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="var(--color-secondary)" /> Recent Activity
            </h2>
            {loadingTeachers ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1,2,3].map(i => <Skeleton key={i} height="3rem" />)}
              </div>
            ) : teachersList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p style={{ fontWeight: '600' }}>No teachers yet</p>
                <p style={{ fontSize: '0.875rem' }}>Invite your first teacher to get started.</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => { setActiveTab('teachers'); setShowInviteModal(true); }}>
                  <UserPlus size={16} /> Invite Teacher
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {teachersList.map((t, i) => (
                  <div key={t.id || i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.875rem 1rem', background: 'var(--color-background)',
                    borderRadius: '10px', transition: 'background 0.2s'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.875rem' }}>
                        {(t.name || t.email || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{t.name || t.email}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t.subject || 'No subject'}</p>
                      </div>
                    </div>
                    <span className="status-badge status-green">Active</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Teachers Tab */}
      {activeTab === 'teachers' && (
        <div className="card animate-scale" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Teacher Directory</h2>
            <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
              <UserPlus size={16} /> Invite Teacher
            </button>
          </div>

          {/* Invite Modal */}
          {showInviteModal && (
            <div className="animate-scale" style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--color-background)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>New Teacher Account</h3>
              <form onSubmit={handleInviteTeacher} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: '0.75rem', alignItems: 'flex-end' }}>
                {[
                  { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Jane Doe' },
                  { label: 'Email', field: 'email', type: 'email', placeholder: 'jane@school.edu' },
                  { label: 'Subject', field: 'subject', type: 'text', placeholder: 'Mathematics' },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>{label}</label>
                    <input type={type} className="form-input" required placeholder={placeholder}
                      value={newTeacher[field]} onChange={e => setNewTeacher({ ...newTeacher, [field]: e.target.value })} />
                  </div>
                ))}
                <button type="submit" className="btn btn-primary" disabled={isInviting} style={{ whiteSpace: 'nowrap' }}>
                  {isInviting ? <><RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Creating...</> : 'Create Account'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowInviteModal(false)}>Cancel</button>
              </form>
            </div>
          )}

          {loadingTeachers ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1,2,3].map(i => <Skeleton key={i} height="56px" />)}
            </div>
          ) : teachersList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
              <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontWeight: '600' }}>No teachers yet. Invite one above!</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  {['Teacher', 'Email', 'Subject', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teachersList.map((teacher, i) => (
                  <tr key={teacher.id || i} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-background)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.8rem', flexShrink: 0 }}>
                        {(teacher.name || teacher.email || '?')[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{teacher.name || '—'}</span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{teacher.email}</td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{teacher.subject || '—'}</td>
                    <td style={{ padding: '1rem' }}><span className="status-badge status-green">{teacher.status || 'Active'}</span></td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="animate-scale">
          <StudentRegistration />
        </div>
      )}
    </div>
  );
};
