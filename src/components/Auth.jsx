import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Lock, Mail, UserPlus, LogIn, School, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const { login, register, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [selectedRole, setSelectedRole] = useState('superadmin'); // superadmin = school admin
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const role = await login(email, password);
        if (role) {
          navigate(`/${role}`);
        } else {
          // If no role found, default to teacher or handle it
          navigate('/teacher');
        }
      } else {
        const additionalData = {
          firstName,
          lastName,
          ...(selectedRole === 'superadmin' ? { schoolName } : {})
        };
        const role = await register(email, password, selectedRole, additionalData);
        navigate(`/${role}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null; // App.jsx routing handles redirection if already logged in
  }

  return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--color-bg)', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '0', overflow: 'hidden' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
          <button 
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '1.25rem', 
              background: isLogin ? 'transparent' : 'var(--color-surface)',
              borderBottom: isLogin ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: isLogin ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: isLogin ? '600' : '500',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <LogIn size={18} /> Sign In
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '1.25rem', 
              background: !isLogin ? 'transparent' : 'var(--color-surface)',
              borderBottom: !isLogin ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: !isLogin ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: !isLogin ? '600' : '500',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus size={18} /> Register
          </button>
        </div>

        <div style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: 'var(--color-primary)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              {isLogin ? 'Enter your credentials to access your dashboard' : 'Join PACE to manage your educational institution'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {!isLogin && (
              <>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-input"
                      style={{ width: '100%' }}
                      placeholder="John"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="form-input"
                      style={{ width: '100%' }}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                    <Users size={16} /> Account Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div 
                      onClick={() => setSelectedRole('superadmin')}
                      style={{
                        padding: '1rem',
                        border: `1.5px solid ${selectedRole === 'superadmin' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        background: selectedRole === 'superadmin' ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <School size={24} color={selectedRole === 'superadmin' ? 'var(--color-primary)' : 'var(--color-text-secondary)'} style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: '600', color: selectedRole === 'superadmin' ? 'var(--color-primary)' : 'var(--color-text)' }}>School Admin</div>
                    </div>
                    <div 
                      onClick={() => setSelectedRole('teacher')}
                      style={{
                        padding: '1rem',
                        border: `1.5px solid ${selectedRole === 'teacher' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        background: selectedRole === 'teacher' ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <BookOpen size={24} color={selectedRole === 'teacher' ? 'var(--color-primary)' : 'var(--color-text-secondary)'} style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: '600', color: selectedRole === 'teacher' ? 'var(--color-primary)' : 'var(--color-text)' }}>Teacher</div>
                    </div>
                  </div>
                </div>

                {selectedRole === 'superadmin' && (
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                      <School size={16} /> School Name
                    </label>
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="form-input"
                      style={{ width: '100%' }}
                      placeholder="Springfield High School"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                <Mail size={16} /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ width: '100%' }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                <Lock size={16} /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ width: '100%' }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: 'var(--color-status-red)', 
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                borderLeft: '3px solid var(--color-status-red)'
              }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              disabled={loading}
            >
              {loading ? (
                 <span style={{ opacity: 0.7 }}>Please wait...</span>
              ) : (
                <>
                  {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
