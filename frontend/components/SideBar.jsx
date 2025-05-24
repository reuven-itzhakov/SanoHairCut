import User from './SideBar/User.jsx';
import Guest from './SideBar/Guest.jsx';

function SideBar({isOpen, setIsOpen}) {
    return(
        <div className={`fixed top-0 right-0 w-[300px] h-screen transition-transform -translate-x-full ${isOpen? 'translate-x-0' : 'translate-x-[300px]'}`}>
            <div className="flex flex-col h-screen bg-gray-200">
                <div className="flow-root p-[5px]">
                    <h1 className="float-left text-xl font-bold p-4">Sidebar</h1>
                    <img onClick={() => setIsOpen(false)} width="30px" className="float-right cursor-pointer m-4" src="https://www.svgrepo.com/show/510165/right-arrow.svg"></img>
                </div>
                {/* <User /> */}
                <Guest />
            </div>
        </div>
    )
}
export default SideBar;