import React, { useState } from "react";
import { Trash2, Edit, Plus, Check, UserPlus } from "lucide-react";
import SectionBox from "@/components/SectionBox";
import UserInvitationForm from "@/components/UserInvitationForm";
import UserPermissionsManager from "@/components/UserPermissionsManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDevises, useCreateDevise, useUpdateDevise, useDeleteDevise } from "@/hooks/useDevises";
import { useUserRoles, useUpdateUserRole, UserRole } from "@/hooks/useUserRoles";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { useDeletePermissions, useToggleDeletePermission } from "@/hooks/useDeletePermissions";

const ParametresPage = () => {
  const [modalType, setModalType] = useState<null | string>(null);
  const [form, setForm] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const { data: devises = [], isLoading: loadingDevises } = useDevises();
  const { data: userRoles = [], isLoading: loadingRoles } = useUserRoles();
  const { data: userPermissions } = useUserPermissions();
  const { data: deletePermissions = [], isLoading: loadingPermissions } = useDeletePermissions();

  const createDeviseMutation = useCreateDevise();
  const updateDeviseMutation = useUpdateDevise();
  const deleteDeviseMutation = useDeleteDevise();
  const updateUserRoleMutation = useUpdateUserRole();
  const togglePermissionMutation = useToggleDeletePermission();

  // Liste des pages du système avec noms d'affichage
  const getPageDisplayName = (page: string) => {
    const pageNames: Record<string, string> = {
      'dashboard': 'Tableau de bord',
      'transactions': 'Transactions',
      'encaissements': 'Encaissements',
      'decaissements': 'Décaissements',
      'comptes': 'Comptes bancaires',
      'projets': 'Projets',
      'objectifs': 'Objectifs',
      'cash-flow': 'Flux de trésorerie',
      'debt-management': 'Gestion des dettes',
      'rapports': 'Rapports',
      'parametres': 'Paramètres',
      'admin': 'Administration',
      'support': 'Support'
    };
    return pageNames[page] || page;
  };

  const openModal = (type: string, isEdit = false, item: any = null) => {
    setForm(item || {});
    setModalType(type);
    setIsEditing(isEdit);
    setCurrentItemId(item ? item.id : null);
  };

  const closeModal = () => {
    setForm({});
    setModalType(null);
    setIsEditing(false);
    setCurrentItemId(null);
    setSelectedUserId(null);
  };

  const handleSave = async () => {
    try {
      if (modalType === "devise") {
        const deviseData = {
          nom: form.nom,
          symbole: form.symbole,
          code: form.code || form.nom?.substring(0, 3).toUpperCase(),
          decimales: Number(form.decimales) || 2,
          separateur: form.separateur || ',',
          is_default: form.is_default || false,
        };

        if (deviseData.is_default) {
          const currentDefault = devises.find(d => d.is_default && d.id !== currentItemId);
          if (currentDefault) {
            await updateDeviseMutation.mutateAsync({ id: currentDefault.id, is_default: false });
          }
        }

        if (isEditing && currentItemId) {
          await updateDeviseMutation.mutateAsync({ id: currentItemId, ...deviseData });
          toast({ description: "Devise mise à jour avec succès" });
        } else {
          await createDeviseMutation.mutateAsync(deviseData);
          toast({ description: "Devise ajoutée avec succès" });
        }
      } else if (modalType === "user_role") {
        if (form.user_id && form.role) {
          await updateUserRoleMutation.mutateAsync({ 
            userId: form.user_id, 
            role: form.role as UserRole 
          });
          toast({ description: "Rôle utilisateur mis à jour avec succès" });
        }
      }

      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({ description: "Erreur lors de la sauvegarde", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, type: string) => {
    try {
      if (type === "devise") {
        await deleteDeviseMutation.mutateAsync(id);
        toast({ description: "Devise supprimée avec succès" });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({ description: "Erreur lors de la suppression", variant: "destructive" });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const currentDefault = devises.find(d => d.is_default);
      if (currentDefault && currentDefault.id !== id) {
        await updateDeviseMutation.mutateAsync({ 
          id: currentDefault.id, 
          is_default: false 
        });
      }
      
      await updateDeviseMutation.mutateAsync({ 
        id, 
        is_default: true 
      });
      
      toast({ description: "Devise définie par défaut avec succès" });
    } catch (error) {
      console.error('Erreur lors de la définition de la devise par défaut:', error);
      toast({ description: "Erreur lors de la définition de la devise par défaut", variant: "destructive" });
    }
  };

  const handlePermissionToggle = async (permissionId: string, granted: boolean) => {
    try {
      await togglePermissionMutation.mutateAsync({ permissionId, granted });
      toast({ 
        description: granted ? "Permission accordée" : "Permission révoquée" 
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la permission:', error);
      toast({ 
        description: "Erreur lors de la mise à jour de la permission", 
        variant: "destructive" 
      });
    }
  };

  const renderFormFields = () => {
    switch (modalType) {
      case "devise":
        return (
          <>
            <input placeholder="Nom" value={form.nom || ""} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full border p-2 rounded mb-3" />
            <input placeholder="Symbole" value={form.symbole || ""} onChange={(e) => setForm({ ...form, symbole: e.target.value })} className="w-full border p-2 rounded mb-3" />
            <input placeholder="Code (ex: TND)" value={form.code || ""} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full border p-2 rounded mb-3" />
            <input type="number" placeholder="Décimales" value={form.decimales || ""} onChange={(e) => setForm({ ...form, decimales: e.target.value })} className="w-full border p-2 rounded mb-3" />
            <input placeholder="Séparateur" value={form.separateur || ""} onChange={(e) => setForm({ ...form, separateur: e.target.value })} className="w-full border p-2 rounded mb-3" />
            <div className="flex items-center space-x-2 mb-3">
              <input type="checkbox" id="is_default" checked={form.is_default || false} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
              <label htmlFor="is_default" className="text-sm font-medium">Définir comme devise par défaut</label>
            </div>
          </>
        );
      case "user_role":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Utilisateur</label>
              <input value={form.email || ""} disabled className="w-full border p-2 rounded bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rôle</label>
              <Select value={form.role || ""} onValueChange={(value) => setForm({ ...form, role: value })}>
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
        );
      case "user":
        return <UserInvitationForm onSuccess={closeModal} onCancel={closeModal} />;
      default:
        return null;
    }
  };

  if (loadingDevises || loadingRoles || loadingPermissions) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
        <div className="text-center py-8">Chargement...</div>
      </div>
    );
  }

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
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="devises">Devises</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs & Rôles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions de suppression</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devises">
          <SectionBox 
            title="Devises" 
            onAdd={() => openModal("devise")}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="p-2">Nom</th>
                    <th className="p-2">Symbole</th>
                    <th className="p-2">Code</th>
                    <th className="p-2">Décimales</th>
                    <th className="p-2">Séparateur</th>
                    <th className="p-2">Défaut</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devises.length > 0 ? devises.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="p-2">{d.nom}</td>
                      <td className="p-2">{d.symbole}</td>
                      <td className="p-2">{d.code}</td>
                      <td className="p-2">{d.decimales}</td>
                      <td className="p-2">{d.separateur}</td>
                      <td className="p-2">
                        {d.is_default ? (
                          <Badge variant="default">Par défaut</Badge>
                        ) : (
                          <span className="text-gray-500">Non</span>
                        )}
                      </td>
                      <td className="p-2 flex space-x-2">
                        {!d.is_default && (
                          <Button 
                            onClick={() => handleSetDefault(d.id)} 
                            size="sm" 
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Définir par défaut
                          </Button>
                        )}
                        <Button 
                          onClick={() => openModal("devise", true, d)} 
                          size="icon" 
                          variant="ghost"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(d.id, "devise")} 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500"
                          disabled={d.is_default}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        Aucune devise configurée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionBox>
        </TabsContent>
        
        <TabsContent value="utilisateurs">
          <SectionBox 
            title="Utilisateurs & Rôles"
            onAdd={userPermissions?.canAddUsers ? () => openModal("user") : undefined}
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
                            onClick={() => openModal("user_role", true, u)} 
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
        </TabsContent>

        <TabsContent value="permissions">
          <SectionBox title="Permissions de suppression par page">
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Cochez les pages sur lesquelles vous souhaitez avoir le droit de supprimer des éléments.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deletePermissions.map((permission) => (
                  <div 
                    key={permission.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      checked={permission.hasPermission}
                      onCheckedChange={(checked) => 
                        handlePermissionToggle(permission.id, checked as boolean)
                      }
                      disabled={togglePermissionMutation.isPending}
                    />
                    <span className="font-medium">
                      {getPageDisplayName(permission.page)}
                    </span>
                  </div>
                ))}
              </div>

              {deletePermissions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune permission de suppression trouvée.
                </div>
              )}
            </div>
          </SectionBox>
        </TabsContent>
      </Tabs>

      <Dialog open={!!modalType} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {modalType === "user" ? "Inviter un utilisateur" : 
               isEditing ? `Modifier ${modalType}` : `Ajouter ${modalType}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {renderFormFields()}
          </div>
          
          {modalType !== "user" && (
            <DialogFooter>
              <Button variant="outline" onClick={closeModal}>
                Annuler
              </Button>
              <Button 
                onClick={handleSave}
                disabled={createDeviseMutation.isPending || updateDeviseMutation.isPending || updateUserRoleMutation.isPending}
              >
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParametresPage;
