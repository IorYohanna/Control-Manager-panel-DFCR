import { Outlet } from "react-router-dom";
import Sidebar, { SidebarItem } from "./SideBar";
import { LayoutDashboard, Package, Calendar, MessageCircle, Mail, Workflow, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchUserProfile } from "../api/User/currentUser";

export default function MainLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDirector, setIsDirector] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkDirectorRole = async () => {
      try {
        const userProfile = await fetchUserProfile();
        const hasDirectorRole = userProfile?.fonction?.toLowerCase() === 'directeur' ||
          userProfile?.role?.toLowerCase() === 'directeur';

        setIsDirector(hasDirectorRole);
      } catch (error) {
        console.error('Erreur lors de la vérification du rôle:', error);
        setIsDirector(false);
      } finally {
        setLoading(false);
      }
    };

    checkDirectorRole();
  }, []);

  return (
    <div className="flex h-screen bg-linear-to-br from-[#73839E] to-[#5a729b] relative overflow-hidden">

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-6 right-6 z-50 p-2 bg-[#1a2b44] text-white rounded-lg shadow-lg transition-colors"
      >
        <Menu size={24} />
      </button>

      <Sidebar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      >
        <SidebarItem
          icon={<Calendar size={20} />}
          text="Accueil"
          to="/home"
          active
        />

        {!loading && isDirector && (
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            text="Tableau de Bord"
            to="/home/dashboard"
          />
        )}

        <SidebarItem
          icon={<Package size={20} />}
          text="Drive"
          to="/home/online-drive"
        />

        <SidebarItem
          icon={<Workflow size={20} />}
          text="Documents"
          to="/home/workflow"
        />

        <SidebarItem
          icon={<Mail size={20} />}
          text="Gmail"
          to="/home/email"
        />

        <SidebarItem
          icon={<MessageCircle size={20} />}
          text="Messagerie"
          to="/home/chat"
        />
      </Sidebar>

      <Outlet
        context={{ sidebarExpanded }}
        className={`flex-1 overflow-auto transition-all duration-300 p-4 md:p-0 thin-scrollbar`}
      />
    </div>
  );
}