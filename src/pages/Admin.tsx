
import React, { useState } from 'react';
import { AdminUsersTable } from '@/components/admin/AdminUsersTable';
import { useUserRoleCheck } from '@/hooks/useUserRoleCheck';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: roleData } = useUserRoleCheck();
  const isSuperAdmin = roleData?.isSuperAdmin || false;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Administration</h1>
      <AdminUsersTable 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
};

export default Admin;
