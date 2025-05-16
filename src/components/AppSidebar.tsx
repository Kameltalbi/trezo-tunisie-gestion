
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  LayoutDashboard, 
  Banknote, 
  CreditCard,
  List,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Coins
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarProvider
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User } from "@/types";

type NavItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  requiredRoles?: Array<User["role"]>;
};

// Configuration des liens de navigation
const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Recettes",
    path: "/recettes",
    icon: Banknote
  },
  {
    title: "Dépenses",
    path: "/depenses",
    icon: CreditCard
  },
  {
    title: "Catégories",
    path: "/categories",
    icon: List
  },
  {
    title: "Paramètres",
    path: "/parametres",
    icon: Settings,
    requiredRoles: ["admin"]
  }
];

export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCompact, setIsCompact] = useState(false);
  
  // Vérifier si l'utilisateur peut voir un item en fonction de son rôle
  const canViewItem = (item: NavItem) => {
    if (!item.requiredRoles || item.requiredRoles.length === 0) return true;
    return user && item.requiredRoles.includes(user.role);
  };

  // Créer un item de navigation
  const NavMenuItem = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={isCompact ? item.title : undefined}
        >
          <Link to={item.path} className={cn("flex items-center")}>
            <item.icon className="size-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-500 text-white">
            <Coins className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-emerald-600">Trezo</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden md:flex"
          onClick={() => setIsCompact(!isCompact)}
        >
          {isCompact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {navItems.filter(canViewItem).map((item) => (
            <NavMenuItem key={item.path} item={item} />
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={logout}
            >
              <button>
                <LogOut className="size-4" />
                <span>Se déconnecter</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
