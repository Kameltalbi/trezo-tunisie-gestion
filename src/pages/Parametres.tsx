
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Devise, Langue, Utilisateur, Periode, Permission } from "@/types/parametres";
import { Trash2, X, Plus, Edit } from "lucide-react";
import SectionBox from "@/components/SectionBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ParametresPage = () => {
  const [devises, setDevises] = useState<Devise[]>([]);
  const [langues, setLangues] = useState<Langue[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [periodes, setPeriodes] = useState<Periode[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [modalType, setModalType] = useState<null | string>(null);
  const [form, setForm] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  
  const { toast } = useToast();

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

  const handleSave = () => {
    const id = currentItemId || uuidv4();

    if (modalType === "devise") {
      const entry: Devise = {
        id,
        nom: form.nom,
        symbole: form.symbole,
        decimales: Number(form.decimales),
        separateur: form.separateur,
      };
      
      if (isEditing) {
        setDevises(devises.map(d => d.id === id ? entry : d));
        toast({ description: "Devise mise à jour avec succès", variant: "success" });
      } else {
        setDevises([...devises, entry]);
        toast({ description: "Devise ajoutée avec succès", variant: "success" });
      }
    }

    if (modalType === "langue") {
      const entry: Langue = { id, nom: form.nom };
      
      if (isEditing) {
        setLangues(langues.map(l => l.id === id ? entry : l));
        toast({ description: "Langue mise à jour avec succès", variant: "success" });
      } else {
        setLangues([...langues, entry]);
        toast({ description: "Langue ajoutée avec succès", variant: "success" });
      }
    }

    if (modalType === "utilisateur") {
      const entry: Utilisateur = { 
        id, 
        nom: form.nom,
        email: form.email,
        role: form.role
      };
      
      if (isEditing) {
        setUtilisateurs(utilisateurs.map(u => u.id === id ? entry : u));
        toast({ description: "Utilisateur mis à jour avec succès", variant: "success" });
      } else {
        setUtilisateurs([...utilisateurs, entry]);
        toast({ description: "Utilisateur ajouté avec succès", variant: "success" });
      }
    }

    if (modalType === "periode") {
      const entry: Periode = { 
        id, 
        debut: form.debut, 
        fin: form.fin 
      };
      
      if (isEditing) {
        setPeriodes(periodes.map(p => p.id === id ? entry : p));
        toast({ description: "Période mise à jour avec succès", variant: "success" });
      } else {
        setPeriodes([...periodes, entry]);
        toast({ description: "Période ajoutée avec succès", variant: "success" });
      }
    }

    if (modalType === "permission") {
      const entry: Permission = { 
        id, 
        page: form.page,
        description: form.description,
        admin: form.admin || false,
        editeur: form.editeur || false,
        collaborateur: form.collaborateur || false
      };
      
      if (isEditing) {
        setPermissions(permissions.map(p => p.id === id ? entry : p));
        toast({ description: "Permission mise à jour avec succès", variant: "success" });
      } else {
        setPermissions([...permissions, entry]);
        toast({ description: "Permission ajoutée avec succès", variant: "success" });
      }
    }

    closeModal();
  };

  const handleDelete = (id: string, type: string) => {
    const update = (data: any[]) => data.filter((d) => d.id !== id);
    
    if (type === "devise") {
      setDevises(update(devises));
      toast({ description: "Devise supprimée avec succès", variant: "success" });
    }
    if (type === "langue") {
      setLangues(update(langues));
      toast({ description: "Langue supprimée avec succès", variant: "success" });
    }
    if (type === "utilisateur") {
      setUtilisateurs(update(utilisateurs));
      toast({ description: "Utilisateur supprimé avec succès", variant: "success" });
    }
    if (type === "periode") {
      setPeriodes(update(periodes));
      toast({ description: "Période supprimée avec succès", variant: "success" });
    }
    if (type === "permission") {
      setPermissions(update(permissions));
      toast({ description: "Permission supprimée avec succès", variant: "success" });
    }
  };

  const togglePermission = (id: string, role: "admin" | "editeur" | "collaborateur") => {
    setPermissions(
      permissions.map((p) => {
        if (p.id === id) {
          return { ...p, [role]: !p[role] };
        }
        return p;
      })
    );
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
      case "langue":
        return (
          <input 
            placeholder="Nom" 
            value={form.nom || ""} 
            onChange={(e) => setForm({ ...form, nom: e.target.value })} 
            className="w-full border p-2 rounded mb-3" 
          />
        );
      case "utilisateur":
        return (
          <>
            <input 
              placeholder="Nom" 
              value={form.nom || ""} 
              onChange={(e) => setForm({ ...form, nom: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={form.email || ""} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
            <select 
              value={form.role || ""} 
              onChange={(e) => setForm({ ...form, role: e.target.value })} 
              className="w-full border p-2 rounded mb-3"
            >
              <option value="">Sélectionner un rôle</option>
              <option value="Admin">Admin</option>
              <option value="Collaborateur">Collaborateur</option>
              <option value="Consultant">Consultant</option>
            </select>
          </>
        );
      case "periode":
        return (
          <>
            <input 
              type="date" 
              placeholder="Début" 
              value={form.debut || ""} 
              onChange={(e) => setForm({ ...form, debut: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
            <input 
              type="date" 
              placeholder="Fin" 
              value={form.fin || ""} 
              onChange={(e) => setForm({ ...form, fin: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
          </>
        );
      case "permission":
        return (
          <>
            <input 
              placeholder="Nom de la page" 
              value={form.page || ""} 
              onChange={(e) => setForm({ ...form, page: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
            <input 
              placeholder="Description" 
              value={form.description || ""} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              className="w-full border p-2 rounded mb-3" 
            />
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="admin" 
                  checked={form.admin || false} 
                  onCheckedChange={(checked) => setForm({ ...form, admin: !!checked })}
                />
                <label htmlFor="admin" className="text-sm">Admin</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="editeur" 
                  checked={form.editeur || false} 
                  onCheckedChange={(checked) => setForm({ ...form, editeur: !!checked })}
                />
                <label htmlFor="editeur" className="text-sm">Éditeur</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="collaborateur" 
                  checked={form.collaborateur || false} 
                  onCheckedChange={(checked) => setForm({ ...form, collaborateur: !!checked })}
                />
                <label htmlFor="collaborateur" className="text-sm">Collaborateur</label>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Tabs section for different parameter types
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      
      <Tabs defaultValue="devises" className="w-full">
        <TabsList className="w-full grid grid-cols-5 mb-6">
          <TabsTrigger value="devises">Devises</TabsTrigger>
          <TabsTrigger value="langues">Langues</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
          <TabsTrigger value="periodes">Périodes</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
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
                    <th className="p-2">Décimales</th>
                    <th className="p-2">Millier</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devises.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="p-2">{d.nom}</td>
                      <td className="p-2">{d.symbole}</td>
                      <td className="p-2">{d.decimales}</td>
                      <td className="p-2">{d.separateur}</td>
                      <td className="p-2 flex space-x-2">
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
        
        {/* Langues Content */}
        <TabsContent value="langues">
          <SectionBox 
            title="Langues" 
            onAdd={() => openModal("langue")}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="p-2">Nom</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {langues.map((l) => (
                    <tr key={l.id} className="border-t">
                      <td className="p-2">{l.nom}</td>
                      <td className="p-2 flex space-x-2">
                        <Button 
                          onClick={() => openModal("langue", true, l)} 
                          size="icon" 
                          variant="ghost"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(l.id, "langue")} 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500"
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
        
        {/* Utilisateurs Content */}
        <TabsContent value="utilisateurs">
          <SectionBox 
            title="Utilisateurs" 
            onAdd={() => openModal("utilisateur")}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="p-2">Nom</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Rôle</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {utilisateurs.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="p-2">{u.nom}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.role}</td>
                      <td className="p-2 flex space-x-2">
                        <Button 
                          onClick={() => openModal("utilisateur", true, u)} 
                          size="icon" 
                          variant="ghost"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(u.id, "utilisateur")} 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500"
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
        
        {/* Périodes Content */}
        <TabsContent value="periodes">
          <SectionBox 
            title="Périodes comptables" 
            onAdd={() => openModal("periode")}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="p-2">Début</th>
                    <th className="p-2">Fin</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {periodes.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="p-2">{p.debut}</td>
                      <td className="p-2">{p.fin}</td>
                      <td className="p-2 flex space-x-2">
                        <Button 
                          onClick={() => openModal("periode", true, p)} 
                          size="icon" 
                          variant="ghost"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(p.id, "periode")} 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500"
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
            title="Permissions" 
            onAdd={() => openModal("permission")}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="p-2">Page</th>
                    <th className="p-2 text-center">Admin</th>
                    <th className="p-2 text-center">Éditeur</th>
                    <th className="p-2 text-center">Collaborateur</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="p-2">
                        <div>
                          <div>{p.page}</div>
                          <div className="text-xs text-gray-500">{p.description}</div>
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center">
                          <Checkbox 
                            checked={p.admin} 
                            onCheckedChange={() => togglePermission(p.id, "admin")} 
                          />
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center">
                          <Checkbox 
                            checked={p.editeur} 
                            onCheckedChange={() => togglePermission(p.id, "editeur")} 
                          />
                        </div>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center">
                          <Checkbox 
                            checked={p.collaborateur} 
                            onCheckedChange={() => togglePermission(p.id, "collaborateur")} 
                          />
                        </div>
                      </td>
                      <td className="p-2 flex space-x-2">
                        <Button 
                          onClick={() => openModal("permission", true, p)} 
                          size="icon" 
                          variant="ghost"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(p.id, "permission")} 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500"
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
            <Button onClick={handleSave}>
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParametresPage;
