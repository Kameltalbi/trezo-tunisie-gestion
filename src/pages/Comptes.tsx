
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Wallet, ArrowUp, ArrowDown, Edit } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import { Account, AccountType } from '@/types';

const Comptes = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<Account[]>([
    { 
      id: '1', 
      name: 'Compte principal', 
      type: 'checking', 
      initialBalance: 5000, 
      currentBalance: 5350,
      createdAt: new Date().toISOString()
    },
    { 
      id: '2', 
      name: 'Épargne', 
      type: 'savings', 
      initialBalance: 10000, 
      currentBalance: 10250,
      createdAt: new Date().toISOString()
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'deposit' | 'withdraw' | 'fees'>('add');
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState('');
  const [accountForm, setAccountForm] = useState({
    name: '',
    type: 'checking' as AccountType,
    initialBalance: ''
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const openAddDialog = () => {
    setDialogType('add');
    setAccountForm({
      name: '',
      type: 'checking',
      initialBalance: ''
    });
    setIsDialogOpen(true);
  };

  const openActionDialog = (type: 'deposit' | 'withdraw' | 'fees', account: Account) => {
    setDialogType(type);
    setCurrentAccount(account);
    setAmount('');
    setIsDialogOpen(true);
  };

  const handleAddAccount = () => {
    if (!accountForm.name || !accountForm.initialBalance) {
      toast({
        title: t('comptes.error'),
        description: t('comptes.fill_all_fields'),
        variant: "destructive",
      });
      return;
    }

    const initialBalance = parseFloat(accountForm.initialBalance);
    const newAccount: Account = {
      id: Date.now().toString(),
      name: accountForm.name,
      type: accountForm.type,
      initialBalance,
      currentBalance: initialBalance,
      createdAt: new Date().toISOString()
    };

    setAccounts([...accounts, newAccount]);
    setIsDialogOpen(false);
    toast({
      title: t('comptes.success'),
      description: t('comptes.account_added'),
    });
  };

  const handleAction = () => {
    if (!currentAccount || !amount || isNaN(parseFloat(amount))) {
      toast({
        title: t('comptes.error'),
        description: t('comptes.enter_valid_amount'),
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    const updatedAccounts = accounts.map(account => {
      if (account.id === currentAccount.id) {
        let newBalance = account.currentBalance;
        
        switch (dialogType) {
          case 'deposit':
            newBalance += numAmount;
            break;
          case 'withdraw':
            newBalance -= numAmount;
            break;
          case 'fees':
            newBalance -= numAmount;
            break;
        }
        
        return { ...account, currentBalance: newBalance };
      }
      return account;
    });

    setAccounts(updatedAccounts);
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
      default:
        return '';
    }
  };

  const getAccountTypeLabel = (type: AccountType) => {
    switch (type) {
      case 'checking':
        return t('comptes.checking');
      case 'savings':
        return t('comptes.savings');
      case 'credit':
        return t('comptes.credit');
      default:
        return type;
    }
  };

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
                        {account.name}
                      </div>
                    </TableCell>
                    <TableCell>{getAccountTypeLabel(account.type)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(account.initialBalance)}</TableCell>
                    <TableCell className={`text-right font-medium ${account.currentBalance > account.initialBalance ? 'text-emerald-600' : account.currentBalance < account.initialBalance ? 'text-red-600' : ''}`}>
                      {formatCurrency(account.currentBalance)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openActionDialog('deposit', account)}
                        >
                          <ArrowDown size={16} className="mr-1 text-emerald-600" />
                          {t('comptes.deposit')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openActionDialog('withdraw', account)}
                        >
                          <ArrowUp size={16} className="mr-1 text-red-600" />
                          {t('comptes.withdraw')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openActionDialog('fees', account)}
                        >
                          <Edit size={16} className="mr-1" />
                          {t('comptes.fees')}
                        </Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {dialogType === 'add' 
                ? t('comptes.add_account_desc') 
                : t('comptes.action_account_desc', { account: currentAccount?.name })}
            </DialogDescription>
          </DialogHeader>

          {dialogType === 'add' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('comptes.name')}</Label>
                <Input 
                  id="name" 
                  value={accountForm.name} 
                  onChange={(e) => setAccountForm({...accountForm, name: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">{t('comptes.type')}</Label>
                <select 
                  id="type"
                  className="w-full p-2 border rounded"
                  value={accountForm.type}
                  onChange={(e) => setAccountForm({...accountForm, type: e.target.value as AccountType})}
                >
                  <option value="checking">{t('comptes.checking')}</option>
                  <option value="savings">{t('comptes.savings')}</option>
                  <option value="credit">{t('comptes.credit')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialBalance">{t('comptes.initial_balance')}</Label>
                <Input 
                  id="initialBalance" 
                  type="number"
                  value={accountForm.initialBalance} 
                  onChange={(e) => setAccountForm({...accountForm, initialBalance: e.target.value})} 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">{t('comptes.amount')}</Label>
                <Input 
                  id="amount" 
                  type="number"
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('comptes.cancel')}
            </Button>
            <Button onClick={dialogType === 'add' ? handleAddAccount : handleAction}>
              {dialogType === 'add' ? t('comptes.create') : t('comptes.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comptes;
