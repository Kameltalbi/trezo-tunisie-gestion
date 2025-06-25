
import React, { useState } from 'react';
import { Plus, Download, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TransactionInputRow } from './TransactionInputRow';
import { v4 as uuidv4 } from 'uuid';

interface Transaction {
  id: string;
  date: string;
  libelle: string;
  montant: string;
  type: 'encaissement' | 'decaissement';
}

interface AssistedInputSectionProps {
  extractedText?: string;
  onTransactionsReady: (transactions: Transaction[]) => void;
}

export const AssistedInputSection: React.FC<AssistedInputSectionProps> = ({
  extractedText,
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

  // Parse extracted text when available
  React.useEffect(() => {
    if (extractedText) {
      const parsed = parseExtractedText(extractedText);
      if (parsed.length > 0) {
        setTransactions(parsed);
      }
    }
  }, [extractedText]);

  const parseExtractedText = (text: string): Transaction[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const parsed: Transaction[] = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      
      // Recherche de patterns de date
      let date = '';
      let dateIndex = -1;
      
      for (let i = 0; i < Math.min(3, parts.length); i++) {
        if (parts[i].match(/^\d{1,2}$/) && i < parts.length - 1 && parts[i + 1].match(/^\d{1,2}$/)) {
          date = `2025-${parts[i + 1].padStart(2, '0')}-${parts[i].padStart(2, '0')}`;
          dateIndex = i + 1;
          break;
        }
      }

      // Recherche du montant
      let montant = '';
      let montantIndex = -1;
      
      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].match(/^\d+([,\.]\d{1,3})*$/)) {
          montant = parts[i].replace(',', '.');
          montantIndex = i;
          break;
        }
      }

      // Libellé
      let libelle = '';
      if (dateIndex >= 0 && montantIndex > dateIndex) {
        libelle = parts.slice(dateIndex + 1, montantIndex).join(' ');
      }

      if (date && libelle && montant) {
        parsed.push({
          id: uuidv4(),
          date: date,
          libelle: libelle,
          montant: montant,
          type: 'decaissement'
        });
      }
    }

    return parsed;
  };

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
      { id: uuidv4(), date: '2025-01-08', libelle: 'REGLEMENT CHEQUE 0001910', montant: '300.000', type: 'decaissement' },
      { id: uuidv4(), date: '2025-01-10', libelle: 'VIREMENT SALAIRE JANVIER 2025', montant: '2500.000', type: 'encaissement' },
      { id: uuidv4(), date: '2025-01-12', libelle: 'RETRAIT DAB AVENUE HABIB', montant: '150.000', type: 'decaissement' },
      { id: uuidv4(), date: '2025-01-15', libelle: 'PAIEMENT CARTE CARREFOUR', montant: '85.500', type: 'decaissement' },
      { id: uuidv4(), date: '2025-01-18', libelle: 'VIREMENT LOYER APPARTEMENT', montant: '800.000', type: 'decaissement' }
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
        <CardTitle>Saisie assistée des transactions</CardTitle>
        <CardDescription>
          {extractedText 
            ? 'Données extraites du PDF - Vérifiez et corrigez si nécessaire'
            : 'Saisissez vos transactions manuellement ou utilisez des données d\'exemple'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!extractedText && (
            <div className="flex gap-2 mb-4">
              <Button variant="outline" onClick={addExampleData} className="gap-2">
                <Copy className="h-4 w-4" />
                Utiliser des données d'exemple
              </Button>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 gap-2 items-center p-3 bg-muted font-medium text-sm">
              <div className="col-span-2">Date</div>
              <div className="col-span-5">Libellé</div>
              <div className="col-span-2">Montant (TND)</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-1">Actions</div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {transactions.map((transaction, index) => (
                <TransactionInputRow
                  key={transaction.id}
                  id={transaction.id}
                  date={transaction.date}
                  libelle={transaction.libelle}
                  montant={transaction.montant}
                  type={transaction.type}
                  onUpdate={updateTransaction}
                  onDelete={deleteTransaction}
                  onAddNew={addNewTransaction}
                  isLast={index === transactions.length - 1}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-muted-foreground">
              {transactions.filter(t => t.libelle.trim() && t.montant).length} transaction(s) saisie(s)
            </div>
            
            <Button onClick={handleValidate} size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              Valider et importer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
