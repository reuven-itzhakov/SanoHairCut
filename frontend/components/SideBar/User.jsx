import Tab from './Tab';

function User(){
    return(
        <>
        <Tab icon="https://www.svgrepo.com/show/390671/profile-user-avatar-man-person.svg" title="Profile" click={() => console.log('Profile clicked')}/>
        <Tab icon="https://www.svgrepo.com/show/511123/settings-future.svg" title="Settings" click={() => console.log('Settings clicked')}/>
        <Tab icon="https://www.svgrepo.com/show/506720/logout.svg" title="Sign out" click={() => console.log('Sign out clicked')}/>
        </>
    )
}
export default User;