// Tab.jsx
// Sidebar tab component for navigation.
// Displays an icon and title, and handles click events.

function Tab({icon, title, click}){
    return (
        <div className="border-t border-gray-300 flex items-center gap-2 px-5 p-2 hover:bg-gray-300 cursor-pointer duration-200" onClick={click}>
            <img src={icon} alt={title} className="w-6 h-6"/>
            <span className="text-lg">{title}</span>
        </div>
    );
}
export default Tab;