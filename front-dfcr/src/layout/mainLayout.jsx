import { Outlet } from "react-router-dom";
import Sidebar, { SidebarItem } from "./SideBar";
import { Boxes, LayoutDashboard, Package , Calendar, MessageCircle, Mail, BriefcaseBusiness, LogIn} from "lucide-react";
import { useState } from "react";

export default function MainLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  return (
    <div className="flex h-screen bg-linear-to-br from-[#73839E] to-[#5a729b]">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded}>
        <SidebarItem icon={<LogIn size={20} />}
          text="Login"
          to="/"
          active
        />
        <SidebarItem icon={<Boxes size={20} />}
          text="Workflow"
          to="/home/workflow"
        />
        <SidebarItem icon={<Package size={20} />}
          text="Docs en Ligne"
          to="/home/online-drive"
        />
        <SidebarItem icon={<Mail size={20} />}
          text="Gmail"
          to="/home/email"
        />
        <SidebarItem icon={<Calendar size={20} />}
          text="Event"
          to="/home"
        />

        <SidebarItem icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          to="/home/dashboard"
        />

        <SidebarItem icon={<BriefcaseBusiness/>} size={20} 
          text="Documents"
          to="/home/workflow"
        /> 
        <SidebarItem icon={<MessageCircle/>} size={20} 
          text="Messagerie Instantanée"
          to="/home/chat"
        /> 
          
      </Sidebar>

      <div 
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarExpanded ? 'ml-0' : 'ml-0'
        } thin-scrollbar`}
      >
        <Outlet context={{ sidebarExpanded }} />
      </div>
    </div>
  );
}