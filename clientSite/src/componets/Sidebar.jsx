import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router"; 
import {
  LayoutDashboard, Users, CreditCard, ReceiptText, CalendarCheck,
  HandHelping, GraduationCap, FileText, BellRing, ClipboardList,
  LogOut, UserCircle, ChevronDown,
} from "lucide-react";
import brandLogo from "../assets/BrandLogo.png";

const Sidebar = () => {
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/dashboard" },
    {
      icon: <Users size={18} />,
      label: "Employee",
      path: "/employee",
      hasSub: true,
      subRoutes: [
        { label: "Employee Database", path: "/employee/database" },
        { label: "Add Employee", path: "/employee/add-new-employee" },
        { label: "Performance Report", path: "/employee/performance-report" },
        { label: "Performance History", path: "/employee/performance-history" },
      ],
    },
    { icon: <CreditCard size={18} />, label: "Payroll", path: "/payroll" },
    { icon: <ReceiptText size={18} />, label: "Pay Slip", path: "/pay-slip" },
    { icon: <CalendarCheck size={18} />, label: "Attendance", path: "/attendance" },
    { icon: <HandHelping size={18} />, label: "Request Center", path: "/request-center" },
    { icon: <GraduationCap size={18} />, label: "Career Database", path: "/career", hasSub: true },
    { icon: <FileText size={18} />, label: "Document manager", path: "/docs" },
    { icon: <BellRing size={18} />, label: "Notice Board", path: "/notice-board" },
    { icon: <ClipboardList size={18} />, label: "Activity Log", path: "/activity" },
    { icon: <LogOut size={18} />, label: "Exit Interview", path: "/exit" },
    { icon: <UserCircle size={18} />, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
      {/* Logo Section */}
      <Link to="/"><img src={brandLogo} alt="Nebs-IT" className="w-32 md:w-36 h-auto object-contain p-6" /></Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar pb-6">
        {menuItems.map((item, i) => {
          const isSubRouteActive = item.subRoutes?.some(sub => location.pathname === sub.path);

          if (item.subRoutes) {
            return (
              <div key={i} className="flex flex-col">
                <button
                  onClick={() => setIsEmployeeOpen(!isEmployeeOpen)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all w-full cursor-pointer ${
                    isSubRouteActive || isEmployeeOpen 
                    ? "bg-orange-50/50 text-primary font-semibold" 
                    : "text-secondary hover:bg-gray-100 hover:text-primary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-[15px]">{item.label}</span>
                  </div>
                  <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-300 ${isEmployeeOpen ? "rotate-180" : ""}`} 
                  />
                </button>

                {/* Sub-menu with Animation */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isEmployeeOpen ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  {item.subRoutes.map((sub, idx) => (
                    <NavLink
                      key={idx}
                      to={sub.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 py-2.5 pl-12 pr-4 rounded-lg text-sm transition-all ${
                          isActive 
                            ? "text-primary font-bold bg-orange-50/30" 
                            : "text-gray-500 hover:text-primary hover:bg-gray-50"
                        }`
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between p-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-orange-50 text-primary font-semibold border-r-4 border-primary rounded-r-none"
                    : "text-secondary hover:bg-gray-100 hover:text-primary"
                }`
              }
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-[15px]">{item.label}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;