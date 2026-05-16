import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

export const Header = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="app-header animate-fade" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 2rem',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      color: 'var(--color-text-main)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '20px',
      position: 'sticky',
      top: '1rem',
      margin: '0 1rem',
      zIndex: 1000
    }}>
      <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img src={logo} alt="PACE" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
        <div className="logo" style={{ 
          fontSize: '1.5rem', 
          fontWeight: '800', 
          fontFamily: 'Outfit, sans-serif',
          background: 'var(--gradient-brand)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>
          PACE
        </div>
      </div>
      
      <div className="account" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: 'var(--color-status-green)',
              boxShadow: '0 0 8px var(--color-status-green)'
            }}></span>
            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-text-main)', textTransform: 'capitalize' }}>
              {role || 'User'}
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email}</div>
        </div>
        <button 
          onClick={handleLogout} 
          className="btn btn-outline" 
          style={{ 
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            borderColor: 'var(--color-border)',
            fontSize: '0.875rem'
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
};
