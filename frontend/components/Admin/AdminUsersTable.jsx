// AdminUsersTable.jsx
// Admin table for viewing and editing user accounts.
// Allows admin to edit user name, email, and admin status.
// Uses axios for API calls and i18n for translations.

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config.js';

function AdminUsersTable() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]); // List of users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error message
  const [editingIdx, setEditingIdx] = useState(null); // Index of user being edited
  const [editUser, setEditUser] = useState({ name: '', email: '', isAdmin: false }); // Edit form state

  // Fetch all users on mount
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/api/users`)
      .then(res => {
        setUsers(res.data.users || []);
        setError('');
      })
      .catch(err => {
        setError('Failed to load users');
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [axios]);

  // Start editing a user row
  const handleEdit = (idx, user) => {
    setEditingIdx(idx);
    setEditUser({
      name: user.displayName || '',
      email: user.email || '',
      isAdmin: !!user.isAdmin
    });
  };

  // Handle input changes for editing
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Save edited user info
  const handleEditSave = async (user) => {
    try {
      await axios.post(`${API_BASE_URL}/api/users?uid=${user.uid}&action=update`, {
        name: editUser.name,
        email: editUser.email,
        isAdmin: editUser.isAdmin
      });
      setUsers(prev => prev.map((u, i) => i === editingIdx ? {
        ...u,
        displayName: editUser.name,
        email: editUser.email,
        isAdmin: editUser.isAdmin
      } : u));
      setEditingIdx(null);
    } catch (err) {
      alert('Failed to update user.');
    }
  };

  // Render loading, error, or the users table
  if (loading) return <div>{t('adminUsersTable.loading')}</div>;
  if (error) return <div className="text-red-600">{t('adminUsersTable.error')}</div>;
  if (!users.length) return <div>{t('adminUsersTable.noUsers')}</div>;

  return (
    <div className="overflow-x-auto">
      {/* Instructions for admin */}
      <div className="mb-3 text-gray-700 text-sm">
        {t('adminUsersTable.instructions')}
      </div>
      <table dir="ltr" className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">UID</th>
            <th className="px-4 py-2 border">{t('adminUsersTable.name')}</th>
            <th className="px-4 py-2 border">{t('adminUsersTable.email')}</th>
            <th className="px-4 py-2 border">{t('adminUsersTable.admin')}</th>
            <th className="px-4 py-2 border">{t('adminUsersTable.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx} className="even:bg-gray-50">
              <td className="px-4 py-2 border">{user.uid}</td>
              <td className="px-4 py-2 border">
                {editingIdx === idx ? (
                  <input
                    type="text"
                    name="name"
                    value={editUser.name}
                    onChange={handleEditChange}
                    className="border px-1 py-0.5 rounded w-32"
                  />
                ) : (
                  user.displayName || '-'
                )}
              </td>
              <td className="px-4 py-2 border">
                {editingIdx === idx ? (
                  <input
                    type="email"
                    name="email"
                    value={editUser.email}
                    onChange={handleEditChange}
                    className="border px-1 py-0.5 rounded w-40"
                  />
                ) : (
                  user.email || '-'
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                {editingIdx === idx ? (
                  <input
                    type="checkbox"
                    name="isAdmin"
                    checked={editUser.isAdmin}
                    onChange={handleEditChange}
                  />
                ) : (
                  user.isAdmin ? t('adminUsersTable.yes') : t('adminUsersTable.no')
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                {editingIdx === idx ? (
                  <>
                    <button onClick={() => handleEditSave(user)} className="text-green-600 hover:underline mr-2">{t('adminUsersTable.save')}</button>
                    <button onClick={() => setEditingIdx(null)} className="text-gray-600 hover:underline">{t('adminUsersTable.cancel')}</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(idx, user)} className="text-blue-600 hover:underline">{t('adminUsersTable.edit')}</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsersTable;
