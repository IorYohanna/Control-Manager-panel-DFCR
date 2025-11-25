import { MoreVertical, Home, Users, Settings, BarChart } from "lucide-react";

export default function NavBar() {
    return (
        <nav className="relative mx-8 mt-4 ml-56">
            <div
                className="bg-[#F5ECE3] shadow-[0_4px_15px_rgba(0,0,0,0.08)] px-10 py-2 rounded-lg"
            >
                <div className="flex items-center justify-between">
                    <ul className="flex items-center gap-2">
                        <NavItem icon={<Home size={20} />} text="Dashboard"  />
                        <NavItem icon={<Users size={20} />} text="Users"  />
                        <NavItem icon={<BarChart size={20} />} text="Statistics" />
                        <NavItem icon={<Settings size={20} />} text="Settings" />
                    </ul>
                </div>
            </div>
        </nav>
    );
}


function NavItem({ icon, text, active }) {
    return (
        <li
            className={`
        relative flex items-center py-2 px-4
        font-medium rounded-xl cursor-pointer
        transition-colors group
        ${active
                    ? "bg-[#223148] text-white shadow-md"
                    : "hover:bg-[#d2c7b8] text-[#2f486d]"
                }
      `}
        >
            {icon}
            <span className="ml-2">{text}</span>
        </li>
    );
}
