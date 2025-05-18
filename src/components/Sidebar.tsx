
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Banknote, FileText, LayoutDashboard, Settings, DollarSign, ChartLine } from 'lucide-react';

import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider
} from "@/components/ui/sidebar";

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider>
      <SidebarUI>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t('nav.main_menu')}</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                  <Link to="/dashboard">
                    <LayoutDashboard size={20} />
                    <span>{t('nav.dashboard')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Cash Management Section with Sub Menu */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/cash-management')}>
                  <Link to="/cash-management">
                    <Banknote size={20} />
                    <span>{t('nav.cash_management')}</span>
                  </Link>
                </SidebarMenuButton>

                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive('/recettes')}>
                      <Link to="/recettes">
                        <FileText size={18} />
                        <span>{t('nav.receipts')}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive('/depenses')}>
                      <Link to="/depenses">
                        <DollarSign size={18} />
                        <span>{t('nav.expenses')}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive('/cash-flow')}>
                      <Link to="/cash-flow">
                        <ChartLine size={18} />
                        <span>{t('nav.cash_flow')}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive('/debt-management')}>
                      <Link to="/debt-management">
                        <DollarSign size={18} />
                        <span>{t('nav.debt')}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/parametres')}>
                  <Link to="/parametres">
                    <Settings size={20} />
                    <span>{t('nav.parametres')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </SidebarUI>
    </SidebarProvider>
  );
};

export default Sidebar;
