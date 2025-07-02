// User.jsx
// Sidebar component for authenticated users.
// Shows navigation tabs for profile, appointment, admin tools (if admin), and sign out.
// Uses i18n for translations and UserContext for user info.

import Tab from './Tab';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../SideBar.jsx';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../../src/config.js';

function User(){
    const navigate = useNavigate();
    const auth = getAuth();
    const [user] = useContext(UserContext); // Current user
    const [isAdmin, setIsAdmin] = useState(false); // Admin status
    const { t } = useTranslation();

    // Check if user is admin on mount or user change
    useEffect(() => {
        if (user && user.uid) {
            axios.get(`${API_BASE_URL}/api/users?profile=true&uid=${user.uid}`)
                .then(res => setIsAdmin(res.data.isAdmin === true))
                .catch(() => setIsAdmin(false));
        } else {
            setIsAdmin(false);
        }
    }, [user]);

    // Sign out the user and redirect to home
    const signOutUser = () => {
      signOut(auth).then(() => {
        // Sign-out successful.
        navigate('/');
      }).catch((error) => {
        // An error happened.
      });
    };
    
    return(
        <>
        {/* Profile tab */}
        <Tab icon="https://www.svgrepo.com/show/390671/profile-user-avatar-man-person.svg" title={t('sidebar.user.profile')} click={() => navigate('/profile')}/>
        {/* Appointment tab */}
        <Tab icon="https://www.svgrepo.com/show/533396/calendar-lines-pen.svg" title={t('sidebar.user.appointment')} click={() => navigate('/appointment')}/>
        {/* Admin tools tab (only for admins) */}
        {isAdmin && (
                <Tab icon="https://www.svgrepo.com/show/511123/settings-future.svg" title={t('sidebar.user.adminTools')} click={() => navigate('/admin')} />
            )}
        {/* Sign out tab */}
        <Tab icon="https://www.svgrepo.com/show/506720/logout.svg" title={t('sidebar.user.signout')} click={() => signOutUser()}/>
        </>
    )
}
export default User;