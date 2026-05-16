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
    <header className="app-header" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 2rem',
      background: 'var(--color-surface)',
      color: 'var(--color-text-main)',
      boxShadow: 'var(--shadow-sm)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
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
