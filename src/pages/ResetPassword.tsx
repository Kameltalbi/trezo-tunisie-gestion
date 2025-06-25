
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("L'email est requis");
      return;
    }

    setIsLoading(true);

    try {
      // Simulation d'envoi d'email de réinitialisation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      toast.success("Instructions envoyées par email !");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation:", error);
      setError("Erreur lors de l'envoi de l'email de réinitialisation");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
        <Card className="shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Email envoyé !</h2>
            <p className="text-gray-600">
              Vérifiez votre boîte email pour les instructions de réinitialisation.
            </p>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/lovable-uploads/c6044d18-b9a5-4f10-9c00-f04817874a0e.png" 
            alt="Trézo" 
            className="h-24 w-auto mb-4"
          />
          <p className="text-gray-500 text-center">Réinitialiser votre mot de passe</p>
        </div>
        
        <Card className="shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
            <CardDescription>
              Entrez votre email pour recevoir les instructions
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
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer les instructions"
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Retour à la connexion
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default ResetPassword;
