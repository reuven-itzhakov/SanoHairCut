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
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Set dir attribute on <html> for RTL/LTR support
    if (i18n.language === 'he') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [i18n.language]);

  return (
    <>
    <UserContext.Provider value={[ user, setUser ]}>
      <Header isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <Routes>
        <Route path="/" element={<HomePage setSidebarOpen={setSidebarOpen} navigate={navigate} />} />
        <Route path="/appointment" element={user ? <Appointment /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        <Route path="/admin" element={user ? <AdminTools user={user} /> : <Navigate to="/" />} />
      </Routes>
    </UserContext.Provider>
    </>
  )
}

export default App
