import React, { useContext } from "react";
import { UserContext } from "../SideBar.jsx";

function HomePage({ setSidebarOpen, navigate }) {
    const [user] = useContext(UserContext);

    const handleBookClick = (e) => {
        e.preventDefault();
        if (user) {
            navigate("/appointment");
        } else {
            setSidebarOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-black text-white h-[50vh] flex items-center justify-center">
                <img src="/images/barbershop-hero.png" alt="Barbershop" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Look Sharp. Feel Great.</h1>
                    <p className="text-lg md:text-2xl mb-6">Premium cuts & shaves in the heart of the city</p>
                    <button
                        onClick={handleBookClick}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full shadow-lg transition"
                    >
                        Book Your Appointment
                    </button>
                </div>
            </div>

            {/* About Section */}
            <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <h2 className="text-2xl font-bold mb-2">Welcome to Mano Barbershop</h2>
                <p className="text-gray-700 mb-4">Experience the art of grooming in a modern, friendly atmosphere. Our skilled barbers are passionate about helping you look and feel your best. Whether you need a fresh cut, a sharp beard trim, or a relaxing shave, we’ve got you covered.</p>
            </div>

            {/* Services Section */}
            <div className="bg-white py-10">
                <h2 className="text-xl font-bold text-center mb-6">Our Services</h2>
                <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
                    <div className="bg-gray-100 rounded-lg p-6 w-64 shadow text-center">
                        <img src="/images/haircut.png" alt="Haircut" className="mx-auto mb-2 w-16 h-16" />
                        <h3 className="font-semibold mb-1">Haircut</h3>
                        <p className="text-gray-600 text-sm">Classic, modern, and custom styles for all ages.</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-6 w-64 shadow text-center">
                        <img src="/images/beard.png" alt="Beard Trim" className="mx-auto mb-2 w-16 h-16" />
                        <h3 className="font-semibold mb-1">Beard Trim</h3>
                        <p className="text-gray-600 text-sm">Sharp lines, clean fades, and beard sculpting.</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-6 w-64 shadow text-center">
                        <img src="/images/shave.png" alt="Shave" className="mx-auto mb-2 w-16 h-16" />
                        <h3 className="font-semibold mb-1">Shave</h3>
                        <p className="text-gray-600 text-sm">Hot towel shaves for a smooth, fresh look.</p>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="max-w-5xl mx-auto py-12 px-4">
                <h2 className="text-xl font-bold text-center mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <img src="/images/gallery1.png" alt="Gallery 1" className="rounded shadow object-cover w-full h-40" />
                    <img src="/images/gallery2.png" alt="Gallery 2" className="rounded shadow object-cover w-full h-40" />
                    <img src="/images/gallery3.png" alt="Gallery 3" className="rounded shadow object-cover w-full h-40" />
                    <img src="/images/gallery4.png" alt="Gallery 4" className="rounded shadow object-cover w-full h-40" />
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="bg-gray-100 py-10">
                <h2 className="text-xl font-bold text-center mb-6">What Our Customers Say</h2>
                <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg p-6 w-72 shadow text-center">
                        <p className="italic mb-2">“Best haircut I’ve ever had! The team is super friendly and professional.”</p>
                        <div className="font-semibold">— Daniel S.</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 w-72 shadow text-center">
                        <p className="italic mb-2">“Great atmosphere and amazing beard trims. Highly recommend!”</p>
                        <div className="font-semibold">— Amir K.</div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <h2 className="text-xl font-bold mb-2">Contact & Location</h2>
                <p className="mb-2">Lotem Street, Afula</p>
                <p className="mb-2">Phone: <a href="tel:+972501234567" className="text-blue-600 underline">054-8343-989</a></p>
                <div className="mt-4">
                    <iframe
                        title="Barbershop Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2376.3276798275065!2d35.28308401349291!3d32.61591373701139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151c53c7be9edd7b%3A0x59d44bdc468df1e9!2sLotem%20St%2026%2C%20Afula!5e0!3m2!1sen!2sil!4v1750775442826!5m2!1sen!2sil" // Replace with your real map embed link
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                <div className="flex justify-center gap-4 mt-4 items-center">
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-600 text-2xl flex items-center gap-2">
                        <img src="https://www.svgrepo.com/show/452231/instagram.svg" alt="Instagram" className="w-7 h-7" />
                        <span className="hidden sm:inline">Instagram</span>
                    </a>
                    <span className="text-gray-400 text-2xl select-none">|</span>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 text-2xl flex items-center gap-2">
                        <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" className="w-7 h-7" />
                        <span className="hidden sm:inline">Facebook</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default HomePage;