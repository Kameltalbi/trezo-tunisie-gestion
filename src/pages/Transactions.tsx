
import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Filter, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEncaissements, useCreateEncaissement } from '@/hooks/useEncaissements';
import { useDecaissements, useCreateDecaissement } from '@/hooks/useDecaissements';
import { useComptesBancaires } from '@/hooks/useComptesBancaires';
import { useProjets } from '@/hooks/useProjets';
import { toast } from 'sonner';

interface TransactionFilter {
  type?: 'encaissement' | 'decaissement';
  category?: string;
  startDate?: string;
  endDate?: string;
}

const TransactionsPage: React.FC = () => {
  const { data: encaissements = [], isLoading: encaissementsLoading } = useEncaissements();
  const { data: decaissements = [], isLoading: decaissementsLoading } = useDecaissements();
  const { data: comptes = [] } = useComptesBancaires();
  const { data: projets = [] } = useProjets();
  const createEncaissement = useCreateEncaissement();
  const createDecaissement = useCreateDecaissement();
  
  const [openEncaissement, setOpenEncaissement] = useState(false);
  const [openDecaissement, setOpenDecaissement] = useState(false);
  const [filter, setFilter] = useState<TransactionFilter>({});
  
  const [newEncaissement, setNewEncaissement] = useState({
    titre: '',
    montant: 0,
    date_transaction: '',
    categorie: '',
    sous_categorie: '',
    description: '',
    compte_id: '',
    projet_id: '',
    reference: ''
  });

  const [newDecaissement, setNewDecaissement] = useState({
    titre: '',
    montant: 0,
    date_transaction: '',
    categorie: '',
    sous_categorie: '',
    description: '',
    compte_id: '',
    projet_id: '',
    reference: ''
  });

  // Combine encaissements and decaissements into a unified transactions list
  const allTransactions = useMemo(() => {
    const encaissementsWithType = encaissements
      .filter(enc => enc.statut === 'confirme')
      .map(enc => ({
        ...enc,
        type: 'encaissement' as const
      }));
    
    const decaissementsWithType = decaissements
      .filter(dec => dec.statut === 'confirme')
      .map(dec => ({
        ...dec,
        type: 'decaissement' as const
      }));
    
    return [...encaissementsWithType, ...decaissementsWithType]
      .sort((a, b) => new Date(b.date_transaction).getTime() - new Date(a.date_transaction).getTime());
  }, [encaissements, decaissements]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      if (filter.type && transaction.type !== filter.type) return false;
      if (filter.category && transaction.categorie !== filter.category) return false;
      if (filter.startDate && new Date(transaction.date_transaction) < new Date(filter.startDate)) return false;
      if (filter.endDate && new Date(transaction.date_transaction) > new Date(filter.endDate)) return false;
      return true;
    });
  }, [allTransactions, filter]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    return Array.from(new Set(allTransactions.map(t => t.categorie)));
  }, [allTransactions]);

  const handleAddEncaissement = async () => {
    if (!newEncaissement.titre || !newEncaissement.montant || !newEncaissement.date_transaction || !newEncaissement.categorie) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await createEncaissement.mutateAsync({
        titre: newEncaissement.titre,
        montant: newEncaissement.montant,
        date_transaction: newEncaissement.date_transaction,
        categorie: newEncaissement.categorie,
        sous_categorie: newEncaissement.sous_categorie || undefined,
        description: newEncaissement.description || undefined,
        compte_id: newEncaissement.compte_id || undefined,
        projet_id: newEncaissement.projet_id || undefined,
        reference: newEncaissement.reference || undefined,
        recurrence: 'aucune',
        statut: 'confirme'
      });
      
      setNewEncaissement({
        titre: '',
        montant: 0,
        date_transaction: '',
        categorie: '',
        sous_categorie: '',
        description: '',
        compte_id: '',
        projet_id: '',
        reference: ''
      });
      setOpenEncaissement(false);
      toast.success("Encaissement ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout de l'encaissement");
    }
  };

  const handleAddDecaissement = async () => {
    if (!newDecaissement.titre || !newDecaissement.montant || !newDecaissement.date_transaction || !newDecaissement.categorie) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await createDecaissement.mutateAsync({
        titre: newDecaissement.titre,
        montant: newDecaissement.montant,
        date_transaction: newDecaissement.date_transaction,
        categorie: newDecaissement.categorie,
        sous_categorie: newDecaissement.sous_categorie || undefined,
        description: newDecaissement.description || undefined,
        compte_id: newDecaissement.compte_id || undefined,
        projet_id: newDecaissement.projet_id || undefined,
        reference: newDecaissement.reference || undefined,
        recurrence: 'aucune',
        statut: 'confirme'
      });
      
      setNewDecaissement({
        titre: '',
        montant: 0,
        date_transaction: '',
        categorie: '',
        sous_categorie: '',
        description: '',
        compte_id: '',
        projet_id: '',
        reference: ''
      });
      setOpenDecaissement(false);
      toast.success("Décaissement ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout du décaissement");
    }
  };

  if (encaissementsLoading || decaissementsLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="flex gap-2">
          <Dialog open={openEncaissement} onOpenChange={setOpenEncaissement}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un encaissement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="grid gap-4 py-4">
                <h2 className="text-lg font-medium">Nouvel encaissement</h2>
                
                <div className="grid gap-2">
                  <Label htmlFor="enc-title">Intitulé *</Label>
                  <Input 
                    id="enc-title" 
                    value={newEncaissement.titre} 
                    onChange={e => setNewEncaissement({ ...newEncaissement, titre: e.target.value })} 
                    placeholder="Description de l'encaissement"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="enc-amount">Montant (DT) *</Label>
                  <Input 
                    id="enc-amount" 
                    type="number" 
                    step="0.001"
                    value={newEncaissement.montant || ''} 
                    onChange={e => setNewEncaissement({ 
                      ...newEncaissement, 
                      montant: parseFloat(e.target.value) || 0
                    })}
                    placeholder="0.000"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="enc-date">Date *</Label>
                  <Input 
                    id="enc-date" 
                    type="date" 
                    value={newEncaissement.date_transaction} 
                    onChange={e => setNewEncaissement({ ...newEncaissement, date_transaction: e.target.value })} 
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="enc-category">Catégorie *</Label>
                  <Input 
                    id="enc-category" 
                    value={newEncaissement.categorie} 
                    onChange={e => setNewEncaissement({ ...newEncaissement, categorie: e.target.value })} 
                    placeholder="Ex: Vente, Prestation, Subvention..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="enc-account">Compte bancaire</Label>
                  <Select onValueChange={val => setNewEncaissement({ ...newEncaissement, compte_id: val })}>
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
                </div>

                <Button 
                  onClick={handleAddEncaissement}
                  disabled={createEncaissement.isPending}
                >
                  {createEncaissement.isPending ? "Ajout..." : "Ajouter"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={openDecaissement} onOpenChange={setOpenDecaissement}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un décaissement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="grid gap-4 py-4">
                <h2 className="text-lg font-medium">Nouveau décaissement</h2>
                
                <div className="grid gap-2">
                  <Label htmlFor="dec-title">Intitulé *</Label>
                  <Input 
                    id="dec-title" 
                    value={newDecaissement.titre} 
                    onChange={e => setNewDecaissement({ ...newDecaissement, titre: e.target.value })} 
                    placeholder="Description du décaissement"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dec-amount">Montant (DT) *</Label>
                  <Input 
                    id="dec-amount" 
                    type="number" 
                    step="0.001"
                    value={newDecaissement.montant || ''} 
                    onChange={e => setNewDecaissement({ 
                      ...newDecaissement, 
                      montant: parseFloat(e.target.value) || 0
                    })}
                    placeholder="0.000"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dec-date">Date *</Label>
                  <Input 
                    id="dec-date" 
                    type="date" 
                    value={newDecaissement.date_transaction} 
                    onChange={e => setNewDecaissement({ ...newDecaissement, date_transaction: e.target.value })} 
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dec-category">Catégorie *</Label>
                  <Select onValueChange={val => setNewDecaissement({ ...newDecaissement, categorie: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
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
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dec-account">Compte bancaire</Label>
                  <Select onValueChange={val => setNewDecaissement({ ...newDecaissement, compte_id: val })}>
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
                </div>

                <Button 
                  onClick={handleAddDecaissement}
                  disabled={createDecaissement.isPending}
                >
                  {createDecaissement.isPending ? "Ajout..." : "Ajouter"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <span className="font-medium">Filtres:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select 
                onValueChange={value => setFilter({ 
                  ...filter, 
                  type: value === "all" ? undefined : value as 'encaissement' | 'decaissement'
                })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type de transaction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="encaissement">Encaissements</SelectItem>
                  <SelectItem value="decaissement">Décaissements</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                onValueChange={value => setFilter({ 
                  ...filter, 
                  category: value === "all" ? undefined : value 
                })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Input 
                  type="date" 
                  className="w-[180px]" 
                  placeholder="Date début" 
                  onChange={e => setFilter({ ...filter, startDate: e.target.value })}
                />
                <span>-</span>
                <Input 
                  type="date" 
                  className="w-[180px]" 
                  placeholder="Date fin" 
                  onChange={e => setFilter({ ...filter, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Intitulé</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    Aucune transaction trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map(transaction => (
                  <TableRow key={`${transaction.type}-${transaction.id}`}>
                    <TableCell className={transaction.type === 'encaissement' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'encaissement' ? 'Encaissement' : 'Décaissement'}
                    </TableCell>
                    <TableCell>{format(new Date(transaction.date_transaction), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>{transaction.titre}</TableCell>
                    <TableCell className={transaction.type === 'encaissement' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'encaissement' ? '+' : '-'}{formatCurrency(transaction.montant)}
                    </TableCell>
                    <TableCell>
                      {transaction.categorie}
                      {transaction.sous_categorie && ` - ${transaction.sous_categorie}`}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                        Confirmé
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
