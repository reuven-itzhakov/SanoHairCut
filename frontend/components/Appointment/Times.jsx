// Times.jsx
// Component for displaying and selecting available appointment times for a given date.
// Handles fetching available times, reserving, and deleting appointments.
// Uses dayjs for date/time handling and i18n for translations.

import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useTranslation } from 'react-i18next';

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);
const ISRAEL_TZ = "Asia/Jerusalem";

function Times({ date, onSelect, userId }) {
  const { t } = useTranslation();
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Format JS Date to YYYY-MM-DD string
  function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Format date to Israel timezone (YYYY-MM-DD)
  function formatDateIsrael(date) {
    return dayjs(date).tz(ISRAEL_TZ).format("YYYY-MM-DD");
  }

  // Fetch user's appointment on mount or userId change
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(`http://localhost:5000/api/appointments/${userId}`)
      .then(res => {
        if (res.data.appointment) {
          setAppointment({
            date: new Date(res.data.appointment.date),
            time: res.data.appointment.time
          });
        } else {
          setAppointment(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch appointment");
        setLoading(false);
      });
  }, [userId]);

  // Fetch available times for the selected date
  useEffect(() => {
    if (!date) return;
    setLoading(true);
    axios.get(`http://localhost:5000/api/available-times/${formatDateIsrael(date)}`)
      .then(res => {
        setTimes(res.data.times || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch available times");
        setLoading(false);
      });
  }, [date, appointment]);

  // Reserve an appointment
  const handleConfirm = () => {
    if (selectedTime && date && userId) {
      setLoading(true);
      axios.post("http://localhost:5000/api/appointments", {
        userId,
        date: formatDateIsrael(date),
        time: selectedTime
      })
        .then(() => {
          setAppointment({ date, time: selectedTime });
          setLoading(false);
        })
        .catch(err => {
          setError(err.response?.data?.error || "Failed to reserve appointment");
          setLoading(false);
        });
    }
  };

  // Delete an appointment
  const handleDelete = () => {
    if (!userId) return;
    setLoading(true);
    axios.delete(`http://localhost:5000/api/appointments/${userId}`)
      .then(() => {
        setAppointment(null);
        setSelectedTime(null);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to delete appointment");
        setLoading(false);
      });
  };

  // Show appointment info even if no date is selected
  if (!date && appointment) {
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded shadow">
        <div className="mt-4 p-4 bg-white rounded shadow text-center">
          <div className="text-lg font-semibold text-blue-700 mb-2">{t('times.appointmentTitle')}</div>
          <div className="mb-2">{dayjs(appointment.date).format('DD/MM/YYYY')} {t('times.at')} {appointment.time}</div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={handleDelete}
            disabled={loading}
          >
            {t('times.deleteButton')}
          </button>
        </div>
      </div>
    );
  }
  if (!date) return null;
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded shadow">
      {/* Show available times for the selected date */}
      <h2 className="text-lg font-bold mb-2">{t('times.availableTitle', { date: dayjs(date).format('DD/MM/YYYY') })}</h2>
      {error && <div className="text-red-600 mb-2">{t(error)}</div>}
      {loading && <div className="text-gray-500 mb-2">{t('times.loading')}</div>}
      <div className="flex flex-wrap gap-2 mb-4">
        {times && times.length > 0 ? (
          times.map((time) => (
            // Render a button for each available time slot
            <button
              key={time}
              className={`px-4 py-2 rounded transition-colors ${selectedTime === time ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'} ${appointment ? 'opacity-50 cursor-default' : ''}`}
              onClick={() => {
                if (!appointment) {
                  setSelectedTime(time);
                  onSelect && onSelect(time);
                }
              }}
              disabled={!!appointment}
            >
              {time}
            </button>
          ))
        ) : (
          <span className="text-gray-500">{t('times.noTimes')}</span>
        )}
      </div>
      {/* Confirm button for reserving appointment */}
      {!appointment && selectedTime && (
        <button
          className="mt-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={handleConfirm}
          disabled={loading}
        >
          {t('times.confirmButton')}
        </button>
      )}
      {/* Show current appointment info and delete button */}
      {appointment && (
        <div className="mt-6 p-4 bg-white rounded shadow text-center">
          <div className="text-lg font-semibold text-blue-700 mb-2">{t('times.appointmentTitle')}</div>
          <div className="mb-2">{dayjs(appointment.date).format('DD/MM/YYYY')} {t('times.at')} {appointment.time}</div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={handleDelete}
            disabled={loading}
          >
            {t('times.deleteButton')}
          </button>
        </div>
      )}
    </div>
  );
}

export default Times;