import Tab from './Tab';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../SideBar.jsx';


function User(){
    const navigate = useNavigate();
    const auth = getAuth();
    const [user] = useContext(UserContext);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (user && user.uid) {
            axios.get(`http://localhost:5000/api/profile/${user.uid}`)
                .then(res => setIsAdmin(res.data.isAdmin === true))
                .catch(() => setIsAdmin(false));
        } else {
            setIsAdmin(false);
        }
    }, [user]);

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
        <Tab icon="https://www.svgrepo.com/show/390671/profile-user-avatar-man-person.svg" title="Profile" click={() => navigate('/profile')}/>
        <Tab icon="https://www.svgrepo.com/show/533396/calendar-lines-pen.svg" title="Appointment" click={() => navigate('/appointment')}/>
        {isAdmin && (
                <Tab icon="https://www.svgrepo.com/show/511123/settings-future.svg" title="Admin Tools" click={() => navigate('/admin')} />
            )}
        <Tab icon="https://www.svgrepo.com/show/506720/logout.svg" title="Sign out" click={() => signOutUser()}/>
        </>
    )
}
export default User;