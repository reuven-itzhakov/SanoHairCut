// HomePage.jsx
// Main landing page for the barbershop appointment system.
// Shows branding, hero image, and navigation to booking or admin tools.
// Uses i18n for translations.

import React, { useContext } from "react";
import { UserContext } from "../SideBar.jsx";
import { useTranslation } from 'react-i18next';

function HomePage({ setSidebarOpen, navigate }) {
    const { t } = useTranslation();
    const [user] = useContext(UserContext);

    // Handle click on book button
    const handleBookClick = (e) => {
        e.preventDefault();
        if (user) {
            navigate("/appointment"); // Navigate to appointment page if user is logged in
        } else {
            setSidebarOpen(true); // Open sidebar for login if user is not logged in
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-black text-white h-[50vh] flex items-center justify-center">
                <img src="/images/barbershop-hero.png" alt={t('home.hero.imgAlt')} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">{t('home.hero.title')}</h1>
                    <p className="text-lg md:text-2xl mb-6">{t('home.hero.subtitle')}</p>
                    <button
                        onClick={handleBookClick}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full shadow-lg transition"
                    >
                        {t('home.hero.bookButton')}
                    </button>
                </div>
            </div>

            {/* About Section */}
            <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <h2 className="text-2xl font-bold mb-2">{t('home.about.title')}</h2>
                <p className="text-gray-700 mb-4">{t('home.about.text')}</p>
            </div>

            {/* Services Section */}
            <div className="bg-white py-10">
                <h2 className="text-xl font-bold text-center mb-6">{t('home.services.title')}</h2>
                <div className="flex flex-wrap justify-center gap-8 max-w-8xl mx-auto">
                    <div className="bg-gray-100 rounded-lg p-6 w-[400px] shadow text-center">
                        <img src="/images/haircut.png" alt={t('home.services.haircutAlt')} className="mx-auto mb-2 w-[400px]" />
                        <h3 className="text-xl font-semibold mb-1">{t('home.services.haircut')}</h3>
                        <p className="text-gray-600 text-md">{t('home.services.haircutDesc')}</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-6 w-[400px] shadow text-center">
                        <img src="/images/beard.png" alt={t('home.services.beardAlt')} className="mx-auto mb-2 w-[400px]" />
                        <h3 className="text-xl font-semibold mb-1">{t('home.services.beard')}</h3>
                        <p className="text-gray-600 text-md">{t('home.services.beardDesc')}</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-6 w-[400px] shadow text-center">
                        <img src="/images/shave.png" alt={t('home.services.shaveAlt')} className="mx-auto mb-2 w-[400px]" />
                        <h3 className="text-xl font-semibold mb-1">{t('home.services.shave')}</h3>
                        <p className="text-gray-600 text-md">{t('home.services.shaveDesc')}</p>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="max-w-8xl mx-auto py-12 px-4">
                <h2 className="text-xl font-bold text-center mb-6">{t('home.gallery.title')}</h2>
                <div className="relative overflow-hidden">
                    <div
                        className="flex gap-4 w-max animate-gallery-scroll"
                        style={{ animation: 'gallery-scroll 30s linear infinite' }}
                    >
                        <img src="/images/gallery1.png" alt={t('home.gallery.img1Alt')} className="rounded shadow object-cover w-[300px]" />
                        <img src="/images/gallery2.png" alt={t('home.gallery.img2Alt')} className="rounded shadow object-cover w-[300px]" />
                        <img src="/images/gallery3.png" alt={t('home.gallery.img3Alt')} className="rounded shadow object-cover w-[300px]" />
                        <img src="/images/gallery4.png" alt={t('home.gallery.img4Alt')} className="rounded shadow object-cover w-[300px]" />
                        {/* Duplicate images for seamless loop */}
                        <img src="/images/gallery1.png" alt={t('home.gallery.img1Alt')} className="rounded shadow object-cover w-[300px]" />
                        <img src="/images/gallery2.png" alt={t('home.gallery.img2Alt')} className="rounded shadow object-cover w-[300px]" />
                        <img src="/images/gallery3.png" alt={t('home.gallery.img3Alt')} className="rounded shadow object-cover w-[300px]" />
                        <img src="/images/gallery4.png" alt={t('home.gallery.img4Alt')} className="rounded shadow object-cover w-[300px]" />
                    </div>
                </div>
                <style>{`
                    @keyframes gallery-scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-30%); }
                    }
                `}</style>
            </div>

            {/* Testimonials Section */}
            <div className="bg-gray-100 py-10">
                <h2 className="text-xl font-bold text-center mb-6">{t('home.testimonials.title')}</h2>
                <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg p-6 w-72 shadow text-center">
                        <p className="italic mb-2">{t('home.testimonials.quote1')}</p>
                        <div className="font-semibold">— {t('home.testimonials.author1')}</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 w-72 shadow text-center">
                        <p className="italic mb-2">{t('home.testimonials.quote2')}</p>
                        <div className="font-semibold">— {t('home.testimonials.author2')}</div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <h2 className="text-xl font-bold mb-2">{t('home.contact.title')}</h2>
                <p className="mb-2">{t('home.contact.address')}</p>
                <p className="mb-2">{t('home.contact.phone')} <a href="tel:+972528851342" className="text-blue-600 underline">+972-52-8851-342</a></p>
                <div className="mt-4">
                    <iframe
                        title={t('home.contact.mapTitle')}
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4513.687081173903!2d34.77436094929995!3d32.05721964385733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4c9e232f0b0d%3A0xd16c925987ea9537!2sWolfson%2C%20Tel%20Aviv-Jaffa!5e0!3m2!1sen!2sil!4v1751429691571!5m2!1sen!2sil"
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
                        <span className="hidden sm:inline">{t('home.contact.instagram')}</span>
                    </a>
                    <span className="text-gray-400 text-2xl select-none">|</span>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 text-2xl flex items-center gap-2">
                        <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" className="w-7 h-7" />
                        <span className="hidden sm:inline">{t('home.contact.facebook')}</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default HomePage;