
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { User as UserType } from "../types";

const Parametres = () => {
  const { user, updateUser, logout, isLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<{
    nom: string;
    email: string;
    role: "admin" | "utilisateur";
  }>({
    nom: user?.nom || "",
    email: user?.email || "",
    role: user?.role || "utilisateur",
  });

  const handleUpdate = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await updateUser({
        ...formData,
      });
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  if (!user) return null;

  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-500">
            Gérez vos informations personnelles et préférences
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Profil utilisateur</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center p-4">
                <div className="bg-emerald-100 rounded-full p-6">
                  <User className="h-12 w-12 text-emerald-600" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    placeholder="Votre nom"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "utilisateur") =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="utilisateur">Utilisateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Enregistrer les modifications"
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Session</CardTitle>
              <CardDescription>
                Gérez votre session actuelle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Parametres;
