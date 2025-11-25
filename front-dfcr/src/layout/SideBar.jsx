import { MoreVertical, ChevronLast, ChevronFirst, LogOut, X } from "lucide-react"
import { useContext, createContext, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { fectUserData } from "../api/User/currentUser";
import { fetchUserPhoto } from "../api/User/profileinfo";
import UserAvatar from "../components/User/UserAvatar";

import { logout } from "../api/Email/gmail";

const SidebarContext = createContext()

export default function Sidebar({ children, expanded, setExpanded, mobileOpen, setMobileOpen }) {

  const [userData, setUserData] = useState({
    user: "",
    userEmail: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fectUserData();
        setUserData({
          user: data.fullName,
          userEmail: data.email,
        })

        // Gérer le cas où la photo peut être null ou undefined
        try {
          const imgUrl = await fetchUserPhoto(data.matricule);
          setPreviewUrl(imgUrl || null);
        } catch (error) {
          console.log("Pas de photo de profil disponible:", error);
          setPreviewUrl(null);
        }
      } catch (error) {
        console.error(error)
      }
    }
    loadData()
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiration");

    await logout();
    localStorage.removeItem("gmail_auth")
    navigate("/");
  };

  return (
    <>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
        />
      )}

      <aside className={`
        h-screen p-4  
        fixed md:relative z-50
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0 " : "-translate-x-full md:translate-x-0"}
      `}>

        <nav className="h-full w-fit flex flex-col bg-[#F5ECE3] overflow-auto thin-scrollbar rounded-lg shadow-[4px_0_15px_rgba(0,0,0,0.05)]">

          <div className="p-4 pb-2 flex justify-between items-center">
            <span className={`uppercase font-necoBlack text-2xl text-[#2D466E] overflow-hidden transition-all ${expanded ? "w-auto" : "w-0"}`}>
              dfcr
            </span>

            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileOpen(false);
                } else {
                  setExpanded((curr) => !curr);
                }
              }}
              className="p-1.5 rounded-lg bg-[#24344D]"
            >
              <div className="md:hidden"><X color="white" size={20} /></div>
              <div className="hidden md:block">
                {expanded ? <ChevronFirst color="white" /> : <ChevronLast color="white" />}
              </div>
            </button>
          </div>

          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="px-3 pb-3">
            <button
              onClick={handleLogout}
              className={`
                relative flex items-center w-full py-2 px-3 my-1
                font-medium rounded-md cursor-pointer
                transition-colors group
                hover:bg-[#2D466E] text-[#2f486d] hover:text-white
              `}
            >
              <LogOut size={20} />
              <span className={`overflow-hidden font-dropline transition-all truncate ${expanded ? "ml-3" : "w-0"}`}>
                Déconnexion
              </span>
              {!expanded && (
                <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-[#2D466E] text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
                  Déconnexion
                </div>
              )}
            </button>
          </div>

          <div className="border-t border-[#73839E] flex p-3">
            <div className={`flex justify-between items-center gap-2 overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
              
              <div className="leading-4 flex gap-2 items-center min-w-0 flex-1">
                <UserAvatar
                  user={userData.user}
                  imageUrl={previewUrl}
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <h4 className="font-stardom capitalize font-bold text-[#2D466E] truncate">
                    {userData.user}
                  </h4>
                  <span className="text-sm text-[#2f486d] font-eirene truncate">
                    {userData.userEmail}
                  </span>
                </div>
              </div>

              <Link to="/home/user-settings" className="shrink-0">
                <MoreVertical size={20} className="text-[#2D466E]" />
              </Link>

            </div>
          </div>

        </nav>
      </aside>
    </>
  );
}

export function SidebarItem({ icon, text, active, to = "#" }) {
  const { expanded } = useContext(SidebarContext)
  return (
    <Link to={to} className="flex">
      <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-linear-to-r from-[#F5ECE3] to-[#24344D] text-white" : "hover:bg-[#73839E] text-[#2f486d] hover:text-white "}`}>
        {icon}
        <span className={`overflow-hidden font-dropline transition-all truncate ${expanded ? "w-52 ml-3" : "w-0"}`}>
          {text}
        </span>
        {!expanded && (
          <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-[#2D466E] text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
            {text}
          </div>
        )}
      </li>
    </Link>
  )
}