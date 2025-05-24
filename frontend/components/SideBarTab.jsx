function SideBarTab({icon, title, click}){
    return (
        <div className="flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer" onClick={click}>
            <img src={icon} alt={title} className="w-6 h-6"/>
            <span className="text-lg">{title}</span>
        </div>
    );
}
export default SideBarTab;