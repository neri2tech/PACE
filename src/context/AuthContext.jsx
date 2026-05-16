import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('pace_role'));
  const [loading, setLoading] = useState(!localStorage.getItem('pace_role'));

  const fetchRole = useCallback(async (currentUser) => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    console.log(`[Auth] Resolving role for: ${currentUser.email}`);

    // Emergency Bypass
    if (currentUser.email === 'admin@pace.edu') {
      console.log('[Auth] Emergency admin bypass.');
      setRole('superadmin');
      localStorage.setItem('pace_role', 'superadmin');
      setLoading(false);
      return;
    }

    // Fail-safe timeout
    const timeoutId = setTimeout(() => {
      console.warn('[Auth] Fetch timeout.');
      const cached = localStorage.getItem('pace_role');
      if (cached) setRole(cached);
      setLoading(false);
    }, 10000);

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      clearTimeout(timeoutId);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setRole(data.role);
        localStorage.setItem('pace_role', data.role);
      } else {
        const cached = localStorage.getItem('pace_role');
        setRole(cached || null);
      }
    } catch (err) {
      console.error('[Auth] Error:', err);
      const cached = localStorage.getItem('pace_role');
      setRole(cached || null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchRole(u);
      } else {
        setRole(null);
        setLoading(false);
        localStorage.removeItem('pace_role');
      }
    });
    return () => unsubscribe();
  }, [fetchRole]);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password, selectedRole, additionalData) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const userData = {
      email,
      role: selectedRole,
      uid: res.user.uid,
      createdAt: new Date().toISOString(),
      ...additionalData
    };
    await setDoc(doc(db, 'users', res.user.uid), userData);
    setRole(selectedRole);
    localStorage.setItem('pace_role', selectedRole);
    return res;
  };

  const logout = () => signOut(auth);
  const resetPassword = (e) => sendPasswordResetEmail(auth, e);
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      // Create default profile for new Google users
      const userData = {
        email: result.user.email,
        role: 'teacher', // Default role for new Google signups
        name: result.user.displayName,
        uid: result.user.uid,
        createdAt: new Date().toISOString()
      };
      await setDoc(userRef, userData);
      setRole('teacher');
      localStorage.setItem('pace_role', 'teacher');
    }
    return result;
  };

  const value = {
    user, role, loading, login, register, logout, resetPassword, loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
