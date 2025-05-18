import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Banknote, 
  FileText, 
  DollarSign, 
  ChartLine, 
  Settings, 
  UserCog,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
  hasSubMenu?: boolean;
  subMenu?: { icon: React.ReactNode; label: string; path: string }[];
}

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSubMenu, setExpandedSubMenu] = useState<string | null>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    // Ne pas naviguer si le chemin est #
    if (path === '#') return;
    navigate(path);
  };

  const menuItems: SidebarItemProps[] = [
    {
      icon: <LayoutDashboard size={20} />,
      label: t('nav.dashboard'),
      path: '/dashboard',
      isActive: isActive('/dashboard')
    },
    {
      icon: <Banknote size={20} />,
      label: t('nav.cash_management'),
      path: '#', // Utiliser # pour éviter la navigation
      isActive: isActive('/cash-management') || isActive('/depenses') || isActive('/cash-flow') || isActive('/debt-management'),
      hasSubMenu: true,
      subMenu: [
        {
          icon: <DollarSign size={18} />,
          label: t('nav.expenses'),
          path: '/depenses'
        },
        {
          icon: <ChartLine size={18} />,
          label: t('nav.cash_flow'),
          path: '/cash-flow'
        },
        {
          icon: <DollarSign size={18} />,
          label: t('nav.debt'),
          path: '/debt-management'
        }
      ]
    },
    {
      icon: <Settings size={20} />,
      label: t('nav.parametres'),
      path: '/parametres',
      isActive: isActive('/parametres')
    },
    {
      icon: <UserCog size={20} />,
      label: t('nav.admin'),
      path: '/admin',
      isActive: isActive('/admin')
    }
  ];

  return (
    <div 
      className="fixed left-0 top-0 h-full bg-slate-800 text-white z-50 transition-all duration-300 flex flex-col"
      style={{ width: isExpanded ? '240px' : '60px' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setExpandedSubMenu(null);
      }}
    >
      <div className="p-4 flex items-center justify-center h-16 border-b border-slate-700">
        {isExpanded ? (
          <h1 className="text-lg font-bold">Trezo</h1>
        ) : (
          <h1 className="text-lg font-bold">T</h1>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.path} className="mb-1">
            <div 
              className={cn(
                "flex items-center px-3 py-2 cursor-pointer hover:bg-slate-700 transition-colors",
                item.isActive && "bg-slate-700"
              )}
              onClick={() => {
                if (item.hasSubMenu) {
                  if (expandedSubMenu === item.path) {
                    setExpandedSubMenu(null);
                  } else {
                    setExpandedSubMenu(item.path);
                  }
                  // Ne pas naviguer si c'est un élément avec sous-menu
                  return;
                } else {
                  handleNavigation(item.path);
                }
              }}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {item.icon}
              </div>
              
              {isExpanded && (
                <>
                  <span className="ml-3 flex-1">{item.label}</span>
                  {item.hasSubMenu && (
                    <ChevronRight 
                      size={16} 
                      className={cn(
                        "transition-transform",
                        expandedSubMenu === item.path && "transform rotate-90"
                      )} 
                    />
                  )}
                </>
              )}
            </div>

            {/* Sous-menu */}
            {item.hasSubMenu && item.subMenu && isExpanded && expandedSubMenu === item.path && (
              <div className="pl-4 bg-slate-900">
                {item.subMenu.map((subItem) => (
                  <div 
                    key={subItem.path}
                    className={cn(
                      "flex items-center px-3 py-2 cursor-pointer hover:bg-slate-700 transition-colors",
                      isActive(subItem.path) && "bg-slate-700"
                    )}
                    onClick={() => handleNavigation(subItem.path)}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {subItem.icon}
                    </div>
                    <span className="ml-3">{subItem.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
