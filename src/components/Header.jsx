import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
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
      padding: '1rem 2rem',
      background: 'var(--color-primary)',
      color: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="logo" style={{ fontSize: '1.5rem', fontWeight: '700' }}>PACE</div>
      <div className="account" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>{user?.email}</span>
        <button onClick={handleLogout} className="btn btn-outline" style={{ color: '#fff', borderColor: '#fff' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>
    </header>
  );
};
