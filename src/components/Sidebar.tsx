
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
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors group">
        <span className="uppercase tracking-wider">{label}</span>
        {isOpen ? (
          <ChevronDown size={14} className="group-hover:text-gray-700" />
        ) : (
          <ChevronRight size={14} className="group-hover:text-gray-700" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
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
        "flex items-center px-4 py-2.5 mx-2 cursor-pointer rounded-lg transition-all duration-200 group",
        item.isActive 
          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
      onClick={() => handleNavigation(item.path)}
    >
      <div className={cn(
        "flex items-center justify-center transition-colors",
        item.isActive ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"
      )}>
        {item.icon}
      </div>
      <span className="ml-3 text-sm font-medium">{item.label}</span>
    </div>
  );

  return (
    <div 
      className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col shadow-sm"
      style={{ width: isExpanded ? '280px' : '70px' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        {isExpanded ? (
          <h1 className="text-xl font-bold text-gray-900">Trezo</h1>
        ) : (
          <h1 className="text-xl font-bold text-gray-900">T</h1>
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
              <div className="h-px bg-gray-200"></div>
            </div>
            {renderSidebarItem(superadminItem)}
          </>
        )}
        
        <div className="my-4 mx-4">
          <div className="h-px bg-gray-200"></div>
        </div>
        
        {/* GESTION DE TRÉSORERIE section */}
        {isExpanded && (
          <div className="mb-4">
            <SidebarSection label={t('nav.cash_management')}>
              {treasuryManagementItems.map(renderSidebarItem)}
            </SidebarSection>
          </div>
        )}
        
        {/* PRÉVISIONS section */}
        {isExpanded && (
          <div className="mb-4">
            <SidebarSection label={t('nav.forecasts')}>
              {forecastItems.map(renderSidebarItem)}
            </SidebarSection>
          </div>
        )}
        
        {/* TRANSACTIONS section */}
        {isExpanded && (
          <div className="mb-4">
            <SidebarSection label={t('nav.transactions_section')}>
              {transactionsItems.map(renderSidebarItem)}
            </SidebarSection>
          </div>
        )}
        
        {/* SUIVI PAR PROJET section */}
        {isExpanded && (
          <div className="mb-4">
            <SidebarSection label={t('nav.project_tracking')}>
              {projectTrackingItems.map(renderSidebarItem)}
            </SidebarSection>
          </div>
        )}
        
        {/* RAPPORTS section */}
        {isExpanded && (
          <div className="mb-4">
            <SidebarSection label={t('nav.reports_config')}>
              {reportsItems.map(renderSidebarItem)}
            </SidebarSection>
          </div>
        )}
        
        {/* Settings section (for admin and superadmin) */}
        {isAdmin && (
          <>
            <div className="my-4 mx-4">
              <div className="h-px bg-gray-200"></div>
            </div>
            {renderSidebarItem(settingsItem)}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
