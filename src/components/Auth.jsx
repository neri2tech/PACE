import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Lock, Mail, UserPlus, LogIn, School, BookOpen, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import bg1 from '../assets/auth-bg-1.png';
import bg2 from '../assets/auth-bg-2.png';

export const Auth = () => {
  const { login, register, user, loginWithGoogle, resetPassword, loading: authLoading } = useAuth();
  const [currentBg, setCurrentBg] = useState(0);
  const backgrounds = [bg1, bg2];

  // Slideshow Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [backgrounds.length]);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [selectedRole, setSelectedRole] = useState('superadmin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Handle Remember Me on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('pace_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const getFriendlyErrorMessage = (error) => {
    const code = error.code || error.message;
    if (code.includes('auth/invalid-credential') || code.includes('auth/wrong-password') || code.includes('auth/user-not-found')) {
      return 'The email or password you entered is incorrect. Please try again.';
    }
    if (code.includes('auth/email-already-in-use')) {
      return 'An account with this email already exists. Try signing in instead.';
    }
    if (code.includes('auth/weak-password')) {
      return 'Your password is too weak. Please use at least 6 characters.';
    }
    if (code.includes('auth/network-request-failed') || code.includes('offline')) {
      return 'Connection problem. Please check your internet or disable ad-blockers and try again.';
    }
    if (code.includes('auth/popup-closed-by-user')) {
      return 'The login popup was closed. Please try again.';
    }
    return 'Something went wrong. Please check your details and try again.';
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setSuccess('');
    setIsProcessing(true);
    try {
      await resetPassword(email);
      setSuccess('Check your inbox! We\'ve sent a password reset link.');
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsProcessing(true);

    // Save/Clear email for Remember Me
    if (rememberMe) {
      localStorage.setItem('pace_remembered_email', email);
    } else {
      localStorage.removeItem('pace_remembered_email');
    }

    try {
      if (isLogin) {
        const role = await login(email, password);
        if (role) {
          navigate(`/${role}`);
        }
      } else {
        const additionalData = {
          firstName,
          lastName,
          ...(selectedRole === 'superadmin' ? { schoolName } : {})
        };
        const role = await register(email, password, selectedRole, additionalData);
        if (role) navigate(`/${role}`);
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading) return null; // Instant bypass for auth verification screen

  if (user) return null;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      width: '100vw',
      background: 'white',
      overflow: 'hidden'
    }}>
      {/* Column 1: Showcase Section */}
      <div className="auth-showcase animate-fade" style={{ 
        flex: '1.2',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Slideshow */}
        {backgrounds.map((bg, idx) => (
          <div key={idx} style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'scale(1.05)',
            filter: 'brightness(0.7)',
            opacity: currentBg === idx ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            zIndex: 0
          }} />
        ))}
        
        {/* Deep Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(10, 47, 56, 0.9) 0%, rgba(0, 209, 193, 0.4) 100%)',
          zIndex: 1
        }} />

        <div style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem',
          color: 'white'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'white', 
            borderRadius: '12px', 
            padding: '10px', 
            marginBottom: '2rem',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
          }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Drive Academic <br/> 
            <span style={{ color: 'var(--color-secondary)' }}>Excellence with PACE.</span>
          </h1>

          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '500px', marginBottom: '3rem', lineHeight: '1.6' }}>
            The all-in-one engine designed to track student progress, automate interventions, and empower educators with real-time insights.
          </p>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {[
              'Real-time Performance Analytics',
              'Automated Student Interventions',
              'Multi-tenant School Management',
              'AI-Powered Educational Insights'
            ].map(feature => (
              <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem', borderRadius: '50%' }}>
                  <CheckCircle size={18} color="var(--color-secondary)" />
                </div>
                <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Auth Form Section */}
      <div style={{ 
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem',
        background: 'white',
        zIndex: 5
      }}>
        <div style={{ maxWidth: '420px', margin: '0 auto', width: '100%' }}>
          {/* Header Mobile Only */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              {isLogin ? 'Sign In' : 'Join PACE'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              {isLogin ? 'Enter your credentials to access your dashboard.' : 'Register your school and start tracking progress today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLogin && (
              <>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">First Name</label>
                    <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="form-input" placeholder="Jane" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Last Name</label>
                    <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="form-input" placeholder="Smith" />
                  </div>
                </div>

                <div>
                  <label className="form-label">Account Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <button type="button" onClick={() => setSelectedRole('superadmin')} style={{
                      padding: '0.75rem', borderRadius: '10px', border: '1px solid',
                      borderColor: selectedRole === 'superadmin' ? 'var(--color-secondary)' : 'var(--color-border)',
                      background: selectedRole === 'superadmin' ? 'rgba(0, 209, 193, 0.05)' : 'white',
                      fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                    }}>School Admin</button>
                    <button type="button" onClick={() => setSelectedRole('teacher')} style={{
                      padding: '0.75rem', borderRadius: '10px', border: '1px solid',
                      borderColor: selectedRole === 'teacher' ? 'var(--color-secondary)' : 'var(--color-border)',
                      background: selectedRole === 'teacher' ? 'rgba(0, 209, 193, 0.05)' : 'white',
                      fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                    }}>Teacher</button>
                  </div>
                </div>

                {selectedRole === 'superadmin' && (
                  <div>
                    <label className="form-label">School Name</label>
                    <input type="text" required value={schoolName} onChange={e => setSchoolName(e.target.value)} className="form-input" placeholder="St. Peters Academy" />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="form-input" style={{ paddingLeft: '2.75rem' }} placeholder="name@school.edu" />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                {isLogin && <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}>Forgot?</button>}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} className="form-input" style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setRememberMe(!rememberMe)}>
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', userSelect: 'none' }}>Remember my email</span>
              </div>
            )}

            {error && <div className="animate-shake" style={{ padding: '0.75rem', background: '#FEF2F2', color: '#B91C1C', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500', border: '1px solid #FCA5A5' }}>{error}</div>}
            {success && <div style={{ padding: '0.75rem', background: '#F0FDF4', color: '#15803D', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500', border: '1px solid #86EFAC' }}>{success}</div>}

            <button type="submit" disabled={isProcessing} className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--gradient-brand)', fontSize: '1rem', fontWeight: '700', boxShadow: '0 4px 12px rgba(0, 209, 193, 0.2)', marginTop: '0.5rem' }}>
              {isProcessing ? 'Processing...' : isLogin ? 'Sign Into Dashboard' : 'Create My Account'}
            </button>

            {isLogin && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
                </div>

                <button 
                  type="button" 
                  disabled={isProcessing}
                  onClick={async () => {
                    setIsProcessing(true);
                    setError('');
                    try {
                      await loginWithGoogle();
                    } catch (err) {
                      setError(getFriendlyErrorMessage(err));
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  style={{ 
                    width: '100%', padding: '0.875rem', borderRadius: '12px', 
                    background: 'white', border: '1px solid var(--color-border)',
                    fontSize: '0.95rem', fontWeight: '600', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    cursor: 'pointer', transition: 'all 0.2s', color: 'var(--color-text-main)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {isLogin ? "Don't have an account yet?" : "Already have an account?"}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: '700', marginLeft: '0.5rem', cursor: 'pointer', textDecoration: 'underline' }}>
                {isLogin ? 'Register School' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
