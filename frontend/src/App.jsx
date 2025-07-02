// App.jsx
// Main application component for the barbershop appointment system frontend.
// Handles global user authentication state, language direction (RTL/LTR), and routing.
// Provides user context to the app and manages sidebar open state.
//
// Imports:
// - Header: Top navigation/header bar.
// - HomePage: Landing page component.
// - Appointment: Appointment booking page.
// - Profile: User profile page.
// - AdminTools: Admin dashboard/tools page.
// - React Router: For client-side routing and navigation.
// - Firebase Auth: For authentication state management.
// - UserContext: Context for sharing user state across components.
// - i18n: Internationalization setup for language support.
// - useTranslation: Hook for accessing translation and language info.

import Header from '../components/Header.jsx'
import HomePage from '../components/Pages/HomePage.jsx'
import Appointment from '../components/Pages/Appointment.jsx'
import Profile from '../components/Pages/Profile.jsx'
import AdminTools from '../components/Pages/AdminTools.jsx';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import { auth } from '../firebase.js';
import { UserContext } from '../components/SideBar.jsx';
import '../src/i18n.js'; // Import i18n initialization
import { useTranslation } from 'react-i18next';

function App() {
  // user: Holds the current authenticated user object (or null if not logged in)
  // setUser: Function to update the user state
  const [user, setUser] = useState(null);
  // sidebarOpen: Controls whether the sidebar is open or closed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // navigate: React Router navigation function
  const navigate = useNavigate();
  // i18n: Internationalization object for language info
  const { i18n } = useTranslation();

  useEffect(() => {
    // Listen for authentication state changes (login/logout)
    // Updates user state when auth state changes
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    // Set the HTML document's direction attribute for RTL (Hebrew) or LTR (default)
    if (i18n.language === 'he') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [i18n.language]);

  return (
    // Provide user state and setter to all child components via context
    <>
    <UserContext.Provider value={[ user, setUser ]}>
      <Header isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      {/* Define application routes. Some routes require authentication. */}
      <Routes>
        {/* Home page route, passes sidebar and navigation props */}
        <Route path="/" element={<HomePage setSidebarOpen={setSidebarOpen} navigate={navigate} />} />
        {/* Appointment page, protected route (requires user) */}
        <Route path="/appointment" element={user ? <Appointment /> : <Navigate to="/" />} />
        {/* Profile page, protected route (requires user) */}
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        {/* Admin tools page, protected route (requires user) */}
        <Route path="/admin" element={user ? <AdminTools user={user} /> : <Navigate to="/" />} />
      </Routes>
    </UserContext.Provider>
    </>
  )
}

export default App
