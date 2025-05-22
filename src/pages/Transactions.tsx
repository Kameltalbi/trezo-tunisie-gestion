
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { CalendarIcon, Filter } from 'lucide-react';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  source: 'forecast' | 'direct';
  accountId?: string;
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [open, setOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'income',
    source: 'direct'
  });
  const [filter, setFilter] = useState<{
    type?: 'income' | 'expense';
    category?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  // Sample data for demonstration
  React.useEffect(() => {
    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        title: 'Vente de services',
        amount: 5000,
        date: '2025-05-15',
        category: 'Services',
        type: 'income',
        source: 'forecast'
      },
      {
        id: '2',
        title: 'Paiement loyer',
        amount: 1200,
        date: '2025-05-10',
        category: 'Loyer',
        type: 'expense',
        source: 'forecast'
      },
      {
        id: '3',
        title: 'Nouveau client',
        amount: 3500,
        date: '2025-05-18',
        category: 'Vente',
        type: 'income',
        source: 'direct'
      },
      {
        id: '4',
        title: 'Achat matériel',
        amount: 750,
        date: '2025-05-05',
        category: 'Équipement',
        type: 'expense',
        source: 'direct'
      }
    ];
    
    setTransactions(sampleTransactions);
  }, []);

  const addTransaction = () => {
    if (!newTransaction.title || !newTransaction.amount || !newTransaction.date || !newTransaction.category) return;
    
    const transaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      title: newTransaction.title,
      amount: newTransaction.amount,
      date: newTransaction.date,
      category: newTransaction.category,
      type: newTransaction.type || 'income',
      source: 'direct'
    };
    
    setTransactions([...transactions, transaction]);
    setNewTransaction({
      type: 'income',
      source: 'direct'
    });
    setOpen(false);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter.type && transaction.type !== filter.type) return false;
    if (filter.category && transaction.category !== filter.category) return false;
    if (filter.startDate && new Date(transaction.date) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(transaction.date) > new Date(filter.endDate)) return false;
    return true;
  });

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Ajouter une transaction</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="grid gap-4 py-4">
              <h2 className="text-lg font-medium">Nouvelle transaction</h2>
              
              <div className="grid gap-2">
                <Label htmlFor="transaction-type">Type de transaction</Label>
                <Select 
                  onValueChange={value => setNewTransaction({ 
                    ...newTransaction, 
                    type: value as 'income' | 'expense' 
                  })} 
                  defaultValue={newTransaction.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de transaction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Encaissement</SelectItem>
                    <SelectItem value="expense">Décaissement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Intitulé</Label>
                <Input 
                  id="title" 
                  value={newTransaction.title || ''} 
                  onChange={e => setNewTransaction({ ...newTransaction, title: e.target.value })} 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Montant (DT)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  value={newTransaction.amount || ''} 
                  onChange={e => setNewTransaction({ 
                    ...newTransaction, 
                    amount: parseFloat(e.target.value) 
                  })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={newTransaction.date || ''} 
                  onChange={e => setNewTransaction({ ...newTransaction, date: e.target.value })} 
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input 
                  id="category" 
                  value={newTransaction.category || ''} 
                  onChange={e => setNewTransaction({ ...newTransaction, category: e.target.value })} 
                />
              </div>

              <Button 
                onClick={addTransaction} 
                className="mt-4"
              >
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                  type: value as 'income' | 'expense' || undefined 
                })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type de transaction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="income">Encaissements</SelectItem>
                  <SelectItem value="expense">Décaissements</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                onValueChange={value => setFilter({ ...filter, category: value || undefined })}
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
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? 'Encaissement' : 'Décaissement'}
                  </TableCell>
                  <TableCell>{format(new Date(transaction.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{transaction.title}</TableCell>
                  <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    {transaction.source === 'forecast' ? 'Prévision validée' : 'Ajout direct'}
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

export default TransactionsPage;
