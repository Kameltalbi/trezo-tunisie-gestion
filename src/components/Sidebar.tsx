
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { 
  LayoutDashboard, 
  Banknote, 
  FileText, 
  DollarSign, 
  ChartLine, 
  Wallet,
  FolderKanban,
  BarChart,
  FileSpreadsheet,
  ArrowDownCircle,
  ArrowUpCircle,
  Target,
  LifeBuoy,
  Shield,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}

interface SidebarSectionProps {
  label: string;
  children: React.ReactNode;
}

interface SidebarProps {
  onExpandedChange?: (expanded: boolean) => void;
}

const SidebarSection = ({ label, children }: SidebarSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 transition-colors group rounded-lg mx-2">
        <span className="font-semibold">{label}</span>
        {isOpen ? (
          <ChevronDown size={16} className="text-slate-500" />
        ) : (
          <ChevronRight size={16} className="text-slate-500" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 px-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

const Sidebar = ({ onExpandedChange }: SidebarProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: currentUser } = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Vérifier les permissions
  const isSuperAdmin = user?.email === 'kamel.talbi@yahoo.fr' || currentUser?.role === 'superadmin';
  const isAdmin = isSuperAdmin || currentUser?.role === 'admin';

  // Dashboard item (no section)
  const dashboardItem: SidebarItemProps = {
    icon: <LayoutDashboard size={20} />,
    label: t('nav.dashboard'),
    path: '/dashboard',
    isActive: isActive('/dashboard')
  };

  // Superadmin item (only for kamel.talbi@yahoo.fr)
  const superadminItem: SidebarItemProps = {
    icon: <Shield size={20} />,
    label: 'Superadmin',
    path: '/superadmin',
    isActive: isActive('/superadmin')
  };

  // Settings item (for admin and superadmin)
  const settingsItem: SidebarItemProps = {
    icon: <Settings size={20} />,
    label: 'Paramètres',
    path: '/settings',
    isActive: isActive('/settings')
  };

  const treasuryManagementItems: SidebarItemProps[] = [
    {
      icon: <Wallet size={20} />,
      label: t('nav.accounts'),
      path: '/comptes',
      isActive: isActive('/comptes')
    },
    {
      icon: <ChartLine size={20} />,
      label: t('nav.cash_flow'),
      path: '/cash-flow',
      isActive: isActive('/cash-flow')
    }
  ];
  
  const forecastItems: SidebarItemProps[] = [
    {
      icon: <ArrowUpCircle size={20} />,
      label: t('nav.receipts_new'),
      path: '/encaissements',
      isActive: isActive('/encaissements')
    },
    {
      icon: <ArrowDownCircle size={20} />,
      label: t('nav.expenses_new'),
      path: '/decaissements',
      isActive: isActive('/decaissements')
    }
  ];

  const transactionsItems: SidebarItemProps[] = [
    {
      icon: <FileText size={20} />,
      label: t('nav.transactions'),
      path: '/transactions',
      isActive: isActive('/transactions')
    },
    {
      icon: <Banknote size={20} />,
      label: t('nav.debt'),
      path: '/debt-management',
      isActive: isActive('/debt-management')
    }
  ];

  const projectTrackingItems: SidebarItemProps[] = [
    {
      icon: <FolderKanban size={20} />,
      label: t('nav.projects'),
      path: '/projets',
      isActive: isActive('/projets')
    },
    {
      icon: <Target size={20} />,
      label: t('nav.objectives'),
      path: '/objectifs',
      isActive: isActive('/objectifs')
    }
  ];

  const reportsItems: SidebarItemProps[] = [
    {
      icon: <FileSpreadsheet size={20} />,
      label: t('nav.reports'),
      path: '/rapports',
      isActive: isActive('/rapports')
    }
  ];

  const renderSidebarItem = (item: SidebarItemProps) => (
    <div 
      key={item.path} 
      className={cn(
        "flex items-center px-3 py-2.5 mx-2 cursor-pointer rounded-lg transition-all duration-200 group",
        item.isActive 
          ? "bg-blue-100 text-blue-700 border-l-3 border-blue-600 shadow-sm" 
          : "text-slate-700 hover:bg-slate-100/50 hover:text-slate-900"
      )}
      onClick={() => handleNavigation(item.path)}
    >
      <div className={cn(
        "flex items-center justify-center transition-colors min-w-[20px]",
        item.isActive ? "text-blue-700" : "text-slate-500 group-hover:text-slate-700"
      )}>
        {item.icon}
      </div>
      {isExpanded && <span className="ml-3 text-sm font-medium">{item.label}</span>}
    </div>
  );

  return (
    <div 
      className="fixed left-0 top-0 h-full bg-slate-50 border-r border-slate-200 z-50 transition-all duration-300 flex flex-col shadow-sm"
      style={{ width: isExpanded ? '280px' : '70px' }}
    >
      {/* Header with toggle button */}
      <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-100/50">
        {isExpanded ? (
          <>
            <h1 className="text-xl font-bold text-slate-800">Trezo</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            >
              <X size={18} />
            </Button>
          </>
        ) : (
          <div className="flex justify-center w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            >
              <Menu size={18} />
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Dashboard (no section) */}
        {renderSidebarItem(dashboardItem)}
        
        {/* Superadmin section (only for kamel) */}
        {isSuperAdmin && (
          <>
            <div className="my-4 mx-4">
              <div className="h-px bg-slate-200"></div>
            </div>
            {renderSidebarItem(superadminItem)}
          </>
        )}
        
        <div className="my-4 mx-4">
          <div className="h-px bg-slate-200"></div>
        </div>
        
        {/* Only show sections when expanded */}
        {isExpanded && (
          <>
            {/* GESTION DE TRÉSORERIE section */}
            <div className="mb-2">
              <SidebarSection label={t('nav.cash_management')}>
                {treasuryManagementItems.map(renderSidebarItem)}
              </SidebarSection>
            </div>
            
            {/* PRÉVISIONS section */}
            <div className="mb-2">
              <SidebarSection label={t('nav.forecasts')}>
                {forecastItems.map(renderSidebarItem)}
              </SidebarSection>
            </div>
            
            {/* TRANSACTIONS section */}
            <div className="mb-2">
              <SidebarSection label={t('nav.transactions_section')}>
                {transactionsItems.map(renderSidebarItem)}
              </SidebarSection>
            </div>
            
            {/* SUIVI PAR PROJET section */}
            <div className="mb-2">
              <SidebarSection label={t('nav.project_tracking')}>
                {projectTrackingItems.map(renderSidebarItem)}
              </SidebarSection>
            </div>
            
            {/* RAPPORTS section */}
            <div className="mb-2">
              <SidebarSection label={t('nav.reports_config')}>
                {reportsItems.map(renderSidebarItem)}
              </SidebarSection>
            </div>
          </>
        )}
        
        {/* Settings section (for admin and superadmin) */}
        {isAdmin && (
          <>
            <div className="my-4 mx-4">
              <div className="h-px bg-slate-200"></div>
            </div>
            {renderSidebarItem(settingsItem)}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
