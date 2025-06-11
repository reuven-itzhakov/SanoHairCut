import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Calendar from '../Appointment/Calendar.jsx';

function generateTimeSlots(start = '08:00', end = '20:00', interval = 30) {
  const slots = [];
  let current = dayjs(`2020-01-01T${start}`);
  const last = dayjs(`2020-01-01T${end}`);
  while (current <= last) {
    slots.push(current.format('HH:mm'));
    current = current.add(interval, 'minute');
  }
  return slots;
}

const ALL_TIMES = generateTimeSlots();
const now = dayjs();

function AdminTools({ user }) {
  const [date, setDate] = useState('');
  const [times, setTimes] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [calendarDate, setCalendarDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.uid) {
      axios.get(`http://localhost:5000/api/profile/${user.uid}`)
        .then(res => setIsAdmin(res.data.isAdmin === true))
        .catch(() => setIsAdmin(false));
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  if (isAdmin === false) {
    navigate('/');
    return null;
  }
  if (isAdmin === null) {
    return <div className="p-4">Checking admin status...</div>;
  }

  const handleTimeClick = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  // Filter out times that are in the past for today
  const filteredTimes = date === dayjs().format('YYYY-MM-DD')
    ? ALL_TIMES.filter(time => dayjs(`${date}T${time}`) > now)
    : ALL_TIMES;

  const handleSelectAll = () => setSelectedTimes(filteredTimes);
  const handleClearAll = () => setSelectedTimes([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/admin/available-times', {
        uid: user.uid,
        date,
        times: selectedTimes.sort()
      });
      setResult('Success! Times updated.');
    } catch (err) {
      setResult('Error: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  // When a day is selected in the calendar, update the date field
  const handleCalendarDaySelect = (day, month, year) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setDate(dateStr);
  };

  return (
    <div className="p-4">
      <h2 className="font-bold mb-2">Admin: Add Available Times</h2>
      <div className="mb-4">
        <label className="block mb-1">Pick a date:</label>
        <Calendar onDaySelect={handleCalendarDaySelect} adminMode={true} />
        {date && <div className="mt-2 text-blue-700">Selected date: {date}</div>}
      </div>
      <form onSubmit={handleSubmit} className="mb-2">
        {/* Hide the manual date input, use calendar instead */}
        <input type="hidden" value={date} readOnly />
        <div className="mb-2">
          <label>Times:</label>
          <div className="flex flex-wrap gap-2 mt-2 mb-2">
            {filteredTimes.map(time => (
              <button
                type="button"
                key={time}
                className={`px-2 py-1 rounded border ${selectedTimes.includes(time) ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} ${date === dayjs().format('YYYY-MM-DD') && dayjs(`${date}T${time}`) <= now ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (!(date === dayjs().format('YYYY-MM-DD') && dayjs(`${date}T${time}`) <= now)) {
                    handleTimeClick(time);
                  }
                }}
                disabled={date === dayjs().format('YYYY-MM-DD') && dayjs(`${date}T${time}`) <= now}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mb-2">
            <button type="button" className="text-sm underline" onClick={handleSelectAll}>Select All</button>
            <button type="button" className="text-sm underline" onClick={handleClearAll}>Clear All</button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedTimes.map(time => (
              <span key={time} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1 mb-1">
                {time}
                <button type="button" className="ml-1 text-red-500" onClick={() => handleTimeClick(time)}>&times;</button>
              </span>
            ))}
          </div>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded" disabled={loading || !selectedTimes.length || !date}>{loading ? 'Saving...' : 'Add Times'}</button>
      </form>
      {result && <div className="mt-2">{result}</div>}
    </div>
  );
}

export default AdminTools;
