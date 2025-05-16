
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import Layout from "../components/Layout";

const Login = () => {
  const [email, setEmail] = useState<string>("demo@trezo.app");
  const [password, setPassword] = useState<string>("password");
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Connexion réussie !");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      // L'erreur sera gérée par le contexte d'authentification
    }
  };

  return (
    <Layout>
      <div className="min-h-[90vh] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3 rounded-xl shadow-md mb-4">
              <Coins size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Trezo</h1>
            <p className="text-gray-500 mt-1">Gestion de recettes</p>
          </div>
          
          <Card className="shadow-lg rounded-2xl border-slate-100">
            <CardHeader>
              <CardTitle className="text-xl">Connexion</CardTitle>
              <CardDescription>
                Connectez-vous pour accéder à votre tableau de bord
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col text-center text-sm text-muted-foreground">
              <p>
                Pour cette démo, utilisez:<br />
                <strong>Email:</strong> demo@trezo.app<br />
                <strong>Mot de passe:</strong> password
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
