import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { CalendarIcon, Filter, Plus, ClipboardCheck, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { validerPrevision, formatForecastStatus, type Prevision } from '@/utils/validationUtils';
import { Transaction } from '@/types';
import { TransactionDetailSheet } from '@/components/TransactionDetailSheet';

interface Forecast extends Transaction {
  status: 'pending' | 'validated' | 'cancelled';
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [open, setOpen] = useState(false);
  const [forecastOpen, setForecastOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | Forecast | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'income',
    source: 'direct'
  });
  const [newForecast, setNewForecast] = useState<Partial<Forecast>>({
    type: 'income',
    source: 'forecast',
    status: 'pending'
  });
  const [filter, setFilter] = useState<{
    type?: 'income' | 'expense';
    category?: string;
    startDate?: string;
    endDate?: string;
  }>({});

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
    
    // Sample forecasts
    const sampleForecasts: Forecast[] = [
      {
        id: '5',
        title: 'Paiement client XYZ',
        amount: 8000,
        date: '2025-06-10',
        category: 'Services',
        type: 'income',
        source: 'forecast',
        status: 'pending'
      },
      {
        id: '6',
        title: 'Facture fournisseur',
        amount: 2500,
        date: '2025-06-15',
        category: 'Fournitures',
        type: 'expense',
        source: 'forecast',
        status: 'pending'
      },
      {
        id: '7',
        title: 'Contrat maintenance',
        amount: 1500,
        date: '2025-06-20',
        category: 'Services',
        type: 'income',
        source: 'forecast',
        status: 'validated'
      },
      {
        id: '8',
        title: 'Charges bureau',
        amount: 800,
        date: '2025-06-25',
        category: 'Loyer',
        type: 'expense',
        source: 'forecast',
        status: 'cancelled'
      }
    ];
    
    setForecasts(sampleForecasts);
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
  
  const addForecast = () => {
    if (!newForecast.title || !newForecast.amount || !newForecast.date || !newForecast.category) return;
    
    const forecast: Forecast = {
      id: Math.random().toString(36).substring(2, 9),
      title: newForecast.title,
      amount: newForecast.amount,
      date: newForecast.date,
      category: newForecast.category,
      type: newForecast.type || 'income',
      source: 'forecast',
      status: newForecast.status || 'pending'
    };
    
    setForecasts([...forecasts, forecast]);
    setNewForecast({
      type: 'income',
      source: 'forecast',
      status: 'pending'
    });
    setForecastOpen(false);
  };
  
  const validateForecast = async (forecast: Forecast) => {
    // Create a prevision object from our forecast data
    const prevision: Prevision = {
      id: forecast.id,
      title: forecast.title,
      amount: forecast.amount,
      date: forecast.date,
      category: forecast.category,
      type: forecast.type === 'income' ? 'in' : 'out',
      status: 'en_attente',
      compte_id: forecast.accountId
    };
    
    // Call our validation utility
    const transaction = await validerPrevision(prevision);
    
    if (transaction) {
      // Update forecast status locally
      setForecasts(forecasts.map(f => 
        f.id === forecast.id ? { ...f, status: 'validated' as const } : f
      ));
      
      // Add to transactions if successful
      if (forecast.status !== 'validated') {
        setTransactions([...transactions, transaction]);
      }
    }
  };
  
  const cancelForecast = (id: string) => {
    setForecasts(forecasts.map(f => 
      f.id === id ? { ...f, status: 'cancelled' as const } : f
    ));
  };

  const handleRowClick = (transaction: Transaction | Forecast) => {
    setSelectedTransaction(transaction);
    setDetailSheetOpen(true);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter.type && transaction.type !== filter.type) return false;
    if (filter.category && transaction.category !== filter.category) return false;
    if (filter.startDate && new Date(transaction.date) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(transaction.date) > new Date(filter.endDate)) return false;
    return true;
  });

  const filteredForecasts = forecasts.filter(forecast => {
    if (filter.type && forecast.type !== filter.type) return false;
    if (filter.category && forecast.category !== filter.category) return false;
    if (filter.startDate && new Date(forecast.date) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(forecast.date) > new Date(filter.endDate)) return false;
    return true;
  });

  const categories = Array.from(new Set([...transactions, ...forecasts].map(t => t.category)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="flex gap-2">
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
          
          <Dialog open={forecastOpen} onOpenChange={setForecastOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">+ Ajouter une prévision</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="grid gap-4 py-4">
                <h2 className="text-lg font-medium">Nouvelle prévision</h2>
                
                <div className="grid gap-2">
                  <Label htmlFor="forecast-type">Type de prévision</Label>
                  <Select 
                    onValueChange={value => setNewForecast({ 
                      ...newForecast, 
                      type: value as 'income' | 'expense' 
                    })} 
                    defaultValue={newForecast.type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type de prévision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Encaissement prévu</SelectItem>
                      <SelectItem value="expense">Décaissement prévu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="forecast-title">Intitulé</Label>
                  <Input 
                    id="forecast-title" 
                    value={newForecast.title || ''} 
                    onChange={e => setNewForecast({ ...newForecast, title: e.target.value })} 
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="forecast-amount">Montant (DT)</Label>
                  <Input 
                    id="forecast-amount" 
                    type="number" 
                    value={newForecast.amount || ''} 
                    onChange={e => setNewForecast({ 
                      ...newForecast, 
                      amount: parseFloat(e.target.value) 
                    })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="forecast-date">Date prévue</Label>
                  <Input 
                    id="forecast-date" 
                    type="date" 
                    value={newForecast.date || ''} 
                    onChange={e => setNewForecast({ ...newForecast, date: e.target.value })} 
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="forecast-category">Catégorie</Label>
                  <Input 
                    id="forecast-category" 
                    value={newForecast.category || ''} 
                    onChange={e => setNewForecast({ ...newForecast, category: e.target.value })} 
                  />
                </div>

                <Button 
                  onClick={addForecast} 
                  className="mt-4"
                >
                  Ajouter la prévision
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
                  type: value === "all" ? undefined : value as 'income' | 'expense'
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

          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="forecasts">Prévisions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions">
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
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        Aucune transaction trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map(transaction => (
                      <TableRow 
                        key={transaction.id} 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleRowClick(transaction)}
                      >
                        <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'income' ? 'Encaissement' : 'Décaissement'}
                        </TableCell>
                        <TableCell>{format(new Date(transaction.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{transaction.title}</TableCell>
                        <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          {transaction.source === 'forecast' ? (
                            <>
                              <CheckCircle size={16} className="text-green-500" />
                              <span>Prévision validée</span>
                            </>
                          ) : (
                            'Ajout direct'
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="forecasts">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Date prévue</TableHead>
                    <TableHead>Intitulé</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredForecasts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        Aucune prévision trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredForecasts.map(forecast => (
                      <TableRow 
                        key={forecast.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleRowClick(forecast)}
                      >
                        <TableCell className={forecast.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {forecast.type === 'income' ? 'Encaissement prévu' : 'Décaissement prévu'}
                        </TableCell>
                        <TableCell>{format(new Date(forecast.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{forecast.title}</TableCell>
                        <TableCell className={forecast.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(forecast.amount)}
                        </TableCell>
                        <TableCell>{forecast.category}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            forecast.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            forecast.status === 'validated' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {forecast.status === 'pending' ? 'En attente' : 
                             forecast.status === 'validated' ? 'Validé' : 'Annulé'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {forecast.status === 'pending' && (
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => validateForecast(forecast)}
                                className="text-green-600 border-green-600 hover:bg-green-50"
                              >
                                <ClipboardCheck size={16} className="mr-1" />
                                Valider
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => cancelForecast(forecast.id)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Annuler
                              </Button>
                            </div>
                          )}
                          {forecast.status !== 'pending' && (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <TransactionDetailSheet
        transaction={selectedTransaction}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </div>
  );
};

export default TransactionsPage;
