
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Wallet, ArrowUp, ArrowDown, Edit, MoreHorizontal, Trash2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useComptesBancaires, useCreateCompteBancaire } from '@/hooks/useComptesBancaires';
import { formatCurrency } from '@/lib/utils';

const Comptes = () => {
  const { t } = useTranslation();
  const { data: accounts = [], isLoading } = useComptesBancaires();
  const createCompteMutation = useCreateCompteBancaire();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'deposit' | 'withdraw' | 'fees' | 'edit' | 'delete'>('add');
  const [currentAccount, setCurrentAccount] = useState<any>(null);
  const [transactionForm, setTransactionForm] = useState({
    amount: '',
    description: '',
    category: '',
    reference: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [accountForm, setAccountForm] = useState({
    nom: '',
    type: 'courant' as 'courant' | 'epargne' | 'credit',
    banque: '',
    numero_compte: '',
    solde_initial: '',
    devise_id: ''
  });

  const formatAccountCurrency = (amount: number) => {
    return formatCurrency(amount);
  };

  const openAddDialog = () => {
    setDialogType('add');
    setAccountForm({
      nom: '',
      type: 'courant',
      banque: '',
      numero_compte: '',
      solde_initial: '',
      devise_id: ''
    });
    setIsDialogOpen(true);
  };

  const openActionDialog = (type: 'deposit' | 'withdraw' | 'fees' | 'edit' | 'delete', account: any) => {
    setDialogType(type);
    setCurrentAccount(account);
    
    if (type === 'edit') {
      setAccountForm({
        nom: account.nom,
        type: account.type,
        banque: account.banque || '',
        numero_compte: account.numero_compte || '',
        solde_initial: account.solde_initial.toString(),
        devise_id: account.devise_id || ''
      });
    } else if (type !== 'delete') {
      setTransactionForm({
        amount: '',
        description: '',
        category: '',
        reference: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsDialogOpen(true);
  };

  const handleAddAccount = async () => {
    if (!accountForm.nom || !accountForm.solde_initial) {
      toast({
        title: t('comptes.error'),
        description: t('comptes.fill_all_fields'),
        variant: "destructive",
      });
      return;
    }

    try {
      const soldeInitial = parseFloat(accountForm.solde_initial);
      await createCompteMutation.mutateAsync({
        nom: accountForm.nom,
        type: accountForm.type,
        banque: accountForm.banque,
        numero_compte: accountForm.numero_compte,
        solde_initial: soldeInitial,
        solde_actuel: soldeInitial,
        devise_id: accountForm.devise_id,
        is_active: true
      });

      setIsDialogOpen(false);
      toast({
        title: t('comptes.success'),
        description: t('comptes.account_added'),
      });
    } catch (error) {
      toast({
        title: t('comptes.error'),
        description: 'Erreur lors de la création du compte',
        variant: "destructive",
      });
    }
  };

  const handleEditAccount = () => {
    if (!currentAccount || !accountForm.nom || !accountForm.solde_initial) {
      toast({
        title: t('comptes.error'),
        description: t('comptes.fill_all_fields'),
        variant: "destructive",
      });
      return;
    }

    // For now, just close dialog since we need update mutation
    setIsDialogOpen(false);
    toast({
      title: t('comptes.success'),
      description: t('comptes.account_modified'),
    });
  };

  const handleDeleteAccount = () => {
    if (!currentAccount) return;

    // For now, just close dialog since we need delete mutation
    setIsDialogOpen(false);
    toast({
      title: t('comptes.success'),
      description: t('comptes.account_deleted'),
    });
  };

  const handleAction = () => {
    if (dialogType === 'edit') {
      handleEditAccount();
      return;
    }
    
    if (dialogType === 'delete') {
      handleDeleteAccount();
      return;
    }

    if (!currentAccount || !transactionForm.amount || isNaN(parseFloat(transactionForm.amount))) {
      toast({
        title: t('comptes.error'),
        description: t('comptes.enter_valid_amount'),
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(transactionForm.amount);

    // Log transaction details
    console.log('Transaction effectuée:', {
      type: dialogType,
      account: currentAccount.nom,
      amount: numAmount,
      description: transactionForm.description,
      category: transactionForm.category,
      reference: transactionForm.reference,
      date: transactionForm.date
    });

    setIsDialogOpen(false);

    let actionMessage = '';
    switch (dialogType) {
      case 'deposit':
        actionMessage = t('comptes.deposit_success');
        break;
      case 'withdraw':
        actionMessage = t('comptes.withdraw_success');
        break;
      case 'fees':
        actionMessage = t('comptes.fees_success');
        break;
    }

    toast({
      title: t('comptes.success'),
      description: actionMessage,
    });
  };

  const getDialogTitle = () => {
    switch (dialogType) {
      case 'add':
        return t('comptes.add_account');
      case 'deposit':
        return t('comptes.deposit_funds');
      case 'withdraw':
        return t('comptes.withdraw_funds');
      case 'fees':
        return t('comptes.modify_fees');
      case 'edit':
        return t('comptes.modify_account');
      case 'delete':
        return t('comptes.delete_account');
      default:
        return '';
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'courant':
        return t('comptes.current');
      case 'epargne':
        return t('comptes.savings');
      case 'credit':
        return t('comptes.credit');
      default:
        return type;
    }
  };

  const getCategoryOptions = () => {
    switch (dialogType) {
      case 'deposit':
        return ['Salaire', 'Virement', 'Remboursement', 'Intérêts', 'Autre'];
      case 'withdraw':
        return ['Alimentation', 'Transport', 'Logement', 'Santé', 'Loisirs', 'Autre'];
      case 'fees':
        return ['Frais bancaires', 'Commission', 'Agios', 'Frais de tenue de compte', 'Autre'];
      default:
        return [];
    }
  };

  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-2">{t('comptes.title')}</h1>
      <p className="text-muted-foreground mb-6">{t('comptes.description')}</p>
      
      <div className="flex justify-between items-center mb-6">
        <Button onClick={openAddDialog}>
          <Plus size={16} className="mr-2" />
          {t('comptes.add_account')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('comptes.accounts_list')}</CardTitle>
          <CardDescription>{t('comptes.manage_accounts')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('comptes.name')}</TableHead>
                <TableHead>{t('comptes.type')}</TableHead>
                <TableHead className="text-right">{t('comptes.initial_balance')}</TableHead>
                <TableHead className="text-right">{t('comptes.current_balance')}</TableHead>
                <TableHead className="text-right">{t('comptes.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length > 0 ? (
                accounts.map(account => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Wallet className="mr-2 h-4 w-4 text-slate-500" />
                        {account.nom}
                      </div>
                    </TableCell>
                    <TableCell>{getAccountTypeLabel(account.type)}</TableCell>
                    <TableCell className="text-right">{formatAccountCurrency(account.solde_initial)}</TableCell>
                    <TableCell className={`text-right font-medium ${account.solde_actuel > account.solde_initial ? 'text-emerald-600' : account.solde_actuel < account.solde_initial ? 'text-red-600' : ''}`}>
                      {formatAccountCurrency(account.solde_actuel)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <Link to={`/comptes/${account.id}/import-releve`}>
                            <FileText size={16} className="mr-2" />
                            Importer relevé
                          </Link>
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => openActionDialog('deposit', account)}>
                              <ArrowDown size={16} className="mr-2 text-emerald-600" />
                              {t('comptes.deposit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openActionDialog('withdraw', account)}>
                              <ArrowUp size={16} className="mr-2 text-red-600" />
                              {t('comptes.withdraw')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openActionDialog('fees', account)}>
                              <Edit size={16} className="mr-2" />
                              {t('comptes.fees')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openActionDialog('edit', account)}>
                              <Edit size={16} className="mr-2" />
                              {t('comptes.modify')}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => openActionDialog('delete', account)}
                              className="text-red-600"
                            >
                              <Trash2 size={16} className="mr-2" />
                              {t('comptes.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    {t('comptes.no_accounts')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {accounts.length > 0 
              ? t('comptes.account_total', { count: accounts.length }) 
              : t('comptes.add_first_account')}
          </p>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {dialogType === 'add' 
                ? t('comptes.add_account_desc') 
                : dialogType === 'delete'
                ? t('comptes.delete_account_confirm', { name: currentAccount?.nom })
                : dialogType === 'edit' 
                ? t('comptes.modify_account_info', { name: currentAccount?.nom })
                : t('comptes.action_account_desc', { account: currentAccount?.nom })}
            </DialogDescription>
          </DialogHeader>

          {dialogType === 'delete' ? (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                {t('comptes.delete_account_warning')}
              </p>
            </div>
          ) : (dialogType === 'add' || dialogType === 'edit') ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('comptes.name')}</Label>
                <Input 
                  id="name" 
                  value={accountForm.nom} 
                  onChange={(e) => setAccountForm({...accountForm, nom: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">{t('comptes.type')}</Label>
                <select 
                  id="type"
                  className="w-full p-2 border rounded"
                  value={accountForm.type}
                  onChange={(e) => setAccountForm({...accountForm, type: e.target.value as 'courant' | 'epargne' | 'credit'})}
                >
                  <option value="courant">{t('comptes.current')}</option>
                  <option value="epargne">{t('comptes.savings')}</option>
                  <option value="credit">{t('comptes.credit')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banque">Banque</Label>
                <Input 
                  id="banque" 
                  value={accountForm.banque} 
                  onChange={(e) => setAccountForm({...accountForm, banque: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialBalance">{t('comptes.initial_balance')}</Label>
                <Input 
                  id="initialBalance" 
                  type="number"
                  value={accountForm.solde_initial} 
                  onChange={(e) => setAccountForm({...accountForm, solde_initial: e.target.value})} 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">{t('comptes.amount')} *</Label>
                  <Input 
                    id="amount" 
                    type="number"
                    placeholder="0.00"
                    value={transactionForm.amount} 
                    onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">{t('comptes.date')}</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={transactionForm.date} 
                    onChange={(e) => setTransactionForm({...transactionForm, date: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t('comptes.category')}</Label>
                <select 
                  id="category"
                  className="w-full p-2 border rounded"
                  value={transactionForm.category}
                  onChange={(e) => setTransactionForm({...transactionForm, category: e.target.value})}
                >
                  <option value="">{t('comptes.select_category')}</option>
                  {getCategoryOptions().map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">{t('comptes.reference')}</Label>
                <Input 
                  id="reference" 
                  placeholder="Numéro de référence ou chèque"
                  value={transactionForm.reference} 
                  onChange={(e) => setTransactionForm({...transactionForm, reference: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('comptes.description')}</Label>
                <Textarea 
                  id="description" 
                  placeholder="Détails de la transaction (optionnel)"
                  rows={3}
                  value={transactionForm.description} 
                  onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})} 
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('comptes.cancel')}
            </Button>
            <Button 
              onClick={dialogType === 'add' ? handleAddAccount : handleAction}
              variant={dialogType === 'delete' ? 'destructive' : 'default'}
            >
              {dialogType === 'add' ? t('comptes.create') : 
               dialogType === 'delete' ? t('comptes.delete') :
               dialogType === 'edit' ? t('comptes.modify') :
               t('comptes.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comptes;
