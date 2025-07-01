import { useContext, useEffect, useState } from 'react';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import User from './SideBar/User.jsx';
import Guest from './SideBar/Guest.jsx';
import { createContext } from 'react';
import { useTranslation } from 'react-i18next';

export const UserContext = createContext(null);

function SideBar({isOpen, setIsOpen}) {
    const [ user, setUser ] = useContext(UserContext);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return(
        <div className={`fixed top-0 right-0 w-[300px] h-screen transition-transform -translate-x-full z-50 ${isOpen? 'translate-x-0' : 'translate-x-[300px]'}`}>
            <div className="flex flex-col h-screen bg-gray-200">
                <div className="flow-root p-[5px]">
                    <h1 className="float-left text-xl font-bold p-4">{t('sidebar.title')}</h1>
                    <img onClick={() => setIsOpen(false)} width="30px" className="float-right cursor-pointer m-4" src="https://www.svgrepo.com/show/510165/right-arrow.svg" alt={t('sidebar.close')}></img>
                </div>
                {user ? <User /> : <Guest />}
                {/* Language Switcher at the bottom */}
                <div className="mt-auto flex flex-row justify-center items-center gap-2 mb-4">
                    <button
                        className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => i18n.changeLanguage('en')}
                    >
                        EN
                    </button>
                    <button
                        className={`px-2 py-1 rounded ${i18n.language === 'he' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                        onClick={() => i18n.changeLanguage('he')}
                    >
                        עִבְרִית
                    </button>
                </div>
            </div>
        </div>
    )
}
export default SideBar;