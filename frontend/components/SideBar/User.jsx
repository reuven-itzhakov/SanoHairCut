import Tab from './Tab';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


function User(){
    const navigate = useNavigate();
    const auth = getAuth();
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
        <Tab icon="https://www.svgrepo.com/show/511123/settings-future.svg" title="Settings" click={() => navigate('/settings')}/>
        <Tab icon="https://www.svgrepo.com/show/506720/logout.svg" title="Sign out" click={() => signOutUser()}/>
        </>
    )
}
export default User;