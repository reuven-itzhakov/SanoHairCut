import { useState } from "react";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

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
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

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
          {today.toLocaleString('default', { month: 'long' , year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="px-2 py-1 bg-gray-200 rounded">&#8594;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysOfWeek.map((d) => (
          <div key={d} className="font-semibold text-gray-700">{d}</div>
        ))}
        {calendarDays.map((day, idx) => (
          <div key={idx} className={`h-10 flex items-center justify-center rounded ${day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>{day || ""}</div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;