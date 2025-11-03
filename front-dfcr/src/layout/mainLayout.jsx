import React from 'react'
import SideBar, { SidebarItem } from './SideBar'
import { BarChart3, Boxes, LayoutDashboard, LifeBuoy, Package, Receipt, UserCircle } from 'lucide-react'
import NavBar from './NavBar'

const MainLayout = () => {
  return (
    <main className='flex' >
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
      <NavBar/>

    </main>
  )
}

export default MainLayout