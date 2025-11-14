import { Outlet } from "react-router-dom";
import Sidebar, { SidebarItem } from "./SideBar";
import { Boxes, LayoutDashboard, Package, Receipt, Calendar, MessageCircle, LogIn, Mail, Workflow } from "lucide-react";
import { useState } from "react";
import WorkflowManagement from "../page/workflow/Workflow";

export default function MainLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  return (
    <div className="flex h-screen bg-linear-to-br from-[#73839E] to-[#5a729b]">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded}>
        <SidebarItem icon={<Calendar size={20} />}
          text="Acceuil"
          to="/home"
          active
        />
        <SidebarItem icon={<LayoutDashboard size={20} />}
          text="Tableau de Bord"
          to="/home/dashboard"
        />
        <SidebarItem icon={<Package size={20} />}
          text="Drive (En Ligne)"
          to="/home/online-drive"
        />
        <SidebarItem icon={<Workflow />} size={20}
          text="Documents"
          to="/home/workflow"
        />
        <SidebarItem icon={<Mail size={20} />}
          text="Gmail"
          to="/home/email"
        />
        <SidebarItem icon={<MessageCircle />} size={20}
          text="Messagerie"
          to="/home/chat"
        />
      </Sidebar>

      <Outlet context={{ sidebarExpanded }} className={`flex-1 overflow-auto transition-all duration-300 ${sidebarExpanded ? 'ml-0' : 'ml-0'
        } thin-scrollbar`} />
    </div>
  );
}