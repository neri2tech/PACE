import React from 'react';
import { Activity, TrendingUp, BookOpen, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SuperadminDashboard } from './SuperadminDashboard';
import { TeacherDashboard } from './TeacherDashboardComponents';
import { Auth } from './Auth';

export { SuperadminDashboard };
export { TeacherDashboard };

export const StudentDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>
      {/* Welcome Header */}
      <div className="animate-slide-up" style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          Welcome back, <span style={{ color: 'var(--color-primary)' }}>{user?.firstName || 'Learner'}!</span>
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
          Your academic engine is running at <span style={{ color: 'var(--color-status-green)', fontWeight: '700' }}>88% efficiency.</span>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Main Progress Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card animate-scale" style={{ padding: '2rem', background: 'var(--gradient-brand)', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Learning Milestone</h2>
              <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '400px' }}>
                You're just 12% away from completing the "Advanced Analytics" module. Keep pushing!
              </p>
              <div style={{ height: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', background: 'white', borderRadius: '99px' }}></div>
              </div>
            </div>
            <Activity size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {[
              { label: 'Active Tasks', value: '04', icon: BookOpen, color: 'var(--color-primary)' },
              { label: 'Target Score', value: '75%', icon: Target, color: 'var(--color-secondary)' }
            ].map((stat, i) => (
              <div key={stat.label} className="card animate-slide-up" style={{ padding: '1.5rem', animationDelay: `${i * 100}ms` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{stat.label}</p>
                    <p style={{ fontSize: '2rem', fontWeight: '800', marginTop: '0.5rem' }}>{stat.value}</p>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'var(--color-background)', borderRadius: '12px', color: stat.color }}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card animate-slide-up" style={{ padding: '1.5rem', animationDelay: '300ms' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TrendingUp size={20} color="var(--color-primary)" />
              Weekly Insights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Time Spent', val: '12.5 hrs', trend: '+2h' },
                { label: 'Courses Active', val: '03', trend: 'Steady' },
                { label: 'Interventions', val: '00', trend: 'Perfect' }
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{item.label}</span>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>{item.val}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-status-green)' }}>{item.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Auth as Login } from './Auth';
