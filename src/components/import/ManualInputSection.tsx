
import React, { useState } from 'react';
import { Plus, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface Transaction {
  id: string;
  date: string;
  libelle: string;
  montant: string;
  type: 'encaissement' | 'decaissement';
}

interface ManualInputSectionProps {
  onTransactionsReady: (transactions: Transaction[]) => void;
}

export const ManualInputSection: React.FC<ManualInputSectionProps> = ({
  onTransactionsReady
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      libelle: '',
      montant: '',
      type: 'decaissement'
    }
  ]);

  const updateTransaction = (id: string, field: string, value: string) => {
    setTransactions(prev => 
      prev.map(t => t.id === id ? { ...t, [field]: value } : t)
    );
  };

  const deleteTransaction = (id: string) => {
    if (transactions.length > 1) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const addNewTransaction = () => {
    setTransactions(prev => [...prev, {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      libelle: '',
      montant: '',
      type: 'decaissement'
    }]);
  };

  const addExampleData = () => {
    const examples: Transaction[] = [
      { id: uuidv4(), date: '2024-12-27', libelle: 'SOLDE DEBUT', montant: '7678.000', type: 'encaissement' },
      { id: uuidv4(), date: '2024-12-27', libelle: 'RECUP FRAIS REJET PRELEVT', montant: '1.000', type: 'decaissement' },
      { id: uuidv4(), date: '2024-12-30', libelle: 'TVA', montant: '0.190', type: 'decaissement' },
      { id: uuidv4(), date: '2024-12-30', libelle: 'COMMISSION TAWASSOL', montant: '8.000', type: 'decaissement' },
      { id: uuidv4(), date: '2024-12-31', libelle: 'FRAIS DE TENUE DE COMPTE', montant: '33.000', type: 'decaissement' }
    ];
    setTransactions(examples);
    toast.success('5 transactions d\'exemple ajoutées');
  };

  const handleValidate = () => {
    const validTransactions = transactions.filter(t => 
      t.date && t.libelle.trim() && t.montant && parseFloat(t.montant) > 0
    );

    if (validTransactions.length === 0) {
      toast.error('Aucune transaction valide trouvée');
      return;
    }

    onTransactionsReady(validTransactions);
    toast.success(`${validTransactions.length} transactions prêtes à importer`);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Saisie manuelle des transactions</CardTitle>
        <CardDescription>
          Consultez votre relevé PDF et saisissez chaque transaction ligne par ligne
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button variant="outline" onClick={addExampleData} className="gap-2">
              <Plus className="h-4 w-4" />
              Utiliser des données d'exemple
            </Button>
            <Button variant="outline" onClick={addNewTransaction} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter une ligne
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-2 items-center p-3 bg-muted font-medium text-sm">
              <div className="col-span-2">Date</div>
              <div className="col-span-5">Libellé de la transaction</div>
              <div className="col-span-2">Montant (TND)</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-1">Actions</div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {transactions.map((transaction, index) => (
                <div key={transaction.id} className="grid grid-cols-12 gap-2 items-center p-2 border-b border-muted hover:bg-muted/30">
                  <div className="col-span-2">
                    <Input
                      type="date"
                      value={transaction.date}
                      onChange={(e) => updateTransaction(transaction.id, 'date', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="col-span-5">
                    <Input
                      placeholder="Ex: VIREMENT SALAIRE, RETRAIT DAB..."
                      value={transaction.libelle}
                      onChange={(e) => updateTransaction(transaction.id, 'libelle', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Input
                      type="number"
                      step="0.001"
                      placeholder="0.000"
                      value={transaction.montant}
                      onChange={(e) => updateTransaction(transaction.id, 'montant', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Select value={transaction.type} onValueChange={(value) => updateTransaction(transaction.id, 'type', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="encaissement">Crédit (+)</SelectItem>
                        <SelectItem value="decaissement">Débit (-)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1 flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTransaction(transaction.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      disabled={transactions.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-muted-foreground">
              {transactions.filter(t => t.libelle.trim() && t.montant).length} transaction(s) saisie(s)
            </div>
            
            <Button onClick={handleValidate} size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              Valider et importer ({transactions.filter(t => t.libelle.trim() && t.montant).length})
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Conseils pour une saisie rapide :</h4>
            <ul className="text-blue-700 space-y-1">
              <li>• Consultez votre relevé PDF en parallèle</li>
              <li>• Vous pouvez copier-coller les libellés directement</li>
              <li>• Utilisez Tab pour naviguer rapidement entre les champs</li>
              <li>• Les montants s'ajustent automatiquement au format tunisien</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
