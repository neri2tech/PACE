import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const Bootstrap = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const repairSession = async () => {
    if (!auth.currentUser) {
      setStatus('ERROR: You must be logged in to repair your session. Go to login first.');
      return;
    }
    setLoading(true);
    setStatus('Repairing session...');
    try {
      const uid = auth.currentUser.uid;
      const role = localStorage.getItem('pace_role') || 'superadmin'; 
      await setDoc(doc(db, "users", uid), {
        email: auth.currentUser.email,
        role: role,
        firstName: "User",
        lastName: "(Recovered)",
        createdAt: new Date().toISOString()
      }, { merge: true });
      
      localStorage.setItem('pace_role', role);
      setStatus(`SUCCESS: Session repaired! Redirecting to ${role} dashboard...`);
      setTimeout(() => window.location.href = `/${role}`, 2000);
    } catch (error) {
      setStatus('ERROR: ' + error.message);
    }
    setLoading(false);
  };

  const createAdmin = async () => {
    setLoading(true);
    setStatus('Creating...');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, "admin@pace.edu", "PaceAdmin2026!");
      const uid = userCredential.user.uid;
      
      await setDoc(doc(db, "users", uid), {
        email: "admin@pace.edu",
        role: "superadmin",
        firstName: "PACE",
        lastName: "Admin",
        schoolName: "PACE Academy",
        createdAt: new Date().toISOString()
      });
      
      setStatus('SUCCESS: Superadmin account created! You can now login.');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setStatus('INFO: Admin account already exists. Try logging in.');
      } else {
        setStatus('ERROR: ' + error.message);
      }
    }
    setLoading(false);
  };

  const clearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    setStatus('SUCCESS: Local storage and session cache cleared.');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ maxWidth: '440px', margin: '0 auto', background: 'white', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#1e293b' }}>System Utilities</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Use these tools to repair your account or initialize the system.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={repairSession} disabled={loading} style={{ ...buttonStyle, background: '#059669' }}>
            {loading ? 'Repairing...' : '1. Repair My Session'}
          </button>

          <button onClick={createAdmin} disabled={loading} style={buttonStyle}>
            {loading ? 'Processing...' : '2. Create Admin Account'}
          </button>

          <button onClick={clearCache} style={{ ...buttonStyle, background: '#64748b' }}>
            3. Clear System Data
          </button>
        </div>
        
        {status && (
          <div style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: '8px', background: status.includes('SUCCESS') ? '#f0fdf4' : '#fef2f2', color: status.includes('SUCCESS') ? '#15803d' : '#b91c1c', fontSize: '0.9rem', fontWeight: '500' }}>
            {status}
          </div>
        )}
        
        <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <a href="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Return to Login</a>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = { 
  padding: '1rem 2rem', 
  background: '#2563eb', 
  color: 'white', 
  border: 'none', 
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '600',
  width: '100%',
  transition: 'all 0.2s'
};
