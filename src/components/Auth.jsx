import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Lock, Mail, UserPlus, LogIn, School, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export const Auth = () => {
  const { login, register, user, loginWithGoogle, resetPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [selectedRole, setSelectedRole] = useState('superadmin'); // superadmin = school admin
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess('Password reset link sent to your email!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const role = await loginWithGoogle(selectedRole); 
      if (role) {
        navigate(`/${role}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    return null; 
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

      <div className="card animate-fade" style={{ 
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
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {isLogin && (
                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
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

            {success && (
              <div style={{ 
                padding: '0.75rem', 
                background: 'rgba(16, 185, 129, 0.1)', 
                color: 'var(--color-status-green)', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                borderLeft: '4px solid var(--color-status-green)',
                fontWeight: '500'
              }}>
                {success}
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

          <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', fontWeight: '500' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '0.875rem', 
              background: 'white', 
              color: '#444', 
              border: '1px solid #ddd', 
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};
