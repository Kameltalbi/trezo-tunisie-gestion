import React, { useState } from "react";
import { Trash2, Edit, Plus, Check } from "lucide-react";
import SectionBox from "@/components/SectionBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useDevises, useCreateDevise, useUpdateDevise, useDeleteDevise } from "@/hooks/useDevises";
import { useUserRoles, usePermissions } from "@/hooks/useUserRoles";

const ParametresPage = () => {
  const [modalType, setModalType] = useState<null | string>(null);
  const [form, setForm] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Hooks pour les données Supabase
  const { data: devises = [], isLoading: loadingDevises } = useDevises();
  const { data: permissions = [], isLoading: loadingPermissions } = usePermissions();
  const { data: userRoles = [], isLoading: loadingRoles } = useUserRoles();
  
  // Mutations pour les devises
  const createDeviseMutation = useCreateDevise();
  const updateDeviseMutation = useUpdateDevise();
  const deleteDeviseMutation = useDeleteDevise();

  const openModal = (type: string, isEdit = false, item: any = null) => {
    setForm(item || {});
    setModalType(type);
    setIsEditing(isEdit);
    if (item) {
      setCurrentItemId(item.id);
    } else {
      setCurrentItemId(null);
    }
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
        
        if (isEditing && currentItemId) {
          await updateDeviseMutation.mutateAsync({ id: currentItemId, ...deviseData });
          toast({ description: "Devise mise à jour avec succès" });
        } else {
          await createDeviseMutation.mutateAsync(deviseData);
          toast({ description: "Devise ajoutée avec succès" });
        }
      }
      
      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({ 
        description: "Erreur lors de la sauvegarde", 
        variant: "destructive" 
      });
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
      toast({ 
        description: "Erreur lors de la suppression", 
        variant: "destructive" 
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await updateDeviseMutation.mutateAsync({ 
        id, 
        is_default: true 
      });
      toast({ description: "Devise définie par défaut avec succès" });
    } catch (error) {
      console.error('Erreur lors de la définition de la devise par défaut:', error);
      toast({ 
        description: "Erreur lors de la définition de la devise par défaut", 
        variant: "destructive" 
      });
    }
  };

  const renderFormFields = () => {
    switch (modalType) {
      case "devise":
        return (
          <>
            <input 
              placeholder="Nom" 
              value={form.nom || ""} 
              onChange={(e) => setForm({ ...form, nom: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
            <input 
              placeholder="Symbole" 
              value={form.symbole || ""} 
              onChange={(e) => setForm({ ...form, symbole: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
            <input 
              placeholder="Code (ex: TND)" 
              value={form.code || ""} 
              onChange={(e) => setForm({ ...form, code: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
            <input 
              type="number" 
              placeholder="Décimales" 
              value={form.decimales || ""} 
              onChange={(e) => setForm({ ...form, decimales: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
            <input 
              placeholder="Séparateur" 
              value={form.separateur || ""} 
              onChange={(e) => setForm({ ...form, separateur: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
          </>
        );
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
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      
      <Tabs defaultValue="devises" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="devises">Devises</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs & Entreprises</TabsTrigger>
        </TabsList>
        
        {/* Devises Content */}
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
                  {devises.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="p-2">{d.nom}</td>
                      <td className="p-2">{d.symbole}</td>
                      <td className="p-2">{d.code}</td>
                      <td className="p-2">{d.decimales}</td>
                      <td className="p-2">{d.separateur}</td>
                      <td className="p-2">{d.is_default ? "Oui" : "Non"}</td>
                      <td className="p-2 flex space-x-2">
                        {!d.is_default && (
                          <Button 
                            onClick={() => handleSetDefault(d.id)} 
                            size="icon" 
                            variant="ghost"
                            title="Définir par défaut"
                          >
                            <Check className="w-4 h-4 text-green-500" />
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
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBox>
        </TabsContent>
        
        {/* Permissions Content */}
        <TabsContent value="permissions">
          <SectionBox 
            title="Permissions du système"
            onAdd={() => {}} // Add empty function since permissions are read-only
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="p-2">Nom</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Page</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="p-2">{p.nom}</td>
                      <td className="p-2">{p.description}</td>
                      <td className="p-2">{p.page}</td>
                      <td className="p-2">{p.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBox>
        </TabsContent>

        {/* Utilisateurs & Entreprises Content */}
        <TabsContent value="utilisateurs">
          <SectionBox 
            title="Utilisateurs & Entreprises"
            onAdd={() => {}}
          >
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
                  {userRoles.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="p-2">{u.email || '-'}</td>
                      <td className="p-2">{u.full_name || '-'}</td>
                      <td className="p-2">{u.company_name || '-'}</td>
                      <td className="p-2">{u.role}</td>
                      <td className="p-2 flex space-x-2">
                        <Button 
                          onClick={() => openModal("user", true, u)} 
                          size="icon" 
                          variant="ghost"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBox>
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <Dialog open={!!modalType} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? `Modifier ${modalType}` : `Ajouter ${modalType}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {renderFormFields()}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={createDeviseMutation.isPending || updateDeviseMutation.isPending}
            >
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParametresPage;
