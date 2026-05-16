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
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async (currentUser) => {
    if (!currentUser) return;
    
    console.log(`[Auth] Starting role resolution for: ${currentUser.email}`);

    // 1. Emergency Bypass for primary admin
    if (currentUser.email === 'admin@pace.edu') {
      console.log('[Auth] Emergency admin bypass activated.');
      setRole('superadmin');
      localStorage.setItem('pace_role', 'superadmin');
      setLoading(false);
      return;
    }

    // 2. Try Firestore with a fail-safe timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('[Auth] Firestore fetch timed out. Using fallback.');
      const cachedRole = localStorage.getItem('pace_role');
      if (cachedRole) setRole(cachedRole);
      setLoading(false);
    }, 10000); // 10s fallback

    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      clearTimeout(timeoutId);

      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log(`[Auth] Role confirmed from DB: ${data.role}`);
        setRole(data.role);
        localStorage.setItem('pace_role', data.role);
      } else {
        console.warn(`[Auth] No profile found in DB for ${currentUser.uid}`);
        const cachedRole = localStorage.getItem('pace_role');
        setRole(cachedRole || null);
      }
    } catch (err) {
      console.error('[Auth] Firestore error:', err);
      const cachedRole = localStorage.getItem('pace_role');
      setRole(cachedRole || null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchRole(currentUser);
      } else {
        setRole(null);
        setLoading(false);
        localStorage.removeItem('pace_role');
      }
    });
    return () => unsubscribe();
  }, [fetchRole]);

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Role will be fetched by the onAuthStateChanged listener
    return result;
  };

  const register = async (email, password, selectedRole, additionalData) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = result;

    const userData = {
      email,
      role: selectedRole,
      uid: user.uid,
      createdAt: new Date().toISOString(),
      ...additionalData
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    setRole(selectedRole);
    localStorage.setItem('pace_role', selectedRole);
    return selectedRole;
  };

  const logout = () => signOut(auth);
  
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const value = {
    user,
    role,
    loading,
    login,
    register,
    logout,
    resetPassword,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
