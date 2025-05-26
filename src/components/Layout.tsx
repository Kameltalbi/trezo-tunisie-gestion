
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';
import TrialWatcher from './TrialWatcher';
import CustomBadge from './CustomBadge';

const Layout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <TrialWatcher />
          <Outlet />
        </main>
      </div>
      <CustomBadge />
    </div>
  );
};

export default Layout;
