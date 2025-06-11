import { useState } from "react";

function Times({ date, availableTimes, onSelect }) {
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointment, setAppointment] = useState(null);

  const handleConfirm = () => {
    if (selectedTime && date) {
      setAppointment({ date, time: selectedTime });
    }
  };

  const handleDelete = () => {
    setAppointment(null);
    setSelectedTime(null);
  };

  if (!date) return null;
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Available Times for {date.toLocaleDateString()}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {availableTimes && availableTimes.length > 0 ? (
          availableTimes.map((time) => (
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
          <span className="text-gray-500">No times available</span>
        )}
      </div>
      {!appointment && selectedTime && (
        <button
          className="mt-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      )}
      {appointment && (
        <div className="mt-6 p-4 bg-white rounded shadow text-center">
          <div className="text-lg font-semibold text-blue-700 mb-2">Appointment</div>
          <div className="mb-2">{appointment.date.toLocaleDateString()} at {appointment.time}</div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={handleDelete}
          >
            Delete Appointment
          </button>
        </div>
      )}
    </div>
  );
}

export default Times;