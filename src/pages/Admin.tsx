
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { User } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de chargement des utilisateurs depuis une API
    const loadUsers = async () => {
      setLoading(true);
      try {
        // Dans une vraie application, ceci serait un appel API à Supabase par exemple
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Utilisateurs fictifs pour la démo
        const demoUsers: User[] = [
          {
            id: "user-1",
            email: "demo@trezo.app",
            nom: "Utilisateur Demo",
            role: "utilisateur"
          },
          {
            id: "user-2",
            email: "admin@trezo.app",
            nom: "Administrateur",
            role: "admin"
          },
          {
            id: "user-3",
            email: "jean.dupont@exemple.fr",
            nom: "Jean Dupont",
            role: "utilisateur"
          }
        ];
        
        setUsers(demoUsers);
      } catch (error) {
        toast.error("Erreur lors du chargement des utilisateurs");
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  // Redirection si l'utilisateur n'est pas admin
  if (!user || user.role !== "admin") {
    toast.error("Accès non autorisé");
    return <Navigate to="/dashboard" replace />;
  }

  const handleRoleToggle = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(u => {
        if (u.id === userId) {
          const newRole = u.role === "admin" ? "utilisateur" : "admin";
          toast.success(`Rôle de ${u.nom} changé en ${newRole}`);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  return (
    <Layout requireAuth>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
            <p className="text-gray-500">Gérez les utilisateurs et les paramètres du système</p>
          </div>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Gestion des utilisateurs</CardTitle>
            <CardDescription>
              Administrez les comptes et les droits d'accès
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="py-4 flex justify-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 mb-4"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                  </div>
                </div>
              ) : (
                users.map((user) => (
                  <div 
                    key={user.id} 
                    className="flex items-center justify-between p-4 border rounded-lg bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${user.role === 'admin' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                        <UserIcon className={`h-5 w-5 ${user.role === 'admin' ? 'text-emerald-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium">{user.nom}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRoleToggle(user.id)}
                      >
                        Changer rôle
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Admin;
