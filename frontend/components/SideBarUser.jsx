import SideBarTab from './SideBarTab';

function SideBarUser(){
    return(
        <>
        <SideBarTab icon="https://www.svgrepo.com/show/390671/profile-user-avatar-man-person.svg" title="Profile" click={() => console.log('Profile clicked')}/>
        <SideBarTab icon="https://www.svgrepo.com/show/511123/settings-future.svg" title="Settings" click={() => console.log('Settings clicked')}/>
        <SideBarTab icon="https://www.svgrepo.com/show/506720/logout.svg" title="Sign out" click={() => console.log('Sign out clicked')}/>
        </>
    )
}
export default SideBarUser;