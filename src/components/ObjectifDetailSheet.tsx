
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { Objectif } from '@/types/parametres';
import { CalendarIcon, TargetIcon, TrendingUpIcon, TrendingDownIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ObjectifDetailSheetProps {
  objectif: Objectif | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ObjectifDetailSheet: React.FC<ObjectifDetailSheetProps> = ({
  objectif,
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();

  if (!objectif) return null;

  const isCompleted = objectif.progression >= 100;
  const isOnTrack = objectif.progression >= 50;

  // Calculate remaining amount
  const getRemainingAmount = () => {
    if (objectif.type === 'encaissement') {
      return Math.max(0, objectif.valeurCible - objectif.valeurActuelle);
    } else {
      return Math.max(0, objectif.valeurActuelle - objectif.valeurCible);
    }
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    const now = new Date();
    const endDate = new Date(objectif.dateFin);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();
  const remainingAmount = getRemainingAmount();

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Objectif atteint
        </Badge>
      );
    }

    if (daysRemaining < 0) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <ClockIcon className="w-3 h-3 mr-1" />
          Échéance dépassée
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        <ClockIcon className="w-3 h-3 mr-1" />
        En cours
      </Badge>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Détails de l'objectif</span>
            {getStatusBadge()}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations générales</h3>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nom de l'objectif</span>
                <span className="font-medium text-right max-w-[250px] break-words">{objectif.nom}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type</span>
                <Badge variant={objectif.type === 'encaissement' ? 'secondary' : 'outline'} className={objectif.type === 'encaissement' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                  {objectif.type === 'encaissement' ? (
                    <>
                      <TrendingUpIcon className="w-3 h-3 mr-1" />
                      {t("objectifs.income_target")}
                    </>
                  ) : (
                    <>
                      <TrendingDownIcon className="w-3 h-3 mr-1" />
                      {t("objectifs.expense_reduction")}
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Progress Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Progression</h3>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Valeur actuelle</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatCurrency(objectif.valeurActuelle)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Valeur cible</span>
                <span className="font-bold text-lg text-green-600">
                  {formatCurrency(objectif.valeurCible)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Montant restant</span>
                <span className={`font-medium ${remainingAmount === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {remainingAmount === 0 ? 'Objectif atteint !' : formatCurrency(remainingAmount)}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-medium">{objectif.progression}%</span>
                </div>
                <Progress value={objectif.progression} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Date Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Échéances</h3>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  Date de début
                </span>
                <span className="font-medium">
                  {format(new Date(objectif.dateDebut), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <TargetIcon className="w-4 h-4 mr-1" />
                  Date de fin
                </span>
                <span className="font-medium">
                  {format(new Date(objectif.dateFin), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Jours restants</span>
                <span className={`font-medium ${
                  daysRemaining < 0 ? 'text-red-600' : 
                  daysRemaining < 30 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {daysRemaining < 0 ? `Dépassé de ${Math.abs(daysRemaining)} jours` : `${daysRemaining} jours`}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Performance Analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Analyse de performance</h3>
            
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="text-sm text-gray-600">
                {isCompleted ? (
                  <div>
                    <p className="font-medium text-green-700 mb-2">🎉 Félicitations !</p>
                    <p>Vous avez atteint votre objectif avec {objectif.progression}% de réalisation.</p>
                  </div>
                ) : isOnTrack ? (
                  <div>
                    <p className="font-medium text-blue-700 mb-2">📈 Sur la bonne voie</p>
                    <p>Vous êtes à {objectif.progression}% de votre objectif. Continuez sur cette lancée !</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-orange-700 mb-2">⚠️ Attention</p>
                    <p>Vous êtes à {objectif.progression}% de votre objectif. Il peut être nécessaire d'intensifier vos efforts.</p>
                  </div>
                )}
                
                {daysRemaining > 0 && !isCompleted && (
                  <p className="mt-2">
                    Il vous reste {formatCurrency(remainingAmount)} à {objectif.type === 'encaissement' ? 'encaisser' : 'économiser'} 
                    {daysRemaining > 0 && ` en ${daysRemaining} jours`}.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
