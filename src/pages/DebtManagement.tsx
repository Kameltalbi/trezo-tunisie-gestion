
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { useGestionDettes, useCreateGestionDette, type GestionDette } from '@/hooks/useGestionDettes';
import { toast } from 'sonner';

const GestionDesDettesPage: React.FC = () => {
  const { data: dettes = [], isLoading } = useGestionDettes();
  const createDette = useCreateGestionDette();
  const [open, setOpen] = useState(false);
  const [nouvelleDette, setNouvelleDette] = useState<Partial<GestionDette>>({
    statut: 'active'
  });

  const ajouterDette = async () => {
    if (!nouvelleDette.nom_tiers || !nouvelleDette.montant_initial || !nouvelleDette.type) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await createDette.mutateAsync({
        type: nouvelleDette.type,
        nom_tiers: nouvelleDette.nom_tiers,
        montant_initial: nouvelleDette.montant_initial,
        montant_restant: nouvelleDette.montant_initial, // Initially equals initial amount
        date_echeance: nouvelleDette.date_echeance,
        description: nouvelleDette.description,
        statut: nouvelleDette.statut || 'active'
      });
      
      setNouvelleDette({ statut: 'active' });
      setOpen(false);
      toast.success("Dette/Créance ajoutée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout");
    }
  };

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des dettes et créances</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Ajouter</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <div className="grid gap-4">
              <Label>Type *</Label>
              <Select onValueChange={val => setNouvelleDette({ ...nouvelleDette, type: val as 'creance' | 'dette' })}>
                <SelectTrigger><SelectValue placeholder="Choisir un type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dette">Dette (argent que je dois)</SelectItem>
                  <SelectItem value="creance">Créance (argent qui m'est dû)</SelectItem>
                </SelectContent>
              </Select>

              <Label>Nom du tiers *</Label>
              <Input 
                value={nouvelleDette.nom_tiers || ''} 
                onChange={e => setNouvelleDette({ ...nouvelleDette, nom_tiers: e.target.value })} 
                placeholder="Nom de la personne/entreprise"
              />

              <Label>Montant initial (DT) *</Label>
              <Input 
                type="number" 
                step="0.001"
                value={nouvelleDette.montant_initial || ''} 
                onChange={e => setNouvelleDette({ ...nouvelleDette, montant_initial: parseFloat(e.target.value) })} 
                placeholder="0.000"
              />

              <Label>Date d'échéance</Label>
              <Input 
                type="date" 
                value={nouvelleDette.date_echeance || ''} 
                onChange={e => setNouvelleDette({ ...nouvelleDette, date_echeance: e.target.value })} 
              />

              <Label>Description</Label>
              <Textarea 
                value={nouvelleDette.description || ''} 
                onChange={e => setNouvelleDette({ ...nouvelleDette, description: e.target.value })} 
                placeholder="Détails sur la dette/créance..."
              />

              <Button 
                onClick={ajouterDette}
                disabled={createDette.isPending}
              >
                {createDette.isPending ? "Ajout..." : "Ajouter"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Tiers</TableHead>
                <TableHead>Montant Initial</TableHead>
                <TableHead>Montant Restant</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dettes.map(d => (
                <TableRow key={d.id}>
                  <TableCell>
                    <span className={d.type === 'dette' ? 'text-red-600' : 'text-green-600'}>
                      {d.type === 'dette' ? 'Dette' : 'Créance'}
                    </span>
                  </TableCell>
                  <TableCell>{d.nom_tiers}</TableCell>
                  <TableCell>{formatCurrency(d.montant_initial)}</TableCell>
                  <TableCell>{formatCurrency(d.montant_restant)}</TableCell>
                  <TableCell>
                    {d.date_echeance ? format(new Date(d.date_echeance), 'dd/MM/yyyy') : '-'}
                  </TableCell>
                  <TableCell className={
                    d.statut === 'en_retard' ? 'text-red-500' :
                    d.statut === 'active' ? 'text-orange-500' :
                    'text-green-600'}>{d.statut}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionDesDettesPage;
