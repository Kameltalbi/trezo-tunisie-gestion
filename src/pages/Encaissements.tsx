import React, { useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

interface Encaissement {
  id: number;
  intitule: string;
  montant: number;
  datePrevue: string;
  statut: 'prévu' | 'réalisé';
  origine: string;
  categorie: string;
}

const EncaissementsPage: React.FC = () => {
  const [encaissements, setEncaissements] = useState<Encaissement[]>([]);
  const [open, setOpen] = useState(false);
  const [nouvelEncaissement, setNouvelEncaissement] = useState<Partial<Encaissement>>({});

  const ajouterEncaissement = () => {
    if (!nouvelEncaissement.intitule || !nouvelEncaissement.montant || !nouvelEncaissement.datePrevue || !nouvelEncaissement.categorie) return;
    const nouveau: Encaissement = {
      id: encaissements.length + 1,
      intitule: nouvelEncaissement.intitule,
      montant: nouvelEncaissement.montant,
      datePrevue: nouvelEncaissement.datePrevue,
      statut: 'prévu',
      origine: nouvelEncaissement.origine || 'Vente',
      categorie: nouvelEncaissement.categorie,
    };
    setEncaissements([...encaissements, nouveau]);
    setNouvelEncaissement({});
    setOpen(false);
  };

  const marquerCommeRealise = (id: number) => {
    setEncaissements(encaissements.map(e =>
      e.id === id ? { ...e, statut: 'réalisé' } : e
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Encaissements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Ajouter un encaissement</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="grid gap-4">
              <Label>Intitulé</Label>
              <Input value={nouvelEncaissement.intitule || ''} onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, intitule: e.target.value })} />

              <Label>Montant (DT)</Label>
              <Input type="number" value={nouvelEncaissement.montant || ''} onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, montant: parseFloat(e.target.value) })} />

              <Label>Date prévue</Label>
              <Input type="date" value={nouvelEncaissement.datePrevue || ''} onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, datePrevue: e.target.value })} />

              <Label>Origine</Label>
              <Input value={nouvelEncaissement.origine || ''} onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, origine: e.target.value })} />

              <Label>Catégorie</Label>
              <Input value={nouvelEncaissement.categorie || ''} onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, categorie: e.target.value })} />

              <Button onClick={ajouterEncaissement}>Ajouter</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Intitulé</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date prévue</TableHead>
                <TableHead>Origine</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {encaissements.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.intitule}</TableCell>
                  <TableCell>{formatCurrency(e.montant)}</TableCell>
                  <TableCell>{format(new Date(e.datePrevue), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{e.origine}</TableCell>
                  <TableCell>{e.categorie}</TableCell>
                  <TableCell className={e.statut === 'réalisé' ? 'text-green-600' : 'text-orange-500'}>{e.statut}</TableCell>
                  <TableCell>
                    {e.statut === 'prévu' && (
                      <Button variant="outline" size="sm" onClick={() => marquerCommeRealise(e.id)}>
                        Marquer comme réalisé
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EncaissementsPage;