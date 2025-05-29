
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useEntreprise, useUpdateEntreprise, type Entreprise } from "@/hooks/useEntreprise";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";

const EntrepriseForm = () => {
  const { user } = useAuth();
  const { data: entreprise, isLoading } = useEntreprise();
  const updateEntrepriseMutation = useUpdateEntreprise();
  
  const [formData, setFormData] = React.useState<Partial<Entreprise>>({
    nom: '',
    adresse: '',
    telephone: '',
    email: '',
    tva: '',
  });

  React.useEffect(() => {
    if (entreprise) {
      setFormData({
        nom: entreprise.nom,
        adresse: entreprise.adresse,
        telephone: entreprise.telephone,
        email: entreprise.email,
        tva: entreprise.tva,
      });
    }
  }, [entreprise]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom) {
      toast.error("Le nom de l'entreprise est requis");
      return;
    }
    
    await updateEntrepriseMutation.mutateAsync({
      ...formData,
      nom: formData.nom,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Informations de l'entreprise
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom de l'entreprise *</Label>
              <Input
                id="nom"
                name="nom"
                value={formData.nom || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="contact@entreprise.com"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                name="adresse"
                value={formData.adresse || ''}
                onChange={handleChange}
                placeholder="123 Rue de l'Exemple, 75001 Paris"
              />
            </div>

            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                value={formData.telephone || ''}
                onChange={handleChange}
                placeholder="01 23 45 67 89"
              />
            </div>

            <div>
              <Label htmlFor="tva">TVA</Label>
              <Input
                id="tva"
                name="tva"
                value={formData.tva || ''}
                onChange={handleChange}
                placeholder="FR12345678901"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={updateEntrepriseMutation.isPending || !formData.nom}
            >
              {updateEntrepriseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EntrepriseForm;
