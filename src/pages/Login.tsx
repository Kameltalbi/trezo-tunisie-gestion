
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Toaster } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("demo@trezo.app");
  const [password, setPassword] = useState<string>("password");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success(t("auth.login_success"));
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  const setDemoUser = () => {
    setEmail("demo@trezo.app");
    setPassword("password");
  };

  const setAdminUser = () => {
    setEmail("admin@trezo.app");
    setPassword("password");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/71b93732-45ea-4330-96cf-7bff5ea4f99a.png" 
              alt="Trézo" 
              className="h-24 w-auto"
            />
          </Link>
          <p className="text-gray-500 text-center">Connectez-vous à votre espace de gestion</p>
        </div>
        
        <Card className="shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t("auth.login")}</CardTitle>
            <CardDescription>
              Accédez à votre tableau de bord personnalisé
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
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Se souvenir de moi
                  </Label>
                </div>
                <a href="#" className="text-sm text-emerald-600 hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.login_loading")}
                  </>
                ) : (
                  t("auth.login_button")
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou essayez avec
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 w-full">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={setDemoUser}
              >
                <span className="mr-2">👤</span> Compte utilisateur standard
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={setAdminUser}
              >
                <span className="mr-2">🛡️</span> Compte administrateur
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <span>Pas encore de compte ?</span>
              <Link to="/register" className="text-emerald-600 hover:underline font-medium">
                Créer un compte
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;
