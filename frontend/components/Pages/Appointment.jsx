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
        <div>
            <h1 className="font-bold text-center">Appointment</h1>
            <Calendar onDaySelect={handleDaySelect} />
            {user && (
                <Times date={selectedDate} userId={user.uid} />
            )}
        </div>
    );
}
export default Appointment;