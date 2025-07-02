// AdminTools.jsx
// Main admin page for managing appointments, available times, and users.
// Checks if the user is an admin and shows tabbed admin tools if authorized.
// Uses axios for API calls and i18n for translations.

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminToolsTabs from '../Admin/AdminToolsTabs.jsx';
import AdminSetTimes from '../Admin/AdminSetTimes.jsx';
import AdminReservedTable from '../Admin/AdminReservedTable.jsx';
import AdminUsersTable from '../Admin/AdminUsersTable.jsx';

function AdminTools({ user }) {
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(null); // Whether the user is an admin
  const [activeTab, setActiveTab] = useState('times'); // Current active admin tab
  const navigate = useNavigate();

  // Check if the user is an admin on mount or user change
  useEffect(() => {
    if (user && user.uid) {
      axios.get(`http://localhost:5000/api/profile/${user.uid}`)
        .then(res => setIsAdmin(res.data.isAdmin === true))
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Redirect non-admins to home
  if (isAdmin === false) {
    navigate('/');
    return null;
  }
  // Show loading state while checking admin status
  if (isAdmin === null) {
    return <div className="p-4">{t('adminTools.checking')}</div>;
  }

  // Render admin tools tabs and content
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="font-bold text-2xl text-center mb-2">{t('adminTools.title')}</h2>
      <AdminToolsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'times' && (
        <AdminSetTimes user={user} axios={axios} />
      )}
      {activeTab === 'reserved' && (
        <div className="bg-white rounded shadow p-4 mt-4">
          <h3 className="font-bold text-lg mb-2">{t('adminTools.reservedTitle')}</h3>
          <AdminReservedTable axios={axios} />
        </div>
      )}
      {activeTab === 'users' && (
        <div className="bg-white rounded shadow p-4 mt-4">
          <h3 className="font-bold text-lg mb-2">{t('adminTools.usersTitle')}</h3>
          <AdminUsersTable axios={axios} />
        </div>
      )}
    </div>
  );
}

export default AdminTools;
