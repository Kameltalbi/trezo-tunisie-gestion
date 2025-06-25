
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalAuth } from '@/contexts/LocalAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useLocalAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.full_name) {
      return user.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Utilisateur';
  };

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-6">
            {/* Date et heure */}
            <div className="flex flex-col text-sm">
              <span className="font-medium text-foreground">
                {formatDate(currentTime)}
              </span>
              <span className="text-muted-foreground">
                {formatTime(currentTime)}
              </span>
            </div>

            {/* Menu dropdown pour les options de thème */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {theme === 'light' && <Sun className="h-4 w-4" />}
                  {theme === 'dark' && <Moon className="h-4 w-4" />}
                  {theme === 'system' && <Monitor className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Clair</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Sombre</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>Système</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Menu utilisateur */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{getUserDisplayName()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {getUserDisplayName()}
                  </div>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
