/**
 * Firebase Configuration Service
 * 
 * Initializes Firebase app and Firestore database.
 * Configuration is loaded from environment variables.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate configuration
const isConfigValid = () => {
  return firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId;
};

if (!isConfigValid()) {
  console.warn('Firebase configuration is incomplete. Please check your environment variables.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
export default db;
