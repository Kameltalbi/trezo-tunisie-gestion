
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TransactionInputRowProps {
  id: string;
  date: string;
  libelle: string;
  montant: string;
  type: 'encaissement' | 'decaissement';
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  isLast: boolean;
}

export const TransactionInputRow: React.FC<TransactionInputRowProps> = ({
  id,
  date,
  libelle,
  montant,
  type,
  onUpdate,
  onDelete,
  onAddNew,
  isLast
}) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center p-2 border-b border-muted">
      <div className="col-span-2">
        <Input
          type="date"
          value={date}
          onChange={(e) => onUpdate(id, 'date', e.target.value)}
          className="text-sm"
        />
      </div>
      
      <div className="col-span-5">
        <Input
          placeholder="Libellé de la transaction"
          value={libelle}
          onChange={(e) => onUpdate(id, 'libelle', e.target.value)}
          className="text-sm"
        />
      </div>
      
      <div className="col-span-2">
        <Input
          type="number"
          step="0.001"
          placeholder="0.000"
          value={montant}
          onChange={(e) => onUpdate(id, 'montant', e.target.value)}
          className="text-sm"
        />
      </div>
      
      <div className="col-span-2">
        <Select value={type} onValueChange={(value) => onUpdate(id, 'type', value)}>
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="encaissement">Crédit</SelectItem>
            <SelectItem value="decaissement">Débit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-1 flex gap-1">
        {isLast && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddNew}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(id)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
