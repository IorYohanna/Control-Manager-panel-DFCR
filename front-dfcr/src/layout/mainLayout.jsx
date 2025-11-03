import React from 'react'
import SideBar, { SidebarItem } from './SideBar'
import { BarChart3, Boxes, LayoutDashboard, LifeBuoy, Package, Receipt, UserCircle } from 'lucide-react'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <main className='flex w-full' >
      <SideBar>
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
      </SideBar>
      {/* Zone principale avec NavBar et contenu */}
      <div className='flex-1 flex flex-col min-h-screen w-full overflow-x-hidden'>
        {/* NavBar fixe en haut */}
        <NavBar />

        {/* Zone de contenu scrollable */}
        <div className='flex-1 w-full overflow-y-auto'>
          <div className='w-full h-full py-4 px-3 sm:px-4 md:px-6 lg:px-8'>
            <Outlet />
          </div>
        </div>
      </div>
      
{/*       <NavBar/> */}

    </main>
  )
}

export default MainLayout