
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RolePermissionsTable from "@/components/RolePermissionsTable";
import UserPermissionsManager from "@/components/UserPermissionsManager";
import DeviseManagement from "@/components/parametres/DeviseManagement";
import UserRoleManagement from "@/components/parametres/UserRoleManagement";
import DeletePermissionsManagement from "@/components/parametres/DeletePermissionsManagement";
import SectionBox from "@/components/SectionBox";
import { useUserRoles } from "@/hooks/useUserRoles";

const ParametresPage = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: userRoles = [] } = useUserRoles();

  if (selectedUserId) {
    const selectedUser = userRoles.find(u => u.user_id === selectedUserId);
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <UserPermissionsManager
          userId={selectedUserId}
          userEmail={selectedUser?.email || 'Utilisateur inconnu'}
          onClose={() => setSelectedUserId(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

      <Tabs defaultValue="devises" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-6">
          <TabsTrigger value="devises">Devises</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs & Rôles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions utilisateur</TabsTrigger>
          <TabsTrigger value="role-permissions">Permissions par rôle</TabsTrigger>
        </TabsList>

        <TabsContent value="devises">
          <DeviseManagement />
        </TabsContent>

        <TabsContent value="utilisateurs">
          <UserRoleManagement />
        </TabsContent>

        <TabsContent value="permissions">
          <DeletePermissionsManagement />
        </TabsContent>

        <TabsContent value="role-permissions">
          <SectionBox title="Gestion des permissions par rôle">
            <RolePermissionsTable />
          </SectionBox>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParametresPage;
