
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/types';
import { CalendarIcon, TagIcon, CreditCardIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';

interface Forecast extends Transaction {
  status: 'pending' | 'validated' | 'cancelled';
}

interface TransactionDetailSheetProps {
  transaction: Transaction | Forecast | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransactionDetailSheet: React.FC<TransactionDetailSheetProps> = ({
  transaction,
  open,
  onOpenChange,
}) => {
  if (!transaction) return null;

  const isForecast = 'status' in transaction;
  const isValidated = isForecast && transaction.status === 'validated';
  const isPending = isForecast && transaction.status === 'pending';
  const isCancelled = isForecast && transaction.status === 'cancelled';

  // Simulate creation and validation dates
  const creationDate = new Date(transaction.date);
  creationDate.setDate(creationDate.getDate() - Math.floor(Math.random() * 30));
  
  const validationDate = isValidated ? new Date(transaction.date) : null;
  if (validationDate) {
    validationDate.setHours(validationDate.getHours() + Math.floor(Math.random() * 24));
  }

  const getStatusBadge = () => {
    if (!isForecast) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Transaction réalisée
        </Badge>
      );
    }

    switch (transaction.status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case 'validated':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Validée
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Annulée
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Détails de la {isForecast ? 'prévision' : 'transaction'}</span>
            {getStatusBadge()}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations générales</h3>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Intitulé</span>
                <span className="font-medium">{transaction.title}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <Badge variant={transaction.type === 'income' ? 'success' : 'destructive'}>
                  {transaction.type === 'income' ? 'Encaissement' : 'Décaissement'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Montant</span>
                <span className={`font-bold text-lg ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <TagIcon className="w-4 h-4 mr-1" />
                  Catégorie
                </span>
                <Badge variant="outline">{transaction.category}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Date Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dates importantes</h3>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  Date {isForecast ? 'prévue' : 'de transaction'}
                </span>
                <span className="font-medium">
                  {format(new Date(transaction.date), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date de création</span>
                <span className="text-sm">
                  {format(creationDate, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </span>
              </div>
              
              {isValidated && validationDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1 text-green-600" />
                    Date de validation
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    {format(validationDate, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Source Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Origine</h3>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Source</span>
                <Badge variant="outline" className={
                  transaction.source === 'forecast' ? 'border-blue-200 text-blue-700' : 'border-gray-200'
                }>
                  {transaction.source === 'forecast' ? 'Prévision' : 'Ajout direct'}
                </Badge>
              </div>
              
              {transaction.accountId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 flex items-center">
                    <CreditCardIcon className="w-4 h-4 mr-1" />
                    Compte
                  </span>
                  <span className="text-sm">{transaction.accountId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information for Forecasts */}
          {isForecast && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Statut de la prévision</h3>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  {isPending && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-yellow-700 mb-2">En attente de validation</p>
                      <p>Cette prévision n'a pas encore été validée. Elle apparaîtra dans les transactions une fois validée.</p>
                    </div>
                  )}
                  
                  {isValidated && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-green-700 mb-2">Prévision validée</p>
                      <p>Cette prévision a été validée et convertie en transaction réelle.</p>
                    </div>
                  )}
                  
                  {isCancelled && (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-red-700 mb-2">Prévision annulée</p>
                      <p>Cette prévision a été annulée et ne sera pas convertie en transaction.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
