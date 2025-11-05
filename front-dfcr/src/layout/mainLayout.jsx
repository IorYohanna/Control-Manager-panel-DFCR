import { Outlet } from "react-router-dom";
import Sidebar, { SidebarItem } from "./SideBar";
import { BarChart3, Boxes, LayoutDashboard, LifeBuoy, Package, Receipt, UserCircle } from "lucide-react";
import { useState } from "react";

export default function MainLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  return (
    <div className="flex h-screen bg-linear-to-br from-[#73839E] to-[#5a729b]">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded}>
        <SidebarItem icon={<LayoutDashboard size={20} />}
          text="Login"
          to="/login"
          active
        />

        <SidebarItem icon={<BarChart3 size={20} />}
          text="Signup"
          to="/signup"
          alert

        />
        <SidebarItem icon={<UserCircle size={20} />}
          text="Verify"

        />
        <SidebarItem icon={<Boxes size={20} />}
          text="Workflow"

        />
        <SidebarItem icon={<Package size={20} />}
          text="Dashboard"

        />

        <hr className='my-3' />

        <SidebarItem icon={<Receipt size={20} />}
          text="Dashboard"
        />
        <SidebarItem icon={<LifeBuoy size={20} />}
          text="Dashboard"

        />
      </Sidebar>

      <Outlet context={{ sidebarExpanded }} />
    </div>
  );
}