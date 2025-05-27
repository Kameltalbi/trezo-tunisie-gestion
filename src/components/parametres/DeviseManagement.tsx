
import React, { useState } from "react";
import { Trash2, Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useDevises, useCreateDevise, useUpdateDevise, useDeleteDevise } from "@/hooks/useDevises";
import SectionBox from "@/components/SectionBox";

interface DeviseFormData {
  nom: string;
  symbole: string;
  code: string;
  decimales: number;
  separateur: string;
  is_default: boolean;
}

const DeviseManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<DeviseFormData>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { data: devises = [], isLoading: loadingDevises } = useDevises();
  const createDeviseMutation = useCreateDevise();
  const updateDeviseMutation = useUpdateDevise();
  const deleteDeviseMutation = useDeleteDevise();

  const openModal = (isEdit = false, item: any = null) => {
    setForm(item || {});
    setModalOpen(true);
    setIsEditing(isEdit);
    setCurrentItemId(item ? item.id : null);
  };

  const closeModal = () => {
    setForm({});
    setModalOpen(false);
    setIsEditing(false);
    setCurrentItemId(null);
  };

  const handleSave = async () => {
    try {
      const deviseData = {
        nom: form.nom || '',
        symbole: form.symbole || '',
        code: form.code || form.nom?.substring(0, 3).toUpperCase() || '',
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

      closeModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({ description: "Erreur lors de la sauvegarde", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDeviseMutation.mutateAsync(id);
      toast({ description: "Devise supprimée avec succès" });
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

  if (loadingDevises) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <>
      <SectionBox 
        title="Devises" 
        onAdd={() => openModal()}
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
                      onClick={() => openModal(true, d)} 
                      size="icon" 
                      variant="ghost"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => handleDelete(d.id)} 
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

      <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier devise" : "Ajouter devise"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
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
              onChange={(e) => setForm({ ...form, decimales: Number(e.target.value) })} 
              className="w-full border p-2 rounded mb-3" 
            />
            <input 
              placeholder="Séparateur" 
              value={form.separateur || ""} 
              onChange={(e) => setForm({ ...form, separateur: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
            <div className="flex items-center space-x-2 mb-3">
              <input 
                type="checkbox" 
                id="is_default" 
                checked={form.is_default || false} 
                onChange={(e) => setForm({ ...form, is_default: e.target.checked })} 
              />
              <label htmlFor="is_default" className="text-sm font-medium">
                Définir comme devise par défaut
              </label>
            </div>
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
    </>
  );
};

export default DeviseManagement;
