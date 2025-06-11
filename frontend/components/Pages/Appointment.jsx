import Calendar from "../Appointment/Calendar.jsx";
import Times from "../Appointment/Times.jsx";
import { useState } from "react";

function Appointment() {
    const [selectedDate, setSelectedDate] = useState(null);
    // Mock available times for demonstration
    const availableTimes = selectedDate ? ["17:00", "18:00", "19:00"] : [];

    // Helper to create a JS Date from selected day/month/year
    const handleDaySelect = (day, month, year) => {
        setSelectedDate(new Date(year, month, day));
    };

    return (
        <div>
            <h1 className="font-bold text-center">Appointment</h1>
            <Calendar onDaySelect={handleDaySelect} />
            <Times date={selectedDate} availableTimes={availableTimes} />
        </div>
    );
}
export default Appointment;