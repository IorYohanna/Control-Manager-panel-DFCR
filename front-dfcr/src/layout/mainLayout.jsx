import React from 'react'
import SideBar, { SidebarItem } from './SideBar'
import { BarChart3, Boxes, LayoutDashboard, LifeBuoy, Package, Receipt, UserCircle } from 'lucide-react'

const MainLayout = () => {
  return (
    <main className='' >
      <SideBar>
        <SidebarItem icon={<LayoutDashboard size={20} />}
          text="login"
          to="/login"
          active
          
        />
        <SidebarItem icon={<BarChart3 size={20} />}
          text="signup"
          to="/signup"
          alert
          
        />
        <SidebarItem icon={<UserCircle size={20} />}
          text="verify"
          
        />
        <SidebarItem icon={<Boxes size={20} />}
          text="workflow"
          
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

    </main>
  )
}

export default MainLayout