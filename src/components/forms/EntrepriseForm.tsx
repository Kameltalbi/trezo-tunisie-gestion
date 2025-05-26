
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useEntreprise, useUpdateEntreprise, type Entreprise } from "@/hooks/useEntreprise";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const EntrepriseForm = () => {
  const { user } = useAuth();
  const { data: entreprise, isLoading } = useEntreprise();
  const updateEntrepriseMutation = useUpdateEntreprise();
  
  const [formData, setFormData] = React.useState<Partial<Entreprise>>({
    nom: '',
    adresse: '',
    telephone: '',
    email: '',
    siret: '',
    tva: '',
    secteur_activite: '',
    forme_juridique: '',
    capital: 0,
  });

  React.useEffect(() => {
    if (entreprise) {
      setFormData(entreprise);
    }
  }, [entreprise]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateEntrepriseMutation.mutateAsync(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capital' ? Number(value) : value
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
        <CardTitle>Informations de l'entreprise</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom de l'entreprise</Label>
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
              />
            </div>

            <div>
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                name="telephone"
                value={formData.telephone || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="adresse">Adresse</Label>
              <Input
                id="adresse"
                name="adresse"
                value={formData.adresse || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                name="siret"
                value={formData.siret || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="tva">TVA</Label>
              <Input
                id="tva"
                name="tva"
                value={formData.tva || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="forme_juridique">Forme juridique</Label>
              <Input
                id="forme_juridique"
                name="forme_juridique"
                value={formData.forme_juridique || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="secteur_activite">Secteur d'activité</Label>
              <Input
                id="secteur_activite"
                name="secteur_activite"
                value={formData.secteur_activite || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="capital">Capital</Label>
              <Input
                id="capital"
                name="capital"
                type="number"
                value={formData.capital || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={updateEntrepriseMutation.isPending}
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
