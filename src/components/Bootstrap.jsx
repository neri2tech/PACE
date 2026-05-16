import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const Bootstrap = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ padding: '2rem', textAlign: 'center', background: '#f0f4f8', height: '100vh' }}>
      <h1>PACE System Bootstrap</h1>
      <p>Click below to initialize the primary Superadmin account.</p>
      <button 
        onClick={createAdmin} 
        disabled={loading}
        style={{ 
          padding: '1rem 2rem', 
          background: 'var(--color-primary, #2563eb)', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.1rem'
        }}
      >
        {loading ? 'Processing...' : 'Create Admin Account'}
      </button>
      <p style={{ marginTop: '2rem', fontWeight: 'bold' }}>{status}</p>
      <div style={{ marginTop: '2rem' }}>
        <a href="/login">Go to Login</a>
      </div>
    </div>
  );
};
