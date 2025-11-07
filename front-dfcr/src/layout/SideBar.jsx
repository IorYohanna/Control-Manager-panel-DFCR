import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { fectUserData } from "../api/User/currentUser";
import { fetchUserPhoto } from "../api/User/profileinfo";

const SidebarContext = createContext()

export default function Sidebar({ children, expanded, setExpanded }) {

  const [userData, setUserData] = useState({
    user: "",
    userEmail: "",
  });
  const [previewUrl, setPreviewUrl] = useState();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fectUserData();
        console.log(data)
        setUserData({
          user: data.fullName,
          userEmail: data.email,
        })

        const imgUrl = await fetchUserPhoto(data.matricule)
        setPreviewUrl(imgUrl);

      } catch (error) {
        console.error(error)
      }
    }

    loadData()
  }, [])

  return (
    <aside className="h-screen p-4">
      <nav className="h-full w-fit flex flex-col bg-[#F5ECE3] rounded-2xl shadow-[4px_0_15px_rgba(0,0,0,0.05)]">
        <div className="p-4 pb-2 flex justify-between items-center">
          <span className={`uppercase font-necoBlack text-2xl text-[#2D466E] overflow-hidden transition-all ${expanded ? "w-auto" : "w-0"}`}>
            dfcr
          </span>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-[#24344D] "
          >
            {expanded ? <ChevronFirst color="white" /> : <ChevronLast color="white" />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t border-[#73839E] flex p-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Photo de profil */}
            <div className="shrink-0">
              <img
                src={previewUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="relative group">
                <h4 className="font-stardom capitalize font-bold text-[#2D466E] text-sm truncate">
                  {userData.user}
                </h4>
                {userData.user && userData.user.length > 20 && (
                  <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                    {userData.user}
                    <div className="absolute top-full left-3 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                  </div>
                )}
              </div>

              <div className="relative group">
                <span className="text-xs text-[#2f486d] font-eirene truncate block">
                  {userData.userEmail}
                </span>
                {userData.userEmail && userData.userEmail.length > 25 && (
                  <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                    {userData.userEmail}
                    <div className="absolute bottom-full left-3 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                  </div>
                )}
              </div>
            </div>

            <Link to="/home/user-settings" className="hrink-0 ml-2">
              <MoreVertical size={20} className="text-[#2D466E]" />
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, to = "#" }) {
  const { expanded } = useContext(SidebarContext)

  return (
    <Link to={to} className="flex">
      <li
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${active
            ? "bg-linear-to-r from-[#F5ECE3] to-[#24344D] text-white"
            : "hover:bg-[#73839E] text-[#2f486d] hover:text-white "
          }
        `}
      >
        {icon}
        <span
          className={`overflow-hidden font-dropline transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}
        >
          {text}
        </span>

        {!expanded && (
          <div
            className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-[#2D466E] text-white text-sm
              invisible opacity-20 -translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            `}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  )
}