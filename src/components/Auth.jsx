import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Lock, Mail, UserPlus, LogIn, School, BookOpen, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import authBg from '../assets/auth-bg.png';

export const Auth = () => {
  const { login, register, user, loginWithGoogle, resetPassword, loading: authLoading } = useAuth();
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

  if (authLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a2f38' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-secondary)', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ marginTop: '1rem', color: 'white', opacity: 0.8, fontWeight: '500' }}>Verifying your session...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${authBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.05)',
          filter: 'brightness(0.7)'
        }} />
        
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
