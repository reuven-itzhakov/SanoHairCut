import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

function AdminReservedTable({ axios }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [editingIdx, setEditingIdx] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/appointments')
      .then(res => {
        setAppointments(res.data.appointments || []);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, [axios]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${userId}`);
      setAppointments((prev) => prev.filter(appt => appt.userId !== userId));
    } catch (err) {
      alert('Failed to delete appointment.');
    }
  };

  const handleDateEdit = (idx, currentDate, currentTime) => {
    setEditingIdx(idx);
    setNewDate(currentDate);
    setNewTime(currentTime);
  };

  const handleDateChange = (e) => {
    setNewDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setNewTime(e.target.value);
  };

  const handleDateSave = async (appt) => {
    try {
      await axios.post(`http://localhost:5000/api/appointments/${appt.userId}/change-date`, {
        date: newDate,
        time: newTime
      });
      setAppointments((prev) => prev.map((a, i) => i === editingIdx ? { ...a, date: newDate, time: newTime } : a));
      setEditingIdx(null);
    } catch (err) {
      alert('Failed to update date/time.');
    }
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    if (sortConfig.key === 'date') {
      aValue = dayjs(aValue);
      bValue = dayjs(bValue);
      if (!aValue.isValid() || !bValue.isValid()) return 0;
      if (aValue.isBefore(bValue)) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue.isAfter(bValue)) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  if (loading) return <div>Loading reserved appointments...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!appointments.length) return <div>No reserved appointments found.</div>;

  return (
    <div className="overflow-x-auto">
      <div className="mb-3 text-gray-700 text-sm">
        This table shows all reserved appointments. You can sort by any column by clicking the ⇅ button next to the column name. Use this view to quickly find, review, or manage customer bookings. Click the delete button to remove an appointment. Click the date or time to edit them.
      </div>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Name <button onClick={() => handleSort('customerName')} className="ml-1 text-xs">⇅</button></th>
            <th className="px-4 py-2 border">Email <button onClick={() => handleSort('customerEmail')} className="ml-1 text-xs">⇅</button></th>
            <th className="px-4 py-2 border">Day <button onClick={() => handleSort('dayName')} className="ml-1 text-xs">⇅</button></th>
            <th className="px-4 py-2 border">Date <button onClick={() => handleSort('date')} className="ml-1 text-xs">⇅</button></th>
            <th className="px-4 py-2 border">Time <button onClick={() => handleSort('time')} className="ml-1 text-xs">⇅</button></th>
            <th className="px-4 py-2 border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {sortedAppointments.map((appt, idx) => {
            const dateObj = dayjs(appt.date);
            const dayName = dateObj.isValid() ? dateObj.format('dddd') : '-';
            return (
              <tr key={idx} className="even:bg-gray-50">
                <td className="px-4 py-2 border">{appt.customerName || '-'}</td>
                <td className="px-4 py-2 border">{appt.customerEmail || '-'}</td>
                <td className="px-4 py-2 border">{dayName}</td>
                <td className="px-4 py-2 border">
                  {editingIdx === idx ? (
                    <input
                      type="date"
                      value={newDate}
                      onChange={handleDateChange}
                      className="border px-1 py-0.5 rounded"
                    />
                  ) : (
                    <span className="cursor-pointer text-blue-700 hover:underline" onClick={() => handleDateEdit(idx, dateObj.isValid() ? dateObj.format('YYYY-MM-DD') : appt.date, appt.time)}>
                      {dateObj.isValid() ? dateObj.format('DD/MM/YYYY') : appt.date}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {editingIdx === idx ? (
                    <input
                      type="time"
                      value={newTime}
                      onChange={handleTimeChange}
                      className="border px-1 py-0.5 rounded"
                    />
                  ) : (
                    <span className="cursor-pointer text-blue-700 hover:underline" onClick={() => handleDateEdit(idx, dateObj.isValid() ? dateObj.format('YYYY-MM-DD') : appt.date, appt.time)}>
                      {appt.time}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 border text-center">
                  {editingIdx === idx ? (
                    <>
                      <button onClick={() => handleDateSave(appt)} className="text-green-600 hover:underline mr-2">Save</button>
                      <button onClick={() => setEditingIdx(null)} className="text-gray-600 hover:underline">Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleDelete(appt.userId)} className="text-red-600 hover:underline">Delete</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminReservedTable;
