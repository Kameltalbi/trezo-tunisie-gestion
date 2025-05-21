
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
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}

interface SidebarSectionProps {
  label: string;
}

const SidebarSection = ({ label }: SidebarSectionProps) => {
  return (
    <div className="px-3 py-2">
      <div className="text-xs font-semibold text-slate-400 uppercase">{label}</div>
    </div>
  );
};

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

  // Organize menu items with sections
  const dashboardItem: SidebarItemProps = {
    icon: <LayoutDashboard size={20} />,
    label: t('nav.dashboard'),
    path: '/dashboard',
    isActive: isActive('/dashboard')
  };

  // New accounts section
  const accountsItems: SidebarItemProps[] = [
    {
      icon: <Wallet size={20} />,
      label: t('nav.accounts'),
      path: '/comptes',
      isActive: isActive('/comptes')
    }
  ];
  
  const treasuryMenuItems: SidebarItemProps[] = [
    {
      icon: <ChartLine size={20} />,
      label: t('nav.cash_flow'),
      path: '/cash-flow',
      isActive: isActive('/cash-flow')
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
      icon: <Banknote size={20} />,
      label: t('nav.debt'),
      path: '/debt-management',
      isActive: isActive('/debt-management')
    },
  ];

  const settingsItems: SidebarItemProps[] = [
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

  const renderSidebarItem = (item: SidebarItemProps) => (
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
  );

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
        {/* Dashboard */}
        {renderSidebarItem(dashboardItem)}
        
        {/* Gestion de trésorerie section */}
        {isExpanded && (
          <SidebarSection label={t('nav.cash_management')} />
        )}
        <Separator className="my-2 bg-slate-700" />
        
        {/* Comptes & caisses section */}
        {isExpanded && (
          <SidebarSection label={t('nav.accounts_section')} />
        )}
        
        {/* Accounts menu items */}
        {accountsItems.map(renderSidebarItem)}
        
        {/* Treasury management menu items */}
        {treasuryMenuItems.map(renderSidebarItem)}
        
        {/* Settings menu items */}
        {settingsItems.map(renderSidebarItem)}
      </div>
    </div>
  );
};

export default Sidebar;
