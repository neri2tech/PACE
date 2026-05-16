import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, TrendingUp, AlertTriangle, Send, 
  Search, Filter, ChevronRight, Activity, Target,
  UserCheck, AlertCircle, CheckCircle, Clock, RefreshCw, Plus
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const Skeleton = ({ width = '100%', height = '1rem', style = {} }) => (
  <div style={{
    width, height, borderRadius: '6px',
    background: 'linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite', ...style
  }} />
);

const statusConfig = {
  green:  { label: 'On Track',     color: 'var(--color-status-green)',  bg: 'rgba(16,185,129,0.1)',  icon: CheckCircle },
  yellow: { label: 'Slowing Down', color: 'var(--color-status-yellow)', bg: 'rgba(245,158,11,0.1)',  icon: Clock },
  red:    { label: 'Stagnant',     color: 'var(--color-status-red)',    bg: 'rgba(239,68,68,0.1)',   icon: AlertCircle },
};

// Individual student heatmap card
const StudentCard = ({ student, onSelect }) => {
  const cfg = statusConfig[student.statusColor] || statusConfig.green;
  const Icon = cfg.icon;
  return (
    <div className="card" onClick={() => onSelect(student)} style={{
      cursor: 'pointer', borderLeft: `4px solid ${cfg.color}`,
      padding: '1.25rem', transition: 'all 0.2s ease'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontWeight: '700', color: cfg.color, fontSize: '0.875rem' }}>{student.name[0]}</span>
          </div>
          <div>
            <p style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{student.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{student.grade || 'Grade —'}</p>
          </div>
        </div>
        <div style={{ background: cfg.bg, borderRadius: '8px', padding: '0.375rem', display: 'flex', alignItems: 'center' }}>
          <Icon size={16} color={cfg.color} />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Progress</span>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: cfg.color }}>{student.progress}%</span>
        </div>
        <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{
            width: `${student.progress}%`, height: '100%', background: cfg.color,
            borderRadius: '99px', transition: 'width 0.8s ease'
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: cfg.color, fontWeight: '600', background: cfg.bg, padding: '0.2rem 0.6rem', borderRadius: '99px' }}>
          {cfg.label}
        </span>
        <ChevronRight size={14} color="var(--color-text-muted)" />
      </div>
    </div>
  );
};

