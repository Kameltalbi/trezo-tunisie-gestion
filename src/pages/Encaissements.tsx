
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { ClipboardCheck } from 'lucide-react';
import { useEncaissements, useCreateEncaissement, type Encaissement } from '@/hooks/useEncaissements';
import { useComptesBancaires } from '@/hooks/useComptesBancaires';
import { useProjets } from '@/hooks/useProjets';
import { toast } from 'sonner';

const EncaissementsPage: React.FC = () => {
  const { data: encaissements = [], isLoading } = useEncaissements();
  const { data: comptes = [] } = useComptesBancaires();
  const { data: projets = [] } = useProjets();
  const createEncaissement = useCreateEncaissement();
  const [open, setOpen] = useState(false);
  const [nouvelEncaissement, setNouvelEncaissement] = useState<Partial<Encaissement>>({
    recurrence: 'aucune',
    statut: 'confirme'
  });

  const ajouterEncaissement = async () => {
    if (!nouvelEncaissement.titre || !nouvelEncaissement.montant || !nouvelEncaissement.date_transaction || !nouvelEncaissement.categorie) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await createEncaissement.mutateAsync({
        titre: nouvelEncaissement.titre,
        montant: nouvelEncaissement.montant,
        date_transaction: nouvelEncaissement.date_transaction,
        categorie: nouvelEncaissement.categorie,
        sous_categorie: nouvelEncaissement.sous_categorie,
        description: nouvelEncaissement.description,
        compte_id: nouvelEncaissement.compte_id,
        projet_id: nouvelEncaissement.projet_id,
        reference: nouvelEncaissement.reference,
        recurrence: nouvelEncaissement.recurrence || 'aucune',
        statut: nouvelEncaissement.statut || 'confirme'
      });
      
      setNouvelEncaissement({ recurrence: 'aucune', statut: 'confirme' });
      setOpen(false);
      toast.success("Encaissement ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout de l'encaissement");
    }
  };

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Encaissements</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Ajouter un encaissement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <div className="grid gap-4">
              <Label>Intitulé *</Label>
              <Input 
                value={nouvelEncaissement.titre || ''} 
                onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, titre: e.target.value })} 
                placeholder="Description de l'encaissement"
              />

              <Label>Montant (DT) *</Label>
              <Input 
                type="number" 
                step="0.001"
                value={nouvelEncaissement.montant || ''} 
                onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, montant: parseFloat(e.target.value) })} 
                placeholder="0.000"
              />

              <Label>Date de transaction *</Label>
              <Input 
                type="date" 
                value={nouvelEncaissement.date_transaction || ''} 
                onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, date_transaction: e.target.value })} 
              />

              <Label>Catégorie *</Label>
              <Input 
                value={nouvelEncaissement.categorie || ''} 
                onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, categorie: e.target.value })} 
                placeholder="Ex: Vente, Prestation, Subvention..."
              />

              <Label>Sous-catégorie</Label>
              <Input 
                value={nouvelEncaissement.sous_categorie || ''} 
                onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, sous_categorie: e.target.value })} 
                placeholder="Précision sur la catégorie"
              />

              <Label>Compte bancaire</Label>
              <Select onValueChange={val => setNouvelEncaissement({ ...nouvelEncaissement, compte_id: val })}>
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

              <Label>Projet associé</Label>
              <Select onValueChange={val => setNouvelEncaissement({ ...nouvelEncaissement, projet_id: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un projet" />
                </SelectTrigger>
                <SelectContent>
                  {projets.map(projet => (
                    <SelectItem key={projet.id} value={projet.id}>
                      {projet.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Référence</Label>
              <Input 
                value={nouvelEncaissement.reference || ''} 
                onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, reference: e.target.value })} 
                placeholder="Numéro de facture, référence..."
              />

              <Label>Description</Label>
              <Textarea 
                value={nouvelEncaissement.description || ''} 
                onChange={e => setNouvelEncaissement({ ...nouvelEncaissement, description: e.target.value })} 
                placeholder="Détails supplémentaires..."
              />

              <Button 
                onClick={ajouterEncaissement}
                disabled={createEncaissement.isPending}
              >
                {createEncaissement.isPending ? "Ajout..." : "Ajouter"}
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
                <TableHead>Intitulé</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {encaissements.map((encaissement) => (
                <TableRow key={encaissement.id}>
                  <TableCell>{encaissement.titre}</TableCell>
                  <TableCell>{formatCurrency(encaissement.montant)}</TableCell>
                  <TableCell>{format(new Date(encaissement.date_transaction), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    {encaissement.categorie}
                    {encaissement.sous_categorie && ` - ${encaissement.sous_categorie}`}
                  </TableCell>
                  <TableCell>
                    <span className={
                      encaissement.statut === 'confirme' ? 'text-green-600' :
                      encaissement.statut === 'en_attente' ? 'text-orange-500' :
                      'text-red-500'
                    }>
                      {encaissement.statut}
                    </span>
                  </TableCell>
                  <TableCell>
                    {encaissement.statut === 'en_attente' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <ClipboardCheck size={16} />
                        Confirmer
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
