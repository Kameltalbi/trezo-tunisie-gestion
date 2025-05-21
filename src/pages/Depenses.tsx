
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

interface Depense {
  id: number;
  intitule: string;
  categorie: string;
  montant: number;
  dateEcheance: string;
  statut: 'prévue' | 'réglée' | 'en retard';
  notes?: string;
}

const DepensesPage: React.FC = () => {
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [open, setOpen] = useState(false);
  const [nouvelleDepense, setNouvelleDepense] = useState<Partial<Depense>>({});

  const ajouterDepense = () => {
    if (!nouvelleDepense.intitule || !nouvelleDepense.montant || !nouvelleDepense.dateEcheance || !nouvelleDepense.categorie) return;
    const nouvelle: Depense = {
      id: depenses.length + 1,
      intitule: nouvelleDepense.intitule,
      categorie: nouvelleDepense.categorie,
      montant: nouvelleDepense.montant,
      dateEcheance: nouvelleDepense.dateEcheance,
      statut: 'prévue',
      notes: nouvelleDepense.notes || '',
    };
    setDepenses([...depenses, nouvelle]);
    setNouvelleDepense({});
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Décaissements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Ajouter un décaissement</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="grid gap-4">
              <Label>Intitulé</Label>
              <Input value={nouvelleDepense.intitule || ''} onChange={e => setNouvelleDepense({ ...nouvelleDepense, intitule: e.target.value })} />

              <Label>Catégorie</Label>
              <Select onValueChange={val => setNouvelleDepense({ ...nouvelleDepense, categorie: val })}>
                <SelectTrigger><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Loyer">Loyer</SelectItem>
                  <SelectItem value="Salaires">Salaires</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                  <SelectItem value="Achats">Achats</SelectItem>
                  <SelectItem value="Autres">Autres</SelectItem>
                </SelectContent>
              </Select>

              <Label>Montant (DT)</Label>
              <Input type="number" value={nouvelleDepense.montant || ''} onChange={e => setNouvelleDepense({ ...nouvelleDepense, montant: parseFloat(e.target.value) })} />

              <Label>Date d'échéance</Label>
              <Input type="date" value={nouvelleDepense.dateEcheance || ''} onChange={e => setNouvelleDepense({ ...nouvelleDepense, dateEcheance: e.target.value })} />

              <Label>Notes</Label>
              <Textarea value={nouvelleDepense.notes || ''} onChange={e => setNouvelleDepense({ ...nouvelleDepense, notes: e.target.value })} />

              <Button onClick={ajouterDepense}>Ajouter</Button>
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
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depenses.map(dep => (
                <TableRow key={dep.id}>
                  <TableCell>{dep.intitule}</TableCell>
                  <TableCell>{dep.categorie}</TableCell>
                  <TableCell>{dep.montant.toFixed(3)} DT</TableCell>
                  <TableCell>{dep.dateEcheance}</TableCell>
                  <TableCell className={
                    dep.statut === 'en retard' ? 'text-red-500' :
                    dep.statut === 'prévue' ? 'text-orange-500' :
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
