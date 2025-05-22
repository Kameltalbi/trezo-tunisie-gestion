
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
  Wallet,
  FolderKanban,
  BarChart,
  FileSpreadsheet,
  ArrowDownCircle,
  ArrowUpCircle,
  Target
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
    <div className="px-4 py-2">
      <div className="text-xs font-semibold uppercase opacity-80">{label}</div>
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

  // Dashboard item (no section)
  const dashboardItem: SidebarItemProps = {
    icon: <LayoutDashboard size={24} />,
    label: t('nav.dashboard'),
    path: '/dashboard',
    isActive: isActive('/dashboard')
  };

  // GESTION DE TRÉSORERIE section
  const treasuryManagementItems: SidebarItemProps[] = [
    {
      icon: <Wallet size={24} />,
      label: t('nav.accounts'),
      path: '/comptes',
      isActive: isActive('/comptes')
    },
    {
      icon: <ChartLine size={24} />,
      label: t('nav.cash_flow'),
      path: '/cash-flow',
      isActive: isActive('/cash-flow')
    }
  ];
  
  // PRÉVISIONS section
  const forecastItems: SidebarItemProps[] = [
    {
      icon: <ArrowUpCircle size={24} />,
      label: t('nav.receipts_new'),
      path: '/encaissements',
      isActive: isActive('/encaissements')
    },
    {
      icon: <ArrowDownCircle size={24} />,
      label: t('nav.expenses_new'),
      path: '/decaissements',
      isActive: isActive('/decaissements')
    }
  ];

  // TRANSACTIONS section
  const transactionsItems: SidebarItemProps[] = [
    {
      icon: <FileText size={24} />,
      label: t('nav.transactions'),
      path: '/transactions',
      isActive: isActive('/transactions')
    },
    {
      icon: <Banknote size={24} />,
      label: t('nav.debt'),
      path: '/debt-management',
      isActive: isActive('/debt-management')
    }
  ];

  // SUIVI PAR PROJET section
  const projectTrackingItems: SidebarItemProps[] = [
    {
      icon: <FolderKanban size={24} />,
      label: t('nav.projects'),
      path: '/projets',
      isActive: isActive('/projets')
    },
    {
      icon: <Target size={24} />,
      label: t('nav.objectives'),
      path: '/objectifs',
      isActive: isActive('/objectifs')
    }
  ];

  // RAPPORTS & CONFIGURATION section
  const reportsConfigItems: SidebarItemProps[] = [
    {
      icon: <FileSpreadsheet size={24} />,
      label: t('nav.reports'),
      path: '/rapports',
      isActive: isActive('/rapports')
    },
    {
      icon: <Settings size={24} />,
      label: t('nav.parametres'),
      path: '/parametres',
      isActive: isActive('/parametres')
    },
    {
      icon: <UserCog size={24} />,
      label: t('nav.admin'),
      path: '/admin',
      isActive: isActive('/admin')
    }
  ];

  const renderSidebarItem = (item: SidebarItemProps) => (
    <div 
      key={item.path} 
      className={cn(
        "flex items-center px-3 py-3 cursor-pointer hover:bg-sidebar-accent/50 transition-colors rounded-md mx-2 my-1",
        item.isActive && "bg-blue-600 text-white hover:bg-blue-700"
      )}
      onClick={() => handleNavigation(item.path)}
    >
      <div className="w-10 h-10 flex items-center justify-center">
        {item.icon}
      </div>
      
      {isExpanded && (
        <span className="ml-3 text-base">{item.label}</span>
      )}
    </div>
  );

  return (
    <div 
      className="fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground z-50 transition-all duration-300 flex flex-col"
      style={{ width: isExpanded ? '240px' : '70px' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="p-4 flex items-center justify-center h-16 border-b border-sidebar-accent/20">
        {isExpanded ? (
          <h1 className="text-xl font-bold">Trezo</h1>
        ) : (
          <h1 className="text-xl font-bold">T</h1>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {/* Dashboard (no section) */}
        {renderSidebarItem(dashboardItem)}
        <Separator className="my-2 bg-sidebar-accent/20" />
        
        {/* GESTION DE TRÉSORERIE section */}
        {isExpanded && (
          <SidebarSection label={t('nav.cash_management')} />
        )}
        {treasuryManagementItems.map(renderSidebarItem)}
        <Separator className="my-2 bg-sidebar-accent/20" />
        
        {/* PRÉVISIONS section */}
        {isExpanded && (
          <SidebarSection label={t('nav.forecasts')} />
        )}
        {forecastItems.map(renderSidebarItem)}
        <Separator className="my-2 bg-sidebar-accent/20" />
        
        {/* TRANSACTIONS section */}
        {isExpanded && (
          <SidebarSection label={t('nav.transactions_section')} />
        )}
        {transactionsItems.map(renderSidebarItem)}
        <Separator className="my-2 bg-sidebar-accent/20" />
        
        {/* SUIVI PAR PROJET section */}
        {isExpanded && (
          <SidebarSection label={t('nav.project_tracking')} />
        )}
        {projectTrackingItems.map(renderSidebarItem)}
        <Separator className="my-2 bg-sidebar-accent/20" />
        
        {/* RAPPORTS & CONFIGURATION section */}
        {isExpanded && (
          <SidebarSection label={t('nav.reports_config')} />
        )}
        {reportsConfigItems.map(renderSidebarItem)}
      </div>
    </div>
  );
};

export default Sidebar;
