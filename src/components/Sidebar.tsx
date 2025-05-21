
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Supprimer la structure de sous-menu et mettre toutes les options au même niveau
  const menuItems: SidebarItemProps[] = [
    {
      icon: <LayoutDashboard size={20} />,
      label: t('nav.dashboard'),
      path: '/dashboard',
      isActive: isActive('/dashboard')
    },
    {
      icon: <FileText size={20} />,
      label: t('nav.receipts_new') || 'Encaissements',
      path: '/encaissements',
      isActive: isActive('/encaissements')
    },
    {
      icon: <DollarSign size={20} />,
      label: t('nav.expenses_new'),
      path: '/decaissements',
      isActive: isActive('/decaissements')
    },
    {
      icon: <ChartLine size={20} />,
      label: t('nav.cash_flow'),
      path: '/cash-flow',
      isActive: isActive('/cash-flow')
    },
    {
      icon: <Banknote size={20} />,
      label: t('nav.debt'),
      path: '/debt-management',
      isActive: isActive('/debt-management')
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
      onMouseLeave={() => setIsExpanded(false)}
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
          <div 
            key={item.path} 
            className={cn(
              "flex items-center px-3 py-2 cursor-pointer hover:bg-slate-700 transition-colors",
              item.isActive && "bg-slate-700"
            )}
            onClick={() => handleNavigation(item.path)}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {item.icon}
            </div>
            
            {isExpanded && (
              <span className="ml-3">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
