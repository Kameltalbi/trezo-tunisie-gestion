
import React, { useState } from "react";
import { useLocalAuth } from "@/contexts/LocalAuthContext";
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const Register = () => {
  const { signUp, isLoading, error } = useLocalAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nom, setNom] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    // Validation des champs
    if (!email || !password || !nom || !nomEntreprise) {
      setLocalError("Tous les champs sont obligatoires");
      return;
    }

    if (password.length < 6) {
      setLocalError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      console.log("Tentative de création de compte...");
      await signUp(email, password, {
        nom,
        nomEntreprise,
      });
      console.log("Compte créé avec succès, redirection vers dashboard...");
      // La redirection est gérée automatiquement par le contexte
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la création du compte:", error);
      setLocalError(error instanceof Error ? error.message : "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-emerald-50 to-blue-50 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/c6044d18-b9a5-4f10-9c00-f04817874a0e.png" 
              alt="Trézo Logo" 
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl text-gray-900">Créer votre compte</CardTitle>
          <p className="text-gray-600">Commencez votre essai gratuit de 14 jours</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail *</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet *</Label>
              <Input
                id="nom"
                type="text"
                placeholder="Votre nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nomEntreprise">Nom de l'entreprise *</Label>
              <Input
                id="nomEntreprise"
                type="text"
                placeholder="Nom de votre entreprise"
                value={nomEntreprise}
                onChange={(e) => setNomEntreprise(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Répétez votre mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {(localError || error) && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-red-700 text-sm">{localError || error}</p>
              </div>
            )}

            <Button 
              disabled={isLoading} 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3"
            >
              {isLoading ? "Création du compte..." : "Créer mon compte gratuit"}
            </Button>
          </form>

          <div className="text-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 underline">
                Se connecter
              </Link>
            </p>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>✓ Essai gratuit de 14 jours</p>
            <p>✓ Aucune carte bancaire requise</p>
            <p>✓ Accès complet à toutes les fonctionnalités</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
