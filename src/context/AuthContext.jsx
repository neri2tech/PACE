import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (selectedRole) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', u.uid));
      if (!userDoc.exists()) {
        // Create user with selected role if new
        await setDoc(doc(db, 'users', u.uid), {
          email: u.email,
          role: selectedRole,
          firstName: u.displayName?.split(' ')[0] || '',
          lastName: u.displayName?.split(' ')[1] || '',
          createdAt: new Date().toISOString()
        });
        setRole(selectedRole);
        return selectedRole;
      } else {
        const r = userDoc.data().role;
        setRole(r);
        return r;
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, selectedRole, additionalData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const u = userCredential.user;
      
      await setDoc(doc(db, 'users', u.uid), {
        email,
        role: selectedRole,
        ...additionalData,
        createdAt: new Date().toISOString()
      });
      
      setRole(selectedRole);
      return selectedRole;
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
            console.warn('Role fetch timed out after 12s, defaulting to fallback');
            setLoading(false);
          }
        }, 12000); // Increased to 12s for diagnostic period

        try {
          console.log(`[Auth] Fetching role for UID: ${currentUser.uid}...`);
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log(`[Auth] Role resolved: ${userData.role}`);
            setRole(userData.role);
            localStorage.setItem('role', userData.role);
          } else {
            console.warn(`[Auth] No user document found for ${currentUser.uid}.`);
            const stored = localStorage.getItem('role');
            setRole(stored);
          }
        } catch (error) {
          console.error("[Auth] Firestore fetch error:", error);
          const stored = localStorage.getItem('role');
          if (stored) setRole(stored);
        } finally {
          clearTimeout(roleTimeout);
          setLoading(false);
        }
      } else {
        setRole(null);
        localStorage.removeItem('role');
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const u = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', u.uid));
      if (userDoc.exists()) {
        const r = userDoc.data().role;
        setRole(r);
        return r;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('role');
    return signOut(auth);
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
