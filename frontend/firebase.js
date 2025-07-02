import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBJOSfZ7n1PLPZ2G3tG5t3YQZr8XNM4w9E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sanohaircut.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sanohaircut",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sanohaircut.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "622194661744",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:622194661744:web:5046e6ed5c65126da917b5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1VVDEC2FN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);