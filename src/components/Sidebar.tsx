
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Banknote, CreditCard, Settings, LogOut, Coins } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t("auth.logout_success"));
    } catch (error) {
      toast.error(t("auth.logout_error"));
    }
  };

  // Check if route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className="hidden sm:flex fixed left-0 top-0 h-screen bg-gray-50 border-r shadow-sm z-10 transition-all duration-300 ease-in-out overflow-hidden"
      style={{ width: isHovered ? '240px' : '60px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header/Logo */}
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-center h-16 border-b">
          <div className="flex items-center justify-center w-full">
            <div className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-sm w-9 h-9 flex items-center justify-center">
              <Coins size={20} />
            </div>
            <span 
              className={`ml-3 text-lg font-semibold transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              {t("app.name")}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col space-y-1 px-2 py-4">
          <SidebarLink 
            to="/dashboard" 
            icon={<LayoutDashboard size={20} />} 
            isActive={isActive("/dashboard")}
            isHovered={isHovered}
            label={t("nav.dashboard")}
          />
          <SidebarLink 
            to="/recettes" 
            icon={<Banknote size={20} />} 
            isActive={isActive("/recettes")}
            isHovered={isHovered}
            label={t("nav.recettes")}
          />
          <SidebarLink 
            to="/depenses" 
            icon={<CreditCard size={20} />} 
            isActive={isActive("/depenses")}
            isHovered={isHovered}
            label={t("nav.depenses")}
          />
          <SidebarLink 
            to="/parametres" 
            icon={<Settings size={20} />} 
            isActive={isActive("/parametres")}
            isHovered={isHovered}
            label={t("nav.parametres")}
          />
          
          {/* Spacer */}
          <div className="flex-1"></div>
          
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={`flex items-center px-2 py-2 rounded-lg transition-colors group ${
              isActive("/logout") ? "bg-emerald-100 text-emerald-700" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center justify-center w-8">
              <LogOut size={20} />
            </span>
            <span 
              className={`ml-2 transition-all duration-300 ${
                isHovered 
                  ? "opacity-100 translate-x-0" 
                  : "opacity-0 -translate-x-4"
              }`}
            >
              {t("auth.logout")}
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
};

// Sidebar link component
const SidebarLink = ({ 
  to, 
  icon, 
  isActive, 
  isHovered, 
  label 
}: { 
  to: string; 
  icon: React.ReactNode; 
  isActive: boolean; 
  isHovered: boolean;
  label: string;
}) => {
  return (
    <NavLink
      to={to}
      className={`flex items-center px-2 py-2 rounded-lg transition-colors ${
        isActive ? "bg-emerald-100 text-emerald-700" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className="flex items-center justify-center w-8">
        {icon}
      </span>
      <span 
        className={`ml-2 transition-all duration-300 ${
          isHovered 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 -translate-x-4"
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
};

export default Sidebar;
