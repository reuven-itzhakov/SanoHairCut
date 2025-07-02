import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBJOSfZ7n1PLPZ2G3tG5t3YQZr8XNM4w9E",
  authDomain: "sanohaircut.firebaseapp.com",
  projectId: "sanohaircut",
  storageBucket: "sanohaircut.firebasestorage.app",
  messagingSenderId: "622194661744",
  appId: "1:622194661744:web:5046e6ed5c65126da917b5",
  measurementId: "G-1VVDEC2FN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);