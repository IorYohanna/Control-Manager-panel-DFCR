import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { fectUserData } from "../api/currentUser";

const SidebarContext = createContext()

export default function Sidebar({ children, expanded, setExpanded }) {

  const [userData, setUserData] = useState({
    user: "",
    userEmail: "",
  });


  useEffect( () => {
    const loadData = async () => {
      try {
        const data = await fectUserData();
        console.log(data)
        setUserData({
          user : data.fullName,
          userEmail : data.email
        })
        
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
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4 ml-5 ">
              <h4 className="font-stardom capitalize font-bold test-[#2D466E] ">
                {userData.user}
              </h4>
              <span className="text-sm text-[#2f486d] font-eirene ">
                {userData.userEmail}
              </span>
            </div>
            <Link to="/user-settings" >
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
          className={`overflow-hidden font-dropline transition-all ${expanded ? "w-52 ml-3" : "w-0"
            }`}
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
