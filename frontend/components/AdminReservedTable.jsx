import { useEffect, useState } from 'react';

function AdminReservedTable({ axios }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <div>Loading reserved appointments...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!appointments.length) return <div>No reserved appointments found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Customer</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Time</th>
            <th className="px-4 py-2 border">Service</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt, idx) => (
            <tr key={idx} className="even:bg-gray-50">
              <td className="px-4 py-2 border">{appt.customerName || appt.userId || '-'}</td>
              <td className="px-4 py-2 border">{appt.date}</td>
              <td className="px-4 py-2 border">{appt.time}</td>
              <td className="px-4 py-2 border">{appt.service || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminReservedTable;
