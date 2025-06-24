import Calendar from "../Appointment/Calendar.jsx";
import Times from "../Appointment/Times.jsx";
import { useState, useContext } from "react";
import { UserContext } from "../SideBar.jsx";

function Appointment() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [user] = useContext(UserContext);

    // Helper to create a JS Date from selected day/month/year
    const handleDaySelect = (day, month, year) => {
        setSelectedDate(new Date(year, month, day));
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="font-bold text-2xl text-center mb-2">Book an Appointment</h1>
            <div className="text-center text-gray-700 mb-4">
                Select a date from the calendar below, then choose an available time slot to book your appointment. If you already have an appointment, you can view or delete it here.
            </div>
            <Calendar onDaySelect={handleDaySelect} />
            {user && (
                <Times date={selectedDate} userId={user.uid} />
            )}
        </div>
    );
}
export default Appointment;