// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDoVI_cHd0RDpAYIbXO4J7Ul0GiZHAbnW8",
  authDomain: "pace-41d42.firebaseapp.com",
  projectId: "pace-41d42",
  storageBucket: "pace-41d42.firebasestorage.app",
  messagingSenderId: "986601232275",
  appId: "1:986601232275:web:071a85b827427ee146ba66",
  measurementId: "G-XXDX2C06TX"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

// Initialize Firestore with settings to bypass connection blocks
export const db = initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: true,
  useFetchStreams: false
});

export const storage = getStorage(firebaseApp);
