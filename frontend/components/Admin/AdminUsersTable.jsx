import { useEffect, useState } from 'react';

function AdminUsersTable({ axios }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingIdx, setEditingIdx] = useState(null);
  const [editUser, setEditUser] = useState({ name: '', email: '', isAdmin: false });

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/users')
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

  const handleEdit = (idx, user) => {
    setEditingIdx(idx);
    setEditUser({
      name: user.displayName || '',
      email: user.email || '',
      isAdmin: !!user.isAdmin
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSave = async (user) => {
    try {
      await axios.post(`http://localhost:5000/api/users/${user.uid}/update`, {
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

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!users.length) return <div>No users found.</div>;

  return (
    <div className="overflow-x-auto">
      <div className="mb-3 text-gray-700 text-sm">
        This table shows all users registered in the system, including their UID, name, email, and admin status. You can edit user info and admin rights.
      </div>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">UID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Admin</th>
            <th className="px-4 py-2 border">Actions</th>
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
                  user.isAdmin ? 'Yes' : 'No'
                )}
              </td>
              <td className="px-4 py-2 border text-center">
                {editingIdx === idx ? (
                  <>
                    <button onClick={() => handleEditSave(user)} className="text-green-600 hover:underline mr-2">Save</button>
                    <button onClick={() => setEditingIdx(null)} className="text-gray-600 hover:underline">Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(idx, user)} className="text-blue-600 hover:underline">Edit</button>
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
