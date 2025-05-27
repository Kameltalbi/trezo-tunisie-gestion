
import React, { useState } from "react";
import { Edit, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserRoles, useUpdateUserRole, UserRole } from "@/hooks/useUserRoles";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import UserInvitationForm from "@/components/UserInvitationForm";
import SectionBox from "@/components/SectionBox";

interface UserRoleFormData {
  user_id: string;
  email: string;
  role: UserRole;
}

const UserRoleManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<UserRoleFormData>>({});
  
  const { toast } = useToast();
  const { data: userRoles = [], isLoading: loadingRoles } = useUserRoles();
  const { data: userPermissions } = useUserPermissions();
  const updateUserRoleMutation = useUpdateUserRole();

  const openModal = (user: any) => {
    setForm(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setForm({});
    setModalOpen(false);
  };

  const closeInviteModal = () => {
    setInviteModalOpen(false);
  };

  const handleSave = async () => {
    try {
      if (form.user_id && form.role) {
        await updateUserRoleMutation.mutateAsync({ 
          userId: form.user_id, 
          role: form.role as UserRole 
        });
        toast({ description: "Rôle utilisateur mis à jour avec succès" });
      }
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({ description: "Erreur lors de la sauvegarde", variant: "destructive" });
    }
  };

  if (loadingRoles) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <>
      <SectionBox 
        title="Utilisateurs & Rôles"
        onAdd={userPermissions?.canAddUsers ? () => setInviteModalOpen(true) : undefined}
        addButtonText={
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Inviter un utilisateur
          </div>
        }
      >
        {!userPermissions?.canAddUsers && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Limite d'utilisateurs atteinte ({userPermissions?.currentUsers}/{userPermissions?.maxUsers}). 
              Mettez à niveau votre plan pour ajouter plus d'utilisateurs.
            </p>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-2">Email</th>
                <th className="p-2">Nom</th>
                <th className="p-2">Entreprise</th>
                <th className="p-2">Rôle</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userRoles.length > 0 ? userRoles.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.email || '-'}</td>
                  <td className="p-2">{u.full_name || '-'}</td>
                  <td className="p-2">{u.company_name || '-'}</td>
                  <td className="p-2">
                    <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-2 flex space-x-2">
                    {userPermissions?.isAdmin && (
                      <Button 
                        onClick={() => openModal(u)} 
                        size="icon" 
                        variant="ghost"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionBox>

      <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le rôle utilisateur</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">Utilisateur</label>
              <input value={form.email || ""} disabled className="w-full border p-2 rounded bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rôle</label>
              <Select value={form.role || ""} onValueChange={(value) => setForm({ ...form, role: value as UserRole })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner un rôle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="editeur">Éditeur</SelectItem>
                  <SelectItem value="collaborateur">Collaborateur</SelectItem>
                  <SelectItem value="utilisateur">Utilisateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateUserRoleMutation.isPending}
            >
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteModalOpen} onOpenChange={(open) => !open && closeInviteModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inviter un utilisateur</DialogTitle>
          </DialogHeader>
          <UserInvitationForm onSuccess={closeInviteModal} onCancel={closeInviteModal} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserRoleManagement;
