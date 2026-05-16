import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Lock, Mail, UserPlus, LogIn, School, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

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
    <div className="main-content" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 50%, var(--color-secondary) 100%)', 
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--color-secondary)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', background: 'var(--color-accent)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.1 }}></div>

      <div className="card" style={{ 
        width: '100%', 
        maxWidth: '480px', 
        padding: '0', 
        overflow: 'hidden', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: 'var(--shadow-premium)',
        zIndex: 1
      }}>
        
        {/* Branding Header */}
        <div style={{ 
          padding: '2.5rem 2.5rem 1.5rem', 
          textAlign: 'center', 
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 1.5rem', 
            background: 'white',
            borderRadius: '20px',
            padding: '12px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src={logo} alt="PACE Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            margin: '0', 
            background: 'var(--gradient-brand)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.04em'
          }}>
            PACE
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '0.5rem', fontWeight: '500' }}>
            Academic Progress Tracker
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--color-background)' }}>
          <button 
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '1rem', 
              background: isLogin ? 'var(--color-surface)' : 'transparent',
              borderBottom: isLogin ? '3px solid var(--color-secondary)' : '3px solid transparent',
              color: isLogin ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <LogIn size={18} /> Sign In
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{ 
              flex: 1, 
              padding: '1rem', 
              background: !isLogin ? 'var(--color-surface)' : 'transparent',
              borderBottom: !isLogin ? '3px solid var(--color-secondary)' : '3px solid transparent',
              color: !isLogin ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <UserPlus size={18} /> Register
          </button>
        </div>

        <div style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {!isLogin && (
              <>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-input"
                      placeholder="John"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="form-input"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    <Users size={16} /> Account Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div 
                      onClick={() => setSelectedRole('superadmin')}
                      style={{
                        padding: '1rem',
                        border: `2px solid ${selectedRole === 'superadmin' ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        background: selectedRole === 'superadmin' ? 'rgba(0, 209, 193, 0.05)' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <School size={24} color={selectedRole === 'superadmin' ? 'var(--color-secondary)' : 'var(--color-text-muted)'} style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: '700', color: selectedRole === 'superadmin' ? 'var(--color-primary)' : 'var(--color-text-main)' }}>School Admin</div>
                    </div>
                    <div 
                      onClick={() => setSelectedRole('teacher')}
                      style={{
                        padding: '1rem',
                        border: `2px solid ${selectedRole === 'teacher' ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        background: selectedRole === 'teacher' ? 'rgba(0, 209, 193, 0.05)' : 'transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <BookOpen size={24} color={selectedRole === 'teacher' ? 'var(--color-secondary)' : 'var(--color-text-muted)'} style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: '700', color: selectedRole === 'teacher' ? 'var(--color-primary)' : 'var(--color-text-main)' }}>Teacher</div>
                    </div>
                  </div>
                </div>

                {selectedRole === 'superadmin' && (
                  <div>
                    <label className="form-label">
                      <School size={16} /> School Name
                    </label>
                    <input
                      type="text"
                      required
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="form-input"
                      placeholder="Springfield High School"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="form-label">
                <Mail size={16} /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="form-label">
                <Lock size={16} /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                color: 'var(--color-status-red)', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                borderLeft: '4px solid var(--color-status-red)',
                fontWeight: '500'
              }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                width: '100%', 
                marginTop: '1rem', 
                padding: '1rem', 
                fontSize: '1.1rem', 
                background: 'var(--gradient-brand)',
                boxShadow: '0 4px 15px rgba(0, 209, 193, 0.3)',
                borderRadius: 'var(--radius-md)'
              }}
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
