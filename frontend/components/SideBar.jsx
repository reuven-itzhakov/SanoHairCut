import SideBarUser from './SideBarUser';
import SideBarGuest from './SideBarGuest';

function SideBar(){
    return(
        <div className="fixed top-0 right-0 w-[300px] h-screen transition-transform -translate-x-full sm:translate-x-0">
            <div className="flex flex-col h-screen bg-gray-200">
                <div className="flow-root">
                    <h1 className="float-left text-xl font-bold p-4">Sidebar</h1>
                    <img width="30px" className="float-right cursor-pointer m-4" src="https://www.svgrepo.com/show/510165/right-arrow.svg"></img>
                </div>
                {/* <SideBarUser /> */}
                <SideBarGuest />
            </div>
        </div>
    )
}
export default SideBar;