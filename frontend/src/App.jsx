import Header from '../components/Header.jsx'
import HomePage from '../components/Pages/HomePage.jsx'
import Appointment from '../components/Pages/Appointment.jsx'
import Settings from '../components/Pages/Settings.jsx'
import Profile from '../components/Pages/Profile.jsx'
import AdminTools from '../components/Pages/AdminTools.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import { auth } from '../firebase.js';
import { UserContext } from '../components/SideBar.jsx';

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return (
    <>
    <UserContext.Provider value={[ user, setUser ]}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/appointment" element={user ? <Appointment /> : <Navigate to="/" />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
        <Route path="/admin" element={user ? <AdminTools user={user} /> : <Navigate to="/" />} />
      </Routes>
    </UserContext.Provider>
    </>
  )
}

export default App
