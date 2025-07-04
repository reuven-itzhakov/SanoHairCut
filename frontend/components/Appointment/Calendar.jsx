// Calendar.jsx
// Custom calendar component for picking a date.
// Used in admin and appointment flows for date selection.
// Calls onDaySelect(day, month, year) when a day is selected.

import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../../src/config.js';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

function Calendar({ onDaySelect, adminMode = false }) {
  const { t, i18n } = useTranslation();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [daysWithTimes, setDaysWithTimes] = useState({});
  const [loadingDays, setLoadingDays] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);
  const daysOfWeek = i18n.language === 'he'
    ? [t('calendar.days.su'), t('calendar.days.mo'), t('calendar.days.tu'), t('calendar.days.we'), t('calendar.days.th'), t('calendar.days.fr'), t('calendar.days.sa')]
    : [t('calendar.days.su'), t('calendar.days.mo'), t('calendar.days.tu'), t('calendar.days.we'), t('calendar.days.th'), t('calendar.days.fr'), t('calendar.days.sa')];

  // Fetch which days in the current month have available times
  useEffect(() => {
    async function fetchDaysWithTimes() {
      setLoadingDays(true);
      const days = {};
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
          days[day] = false; // before today, always grey
          continue;
        }
        if (adminMode) {
          days[day] = true; // In admin mode, all future dates are selectable
          continue;
        }
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;
        try {
          const res = await axios.get(`${API_BASE_URL}/api/available-times?date=${dateStr}`);
          days[day] = (res.data.times && res.data.times.length > 0);
        } catch {
          days[day] = false;
        }
      }
      setDaysWithTimes(days);
      setLoadingDays(false);
    }
    fetchDaysWithTimes();
    setSelectedDay(null);
  }, [currentMonth, currentYear, adminMode]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  // Calculate min and max selectable dates
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 13); // 14 days including today

  // Helper to check if a day is selectable
  function isSelectable(day) {
    if (!day) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date >= minDate && date <= maxDate;
  }

  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null); // Empty cells for previous month
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      {/* Month navigation */}
      <div dir="ltr" className="flex justify-between items-center mb-2">
        <button onClick={prevMonth} className="px-2 py-1 bg-gray-200 rounded select-none" style={{ userSelect: 'none' }}>&#8592;</button>
        <h2 className="text-xl font-bold select-none" style={{ userSelect: 'none' }}>
          {new Date(currentYear, currentMonth).toLocaleString(i18n.language === 'he' ? 'he' : 'en', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="px-2 py-1 bg-gray-200 rounded select-none" style={{ userSelect: 'none' }}>&#8594;</button>
      </div>
      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map((d, i) => (
          <div key={i} className="font-semibold text-gray-700 select-none" style={{ userSelect: 'none' }}>{d}</div>
        ))}
      </div>
      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {loadingDays ? (
          <div className="col-span-7 text-center py-8 text-gray-500">{t('calendar.loading')}</div>
        ) : (
          calendarDays.map((day, idx) => {
            const isEmpty = day === null;
            const isBeforeToday = day !== null && new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const hasTimes = day !== null && daysWithTimes[day];
            const selectable = adminMode ? (!isEmpty && !isBeforeToday) : (!isEmpty && !isBeforeToday && hasTimes);
            return (
              <div
                key={idx}
                className={`h-10 flex items-center justify-center rounded transition-colors duration-150
                  ${isEmpty ? 'bg-gray-200 cursor-default' : ''}
                  ${!isEmpty && selectedDay === day ? 'bg-blue-500 text-white' : ''}
                  ${selectable ? 'cursor-pointer text-gray-900' : ''}
                  ${!selectable && !isEmpty ? 'bg-gray-200 text-gray-400 cursor-default' : ''} select-none`}
                style={{ opacity: day ? 1 : 0.3, userSelect: 'none' }}
                onClick={() => {
                  if (selectable) {
                    setSelectedDay(day);
                    onDaySelect && onDaySelect(day, currentMonth, currentYear);
                  }
                }}
              >
                {day || ""}
              </div>
            );
          })
        )}
      </div>
      {/* Selected day info */}
      {selectedDay && (
        <div className="mt-4 text-center text-lg font-semibold text-blue-700">
          {t('calendar.selected')}: {selectedDay}/{currentMonth + 1}/{currentYear}
        </div>
      )}
    </div>
  );
}

export default Calendar;