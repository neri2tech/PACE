import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Fetch role from Firestore
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role);
          localStorage.setItem('role', userData.role);
        } else {
          // Fallback if not in Firestore
          const stored = localStorage.getItem('role');
          setRole(stored);
        }
      } else {
        setRole(null);
        localStorage.removeItem('role');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [auth]);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const u = userCredential.user;
    const userDoc = await getDoc(doc(db, 'users', u.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setRole(userData.role);
      localStorage.setItem('role', userData.role);
      return userData.role;
    }
    return null;
  };

  const register = async (email, password, chosenRole, additionalData = {}) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const u = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', u.uid), {
      email,
      role: chosenRole,
      createdAt: new Date().toISOString(),
      ...additionalData
    });
    
    setRole(chosenRole);
    localStorage.setItem('role', chosenRole);
    return chosenRole;
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('role');
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
