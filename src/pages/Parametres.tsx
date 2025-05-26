import React, { useState } from "react";
import { Trash2, Edit, Plus, Check, UserPlus } from "lucide-react";
import SectionBox from "@/components/SectionBox";
import UserInvitationForm from "@/components/UserInvitationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useDevises, useCreateDevise, useUpdateDevise, useDeleteDevise } from "@/hooks/useDevises";
import { useUserRoles, usePermissions, useUpdateUserRole, UserRole } from "@/hooks/useUserRoles";
import { useUserPermissions } from "@/hooks/useUserPermissions";

const ParametresPage = () => {
  const [modalType, setModalType] = useState<null | string>(null);
  const [form, setForm] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const { data: devises = [], isLoading: loadingDevises } = useDevises();
  const { data: permissions = [], isLoading: loadingPermissions } = usePermissions();
  const { data: userRoles = [], isLoading: loadingRoles } = useUserRoles();
  const { data: userPermissions } = useUserPermissions();

  const createDeviseMutation = useCreateDevise();
  const updateDeviseMutation = useUpdateDevise();
  const deleteDeviseMutation = useDeleteDevise();
  const updateUserRoleMutation = useUpdateUserRole();

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

  if (loadingDevises || loadingPermissions || loadingRoles) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
        <div className="text-center py-8">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ...le reste du contenu de la page est inchangé et peut rester tel quel */}
    </div>
  );
};

export default ParametresPage;
