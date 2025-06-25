
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
import { useLocalDecaissements } from '@/hooks/useLocalDecaissements';
import { useLocalComptes } from '@/hooks/useLocalComptes';
import { useLocalProjets } from '@/hooks/useLocalProjets';
import { Transaction } from '@/types/local';
import { toast } from 'sonner';

const DepensesPage: React.FC = () => {
  const { data: decaissements = [], isLoading, createDecaissement } = useLocalDecaissements();
  const { data: comptes = [] } = useLocalComptes();
  const { data: projets = [] } = useLocalProjets();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [nouvelleDepense, setNouvelleDepense] = useState<Partial<Transaction>>({
    statut: 'confirme'
  });

  const ajouterDepense = async () => {
    if (!nouvelleDepense.titre || !nouvelleDepense.montant || !nouvelleDepense.dateTransaction || !nouvelleDepense.categorie) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsCreating(true);
    try {
      await createDecaissement({
        titre: nouvelleDepense.titre,
        montant: nouvelleDepense.montant,
        dateTransaction: nouvelleDepense.dateTransaction,
        categorie: nouvelleDepense.categorie,
        sousCategorie: nouvelleDepense.sousCategorie,
        description: nouvelleDepense.description,
        compteId: nouvelleDepense.compteId,
        statut: nouvelleDepense.statut || 'confirme'
      });
      
      setNouvelleDepense({ statut: 'confirme' });
      setOpen(false);
      toast.success("Décaissement ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout du décaissement");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Décaissements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Ajouter un décaissement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <div className="grid gap-4">
              <Label>Intitulé *</Label>
              <Input 
                value={nouvelleDepense.titre || ''} 
                onChange={e => setNouvelleDepense({ ...nouvelleDepense, titre: e.target.value })} 
                placeholder="Description du décaissement"
              />

              <Label>Catégorie *</Label>
              <Select onValueChange={val => setNouvelleDepense({ ...nouvelleDepense, categorie: val })}>
                <SelectTrigger><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Loyer">Loyer</SelectItem>
                  <SelectItem value="Salaires">Salaires</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                  <SelectItem value="Achats">Achats</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Formation">Formation</SelectItem>
                  <SelectItem value="Autres">Autres</SelectItem>
                </SelectContent>
              </Select>

              <Label>Sous-catégorie</Label>
              <Input 
                value={nouvelleDepense.sousCategorie || ''} 
                onChange={e => setNouvelleDepense({ ...nouvelleDepense, sousCategorie: e.target.value })} 
                placeholder="Précision sur la catégorie"
              />

              <Label>Montant (DT) *</Label>
              <Input 
                type="number" 
                step="0.001"
                value={nouvelleDepense.montant || ''} 
                onChange={e => setNouvelleDepense({ ...nouvelleDepense, montant: parseFloat(e.target.value) })} 
                placeholder="0.000"
              />

              <Label>Date de transaction *</Label>
              <Input 
                type="date" 
                value={nouvelleDepense.dateTransaction || ''} 
                onChange={e => setNouvelleDepense({ ...nouvelleDepense, dateTransaction: e.target.value })} 
              />

              <Label>Compte bancaire</Label>
              <Select onValueChange={val => setNouvelleDepense({ ...nouvelleDepense, compteId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un compte" />
                </SelectTrigger>
                <SelectContent>
                  {comptes.map(compte => (
                    <SelectItem key={compte.id} value={compte.id}>
                      {compte.nom} - {compte.banque}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Notes</Label>
              <Textarea 
                value={nouvelleDepense.description || ''} 
                onChange={e => setNouvelleDepense({ ...nouvelleDepense, description: e.target.value })} 
                placeholder="Détails supplémentaires..."
              />

              <Button 
                onClick={ajouterDepense}
                disabled={isCreating}
              >
                {isCreating ? "Ajout..." : "Ajouter"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Intitulé</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decaissements.map(dep => (
                <TableRow key={dep.id}>
                  <TableCell>{dep.titre}</TableCell>
                  <TableCell>
                    {dep.categorie}
                    {dep.sousCategorie && ` - ${dep.sousCategorie}`}
                  </TableCell>
                  <TableCell>{formatCurrency(dep.montant)}</TableCell>
                  <TableCell>{format(new Date(dep.dateTransaction), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className={
                    dep.statut === 'annule' ? 'text-red-500' :
                    dep.statut === 'en_attente' ? 'text-orange-500' :
                    'text-green-600'}>{dep.statut}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepensesPage;
