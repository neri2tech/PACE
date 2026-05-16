import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../firebase'; // assumes firebase.js exports config

// Initialize Firebase app (if not already initialized elsewhere)
const firebaseApp = initializeApp(firebaseConfig);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      // role persisted in localStorage for demo purposes
      const stored = localStorage.getItem('role');
      setRole(stored);
    });
    return () => unsub();
  }, [auth]);

  const login = async (email, password, chosenRole) => {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem('role', chosenRole);
    setRole(chosenRole);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('role');
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
