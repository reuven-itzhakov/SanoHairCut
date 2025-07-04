// Header.jsx
// Main site header with branding and sidebar toggle.
// Displays the site title and a user/profile icon to open the sidebar.
// Uses react-router for navigation.

import SideBar from "./SideBar.jsx"
import { useNavigate } from "react-router-dom";

function Header({ isOpen, setIsOpen }) {
    const navigate = useNavigate();
    return (
        <>
        {/* Header bar with site title and user icon */}
        <header dir="ltr" className="select-none flex items-center justify-between p-4 bg-gray-900 text-white">
            <h1
                className="cursor-pointer text-4xl font-bold hover:opacity-60 duration-300"
                onClick={() => navigate("/")}
            >
                sano.
            </h1>
            {/* User/profile icon to open sidebar */}
            <svg onClick={() => setIsOpen(true)} className="cursor-pointer hover:opacity-60 duration-300" width="40px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"> {/*https://www.svgrepo.com/svg/369033/user-circle*/}
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                <path d="M3 13V13.5H4V13H3ZM11 13V13.5H12V13H11ZM4 13V12.4999H3V13H4ZM6.5 10H8.5V9H6.5V10ZM11 12.4999V13H12V12.4999H11ZM8.5 10C9.88074 10 11 11.1192 11 12.4999H12C12 10.5668 10.433 9 8.5 9V10ZM4 12.4999C4 11.1192 5.11926 10 6.5 10V9C4.56703 9 3 10.5668 3 12.4999H4ZM7.5 3C6.11929 3 5 4.11929 5 5.5H6C6 4.67157 6.67157 4 7.5 4V3ZM10 5.5C10 4.11929 8.88071 3 7.5 3V4C8.32843 4 9 4.67157 9 5.5H10ZM7.5 8C8.88071 8 10 6.88071 10 5.5H9C9 6.32843 8.32843 7 7.5 7V8ZM7.5 7C6.67157 7 6 6.32843 6 5.5H5C5 6.88071 6.11929 8 7.5 8V7ZM7.5 14C3.91015 14 1 11.0899 1 7.5H0C0 11.6421 3.35786 15 7.5 15V14ZM14 7.5C14 11.0899 11.0899 14 7.5 14V15C11.6421 15 15 11.6421 15 7.5H14ZM7.5 1C11.0899 1 14 3.91015 14 7.5H15C15 3.35786 11.6421 0 7.5 0V1ZM7.5 0C3.35786 0 0 3.35786 0 7.5H1C1 3.91015 3.91015 1 7.5 1V0Z" fill="#ffffff"></path>
                </g>
            </svg>
        </header>
        {/* Sidebar component */}
        <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
}

export default Header;
