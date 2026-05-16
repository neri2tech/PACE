import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [loading, setLoading] = useState(true);

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const loginWithGoogle = async (defaultRole = 'teacher') => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      
      // Check if user already has a role
      const userDoc = await getDoc(doc(db, 'users', u.uid));
      
      if (userDoc.exists()) {
        const existingRole = userDoc.data().role;
        setRole(existingRole);
        localStorage.setItem('role', existingRole);
        return existingRole;
      } else {
        // New user from Google - assign default role (or we can prompt later)
        await setDoc(doc(db, 'users', u.uid), {
          email: u.email,
          name: u.displayName,
          role: defaultRole,
          createdAt: new Date().toISOString()
        });
        setRole(defaultRole);
        localStorage.setItem('role', defaultRole);
        return defaultRole;
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Set a timeout to prevent infinite white screen if Firestore hangs
        const roleTimeout = setTimeout(() => {
          if (loading) {
            console.warn('Role fetch timed out, defaulting to fallback');
            setLoading(false);
          }
        }, 8000); // 8 second fail-safe

        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role);
            localStorage.setItem('role', userData.role);
          } else {
            const stored = localStorage.getItem('role');
            setRole(stored);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        } finally {
          clearTimeout(roleTimeout);
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth state error (using fallback):", err);
        // On error, try to keep the existing role from localStorage if available
        const stored = localStorage.getItem('role');
        if (stored) setRole(stored);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [auth]);

  const login = async (email, password) => {
    try {
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
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
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
    <AuthContext.Provider value={{ user, role, loading, login, register, logout, loginWithGoogle, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
