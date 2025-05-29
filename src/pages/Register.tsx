
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, CheckCircle, Building2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Informations entreprise simplifiées
    nomEntreprise: "",
    adresseEntreprise: "",
    telephoneEntreprise: "",
    emailEntreprise: "",
    tva: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nom.trim()) {
      toast.error("Le nom est requis");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("L'email est requis");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("L'email n'est pas valide");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return false;
    }
    if (!formData.nomEntreprise.trim()) {
      toast.error("Le nom de l'entreprise est requis");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.nom,
            company_name: formData.nomEntreprise
          }
        }
      });

      if (authError) throw authError;

      // Si l'utilisateur est créé, créer l'entreprise
      if (authData.user) {
        const { error: entrepriseError } = await supabase
          .from('entreprises')
          .insert({
            user_id: authData.user.id,
            nom: formData.nomEntreprise,
            adresse: formData.adresseEntreprise || null,
            telephone: formData.telephoneEntreprise || null,
            email: formData.emailEntreprise || null,
            tva: formData.tva || null
          });

        if (entrepriseError) {
          console.error("Erreur lors de la création de l'entreprise:", entrepriseError);
          toast.error("Compte créé mais erreur lors de l'enregistrement de l'entreprise");
        } else {
          toast.success("Compte et entreprise créés avec succès !");
        }
      }
      
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setError(error instanceof Error ? error.message : "Erreur lors de la création du compte");
      toast.error("Erreur lors de la création du compte");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-yellow-500";
    if (strength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 1) return "Faible";
    if (strength <= 2) return "Moyen";
    if (strength <= 3) return "Bon";
    return "Fort";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center space-x-2 mb-4">
            <img 
              src="/lovable-uploads/71b93732-45ea-4330-96cf-7bff5ea4f99a.png" 
              alt="Trézo" 
              className="h-24 w-auto"
            />
          </Link>
          <p className="text-gray-500 text-center">Créez votre compte et commencez à gérer votre trésorerie</p>
        </div>
        
        <Card className="shadow-xl rounded-2xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Créer un compte</CardTitle>
            <CardDescription>
              Rejoignez-nous pour gérer votre trésorerie efficacement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {/* Section Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informations personnelles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom complet *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      type="text"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jean@entreprise.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
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
                    
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Force du mot de passe:</span>
                          <span className={`font-medium ${getStrengthColor(passwordStrength(formData.password)).replace('bg-', 'text-')}`}>
                            {getStrengthText(passwordStrength(formData.password))}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded ${
                                level <= passwordStrength(formData.password)
                                  ? getStrengthColor(passwordStrength(formData.password))
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">Les mots de passe correspondent</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Informations entreprise simplifiée */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informations entreprise
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomEntreprise">Nom de l'entreprise *</Label>
                    <Input
                      id="nomEntreprise"
                      name="nomEntreprise"
                      type="text"
                      value={formData.nomEntreprise}
                      onChange={handleChange}
                      placeholder="Ma Super Entreprise"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailEntreprise">Email entreprise</Label>
                    <Input
                      id="emailEntreprise"
                      name="emailEntreprise"
                      type="email"
                      value={formData.emailEntreprise}
                      onChange={handleChange}
                      placeholder="contact@entreprise.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresseEntreprise">Adresse de l'entreprise</Label>
                  <Input
                    id="adresseEntreprise"
                    name="adresseEntreprise"
                    type="text"
                    value={formData.adresseEntreprise}
                    onChange={handleChange}
                    placeholder="123 Rue de l'Exemple, 75001 Paris"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telephoneEntreprise">Téléphone</Label>
                    <Input
                      id="telephoneEntreprise"
                      name="telephoneEntreprise"
                      type="tel"
                      value={formData.telephoneEntreprise}
                      onChange={handleChange}
                      placeholder="01 23 45 67 89"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tva">TVA</Label>
                    <Input
                      id="tva"
                      name="tva"
                      type="text"
                      value={formData.tva}
                      onChange={handleChange}
                      placeholder="FR12345678901"
                    />
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center space-x-2">
              <span>Déjà un compte ?</span>
              <Link to="/login" className="text-emerald-600 hover:underline font-medium">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
