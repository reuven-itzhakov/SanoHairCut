// AdminSetTimes.jsx
// Admin tool for setting available appointment times for a selected date.
// Allows admin to pick a date, select/deselect time slots, and submit to backend.
// Uses dayjs for date/time handling and a custom Calendar component for date picking.

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Calendar from '../Appointment/Calendar.jsx';
import { useTranslation } from 'react-i18next';

const ISRAEL_TZ = "Asia/Jerusalem";

// Generate all possible time slots for a day (default: 08:00-20:00, every 30 min)
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
const now = dayjs(); // Current time for filtering out past slots

function AdminSetTimes({ user, axios, onResult }) {
  const { t } = useTranslation();
  const [date, setDate] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Fetch available times for the selected date from backend
  useEffect(() => {
    if (!date) return;
    axios.get(`http://localhost:5000/api/available-times/${dayjs(date).tz(ISRAEL_TZ).format('YYYY-MM-DD')}`)
      .then(res => {
        setSelectedTimes(res.data.times || []);
      })
      .catch(() => {
        setSelectedTimes([]);
      });
  }, [date, axios]);

  // Toggle a time slot selection
  const handleTimeClick = (time) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  // Filter out times that are in the past for today
  const filteredTimes = date === dayjs().format('YYYY-MM-DD')
    ? ALL_TIMES.filter(time => dayjs(`${date}T${time}`) > now)
    : ALL_TIMES;

  // Select all available times for the day
  const handleSelectAll = () => setSelectedTimes(filteredTimes);
  // Clear all selected times
  const handleClearAll = () => setSelectedTimes([]);

  // Submit selected times to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin/available-times', {
        uid: user.uid,
        date,
        times: selectedTimes.sort()
      });
      setResult('Success! Times updated.');
      onResult && onResult('Success! Times updated.');
    } catch (err) {
      setResult('Error: ' + (err.response?.data?.error || err.message));
      onResult && onResult('Error: ' + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  // Handle date selection from calendar
  const handleCalendarDaySelect = (day, month, year) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setDate(dateStr);
  };

  return (
    <div>
      {/* Instructions and calendar for picking date */}
      <div className="text-center text-gray-700 mb-4">
        <div className="mb-2">
          {t('adminSetTimes.instructions')}
        </div>
        <label className="block mb-1">{t('adminSetTimes.pickDate')}</label>
        <Calendar onDaySelect={handleCalendarDaySelect} adminMode={true} /><br />
        {date && (
          <div className="mt-2 text-blue-700">
            {t('adminSetTimes.chooseTimes')}
          </div>
        )}
      </div>
      {date && (
        <form onSubmit={handleSubmit} className="mb-2">
          <input type="hidden" value={date} readOnly />
          <div className="mb-2">
            <label>{t('adminSetTimes.times')}</label>
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {filteredTimes.map(time => (
                // Render a button for each time slot
                <button
                  type="button"
                  key={time}
                  className={`px-2 py-1 rounded border ${selectedTimes.includes(time) ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} ${date === dayjs().format('YYYY-MM-DD') && dayjs(`${date}T${time}`) <= now ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleTimeClick(time)}
                  disabled={date === dayjs().format('YYYY-MM-DD') && dayjs(`${date}T${time}`) <= now}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={handleSelectAll}>{t('adminSetTimes.selectAll')}</button>
              <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={handleClearAll}>{t('adminSetTimes.clearAll')}</button>
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? t('adminSetTimes.saving') : t('adminSetTimes.setTimes')}</button>
          {result && <div className="mt-2 text-green-700">{result}</div>}
        </form>
      )}
    </div>
  );
}

export default AdminSetTimes;
