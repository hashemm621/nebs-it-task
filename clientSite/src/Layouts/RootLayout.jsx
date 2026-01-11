import { BellRing, Menu } from "lucide-react";
import Sidebar from "../componets/Sidebar";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-blue-100/30">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Content Area */}
      <div className="drawer-content flex flex-col">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            {/* Hamburger for mobile */}
            <label htmlFor="my-drawer" className="btn btn-ghost lg:hidden p-1">
              <Menu size={24} className="text-primary" />
            </label>
            
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-accent">Good Afternoon Asif</h2>
              <p className="text-[10px] text-paragraph">13 June, 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="indicator mr-2">
              <span className="indicator-item badge badge-primary badge-xs"></span> 
              <BellRing size={20} className="text-gray-400" />
            </div>
            
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-2 md:gap-3 ml-2">
              <div className="text-right hidden xs:block">
                <p className="text-sm font-bold text-accent leading-tight">Asif Riaj</p>
                <p className="text-[11px] text-paragraph text-right">Hr</p>
              </div>
              <div className="avatar">
                <div className="w-8 md:w-10 rounded-full ring ring-offset-2 ring-orange-100">
                  <img src="https://ui-avatars.com/api/?name=Asif+Riaj&background=F95524&color=fff" alt="Profile" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-4 md:p-8">
          <Outlet/>
        </main>
      </div> 

      {/* Sidebar Drawer */}
      <div className="drawer-side z-30">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="w-64 min-h-full">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default RootLayout;