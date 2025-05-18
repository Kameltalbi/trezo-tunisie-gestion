import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

interface Dette {
  id: number;
  nom: string;
  type: string;
  organisme: string;
  montantTotal: number;
  montantRembourse: number;
  tauxInteret: number;
  duree: number;
  dateDebut: string;
  statut: 'en cours' | 'remboursée' | 'en retard';
}

const GestionDesDettesPage: React.FC = () => {
  const [dettes, setDettes] = useState<Dette[]>([]);
  const [open, setOpen] = useState(false);
  const [nouvelleDette, setNouvelleDette] = useState<Partial<Dette>>({});

  const ajouterDette = () => {
    if (!nouvelleDette.nom || !nouvelleDette.montantTotal || !nouvelleDette.duree) return;
    const nouvelle: Dette = {
      id: dettes.length + 1,
      nom: nouvelleDette.nom,
      type: nouvelleDette.type || 'Autre',
      organisme: nouvelleDette.organisme || '',
      montantTotal: nouvelleDette.montantTotal,
      montantRembourse: 0,
      tauxInteret: nouvelleDette.tauxInteret || 0,
      duree: nouvelleDette.duree,
      dateDebut: nouvelleDette.dateDebut || new Date().toISOString().split('T')[0],
      statut: 'en cours',
    };
    setDettes([...dettes, nouvelle]);
    setNouvelleDette({});
    setOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestion des dettes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Ajouter une dette</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="grid gap-4">
              <Label>Nom de la dette</Label>
              <Input value={nouvelleDette.nom || ''} onChange={e => setNouvelleDette({ ...nouvelleDette, nom: e.target.value })} />

              <Label>Type</Label>
              <Select onValueChange={val => setNouvelleDette({ ...nouvelleDette, type: val })}>
                <SelectTrigger><SelectValue placeholder="Choisir un type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Crédit">Crédit</SelectItem>
                  <SelectItem value="Leasing">Leasing</SelectItem>
                  <SelectItem value="Dette fournisseur">Dette fournisseur</SelectItem>
                  <SelectItem value="Dette associée">Dette associée</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>

              <Label>Organisme / Créancier</Label>
              <Textarea value={nouvelleDette.organisme || ''} onChange={e => setNouvelleDette({ ...nouvelleDette, organisme: e.target.value })} />

              <Label>Montant total</Label>
              <Input type="number" value={nouvelleDette.montantTotal || ''} onChange={e => setNouvelleDette({ ...nouvelleDette, montantTotal: parseFloat(e.target.value) })} />

              <Label>Taux d’intérêt (%)</Label>
              <Input type="number" value={nouvelleDette.tauxInteret || ''} onChange={e => setNouvelleDette({ ...nouvelleDette, tauxInteret: parseFloat(e.target.value) })} />

              <Label>Durée (mois)</Label>
              <Input type="number" value={nouvelleDette.duree || ''} onChange={e => setNouvelleDette({ ...nouvelleDette, duree: parseInt(e.target.value) })} />

              <Label>Date de début</Label>
              <Input type="date" value={nouvelleDette.dateDebut || ''} onChange={e => setNouvelleDette({ ...nouvelleDette, dateDebut: e.target.value })} />

              <Button onClick={ajouterDette}>Ajouter</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Montant Total</TableHead>
                <TableHead>Remboursé</TableHead>
                <TableHead>Reste</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dettes.map(d => (
                <TableRow key={d.id}>
                  <TableCell>{d.nom}</TableCell>
                  <TableCell>{d.type}</TableCell>
                  <TableCell>{d.montantTotal.toFixed(3)} DT</TableCell>
                  <TableCell>{d.montantRembourse.toFixed(3)} DT</TableCell>
                  <TableCell>{(d.montantTotal - d.montantRembourse).toFixed(3)} DT</TableCell>
                  <TableCell>{d.duree} mois</TableCell>
                  <TableCell className={
                    d.statut === 'en retard' ? 'text-red-500' :
                    d.statut === 'en cours' ? 'text-orange-500' :
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
