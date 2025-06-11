import { useState } from "react";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

function Calendar({ onDaySelect }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
      <div className="flex justify-between items-center mb-2">
        <button onClick={prevMonth} className="px-2 py-1 bg-gray-200 rounded">&#8592;</button>
        <h2 className="text-xl font-bold">
          {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="px-2 py-1 bg-gray-200 rounded">&#8594;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map((d) => (
          <div key={d} className="font-semibold text-gray-700">{d}</div>
        ))}
        {calendarDays.map((day, idx) => {
          const isEmpty = day === null;
          return (
            <div
              key={idx}
              className={`h-10 flex items-center justify-center rounded transition-colors duration-150
                ${isEmpty ? 'bg-gray-200 cursor-default' : ''}
                ${!isEmpty && selectedDay === day ? 'bg-blue-500 text-white' : ''}
                ${!isEmpty && isSelectable(day) ? 'cursor-pointer text-gray-900' : ''}
                ${!isEmpty && !isSelectable(day) ? 'bg-gray-200 text-gray-400 cursor-default' : ''}`}
              onClick={() => {
                if (!isEmpty && isSelectable(day)) {
                  setSelectedDay(day);
                  onDaySelect && onDaySelect(day, currentMonth, currentYear);
                }
              }}
              style={{ opacity: day ? 1 : 0.3 }}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
      {selectedDay && (
        <div className="mt-4 text-center text-lg font-semibold text-blue-700">
          Selected: {selectedDay}/{currentMonth + 1}/{currentYear}
        </div>
      )}
    </div>
  );
}

export default Calendar;