// Intervention panel (slides in when student selected)
const InterventionPanel = ({ student, onClose }) => {
  const [message, setMessage] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  if (!student) return null;
  const cfg = statusConfig[student.statusColor] || statusConfig.green;

  return (
    <div className="animate-slide-in card" style={{
      marginBottom: '2rem', border: `2px solid ${cfg.color}`, padding: '1.75rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Intervention: {student.name}</h2>
          <span style={{ fontSize: '0.8rem', background: cfg.bg, color: cfg.color, padding: '0.25rem 0.75rem', borderRadius: '99px', fontWeight: '600' }}>
            {cfg.label} · Progress {student.progress}%
          </span>
        </div>
        <button className="btn btn-outline" onClick={onClose} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>✕ Close</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>Resource URL</label>
          <input type="url" className="form-input" placeholder="https://..." value={resourceUrl} onChange={e => setResourceUrl(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--color-text-secondary)' }}>Message to Student</label>
          <input type="text" className="form-input" placeholder="Personalized note..." value={message} onChange={e => setMessage(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button className="btn btn-primary" style={{ gap: '0.5rem' }}><Send size={15} /> Push Resource</button>
        <button className="btn btn-outline" style={{ gap: '0.5rem' }}><UserCheck size={15} /> Mark as Reviewed</button>
      </div>
    </div>
  );
};

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState(null);

  // Fallback demo data for when Firestore has no students yet
  const demoStudents = [
    { id: 1, name: 'Alice Johnson',  status: 'On Track',     statusColor: 'green',  progress: 85, grade: 'Grade 10' },
    { id: 2, name: 'Bobby Smith',    status: 'Slowing Down', statusColor: 'yellow', progress: 60, grade: 'Grade 10' },
    { id: 3, name: 'Charlie Davis',  status: 'Stagnant',     statusColor: 'red',    progress: 28, grade: 'Grade 10' },
    { id: 4, name: 'Diana Prince',   status: 'On Track',     statusColor: 'green',  progress: 92, grade: 'Grade 10' },
    { id: 5, name: 'Ethan Hunt',     status: 'Slowing Down', statusColor: 'yellow', progress: 55, grade: 'Grade 10' },
    { id: 6, name: 'Fiona Green',    status: 'On Track',     statusColor: 'green',  progress: 78, grade: 'Grade 10' },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const snap = await getDocs(collection(db, 'students'));
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setStudents(data.length > 0 ? data : demoStudents);
      } catch (err) {
        console.error('Failed to load students, using demo data:', err);
        setStudents(demoStudents);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s => {
    const matchSearch = s.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === 'all' || s.statusColor === filterStatus;
    return matchSearch && matchFilter;
  });

  const counts = {
    total: students.length,
    green: students.filter(s => s.statusColor === 'green').length,
    yellow: students.filter(s => s.statusColor === 'yellow').length,
    red: students.filter(s => s.statusColor === 'red').length,
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px' }}>
      {/* Header */}
      <div className="animate-slide-up" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Teacher Command Center</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Monitor student progress and deploy targeted interventions in real-time.
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Students', value: counts.total, color: 'var(--color-accent)', icon: Users },
          { label: 'On Track', value: counts.green, color: 'var(--color-status-green)', icon: CheckCircle },
          { label: 'Slowing Down', value: counts.yellow, color: 'var(--color-status-yellow)', icon: Clock },
          { label: 'Stagnant', value: counts.red, color: 'var(--color-status-red)', icon: AlertCircle },
        ].map(({ label, value, color, icon: Icon }, i) => (
          <div key={label} className="card animate-slide-up" style={{ animationDelay: `${i * 80}ms`, padding: '1.25rem', borderTop: `3px solid ${color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                <p style={{ fontSize: '2rem', fontWeight: '800', color, marginTop: '0.25rem', lineHeight: 1 }}>
                  {loading ? '—' : value}
                </p>
              </div>
              <Icon size={20} color={color} style={{ opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Intervention Panel */}
      <InterventionPanel student={selectedStudent} onClose={() => setSelectedStudent(null)} />

      {/* Search & Filter */}
      <div className="card animate-slide-up" style={{ animationDelay: '350ms', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input type="text" className="form-input" placeholder="Search students..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'all', label: 'All', color: 'var(--color-text-muted)' },
              { id: 'green', label: '✓ On Track', color: 'var(--color-status-green)' },
              { id: 'yellow', label: '⚡ Slowing', color: 'var(--color-status-yellow)' },
              { id: 'red', label: '⚠ Stagnant', color: 'var(--color-status-red)' },
            ].map(({ id, label, color }) => (
              <button key={id} onClick={() => setFilterStatus(id)} style={{
                padding: '0.5rem 0.875rem', borderRadius: '8px', border: '1px solid var(--color-border)',
                background: filterStatus === id ? color : 'white',
                color: filterStatus === id ? 'white' : 'var(--color-text-secondary)',
                fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                borderColor: filterStatus === id ? color : 'var(--color-border)'
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Student Heatmap Grid */}
      <div className="data-grid animate-slide-up" style={{ animationDelay: '400ms', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {loading
          ? Array(6).fill(0).map((_, i) => <Skeleton key={i} height="140px" style={{ borderRadius: '12px' }} />)
          : filtered.length === 0
            ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p style={{ fontWeight: '600' }}>No students found</p>
                <p style={{ fontSize: '0.875rem' }}>Try adjusting your search or filter.</p>
              </div>
            )
            : filtered.map(s => <StudentCard key={s.id} student={s} onSelect={setSelectedStudent} />)
        }
      </div>
    </div>
  );
};
