
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import { Objectif } from '@/hooks/useObjectifs';
import { CalendarIcon, TargetIcon, TrendingUpIcon, TrendingDownIcon, CheckCircleIcon, ClockIcon, PiggyBankIcon } from 'lucide-react';
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

  // Calculate progression based on the objectif type
  const calculateProgression = (obj: Objectif) => {
    if (obj.type === "encaissement" || obj.type === "epargne") {
      return Math.min(Math.floor(((obj.valeur_actuelle || 0) / (obj.valeur_cible || 1)) * 100), 100);
    } else if (obj.type === "reduction_depense") {
      const reductionTarget = obj.valeur_cible || 0;
      const initialValue = Math.max(obj.valeur_actuelle || 0, reductionTarget);
      const currentReduction = initialValue - (obj.valeur_actuelle || 0);
      return Math.min(Math.floor((currentReduction / Math.max(initialValue - reductionTarget, 1)) * 100), 100);
    }
    return Math.min(Math.floor(((obj.valeur_actuelle || 0) / (obj.valeur_cible || 1)) * 100), 100);
  };

  const progression = calculateProgression(objectif);
  const isCompleted = progression >= 100;
  const isOnTrack = progression >= 50;

  // Calculate remaining amount
  const getRemainingAmount = () => {
    if (objectif.type === 'encaissement' || objectif.type === 'epargne') {
      return Math.max(0, objectif.valeur_cible - objectif.valeur_actuelle);
    } else {
      return Math.max(0, objectif.valeur_actuelle - objectif.valeur_cible);
    }
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    const now = new Date();
    const endDate = new Date(objectif.date_fin);
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

  const getTypeIcon = () => {
    switch (objectif.type) {
      case 'encaissement':
        return <TrendingUpIcon className="w-3 h-3 mr-1" />;
      case 'reduction_depense':
        return <TrendingDownIcon className="w-3 h-3 mr-1" />;
      case 'epargne':
        return <PiggyBankIcon className="w-3 h-3 mr-1" />;
      default:
        return <TargetIcon className="w-3 h-3 mr-1" />;
    }
  };

  const getTypeLabel = () => {
    switch (objectif.type) {
      case 'encaissement':
        return t("objectifs.income_target");
      case 'reduction_depense':
        return t("objectifs.expense_reduction");
      case 'epargne':
        return t("objectifs.savings");
      default:
        return objectif.type;
    }
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
                <Badge variant={objectif.type === 'encaissement' ? 'secondary' : 'outline'} className={
                  objectif.type === 'encaissement' ? 'bg-green-100 text-green-800' : 
                  objectif.type === 'epargne' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }>
                  {getTypeIcon()}
                  {getTypeLabel()}
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
                  {formatCurrency(objectif.valeur_actuelle)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Valeur cible</span>
                <span className="font-bold text-lg text-green-600">
                  {formatCurrency(objectif.valeur_cible)}
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
                  <span className="font-medium">{progression}%</span>
                </div>
                <Progress value={progression} className="h-3" />
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
                  {format(new Date(objectif.date_debut), 'dd MMMM yyyy', { locale: fr })}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 flex items-center">
                  <TargetIcon className="w-4 h-4 mr-1" />
                  Date de fin
                </span>
                <span className="font-medium">
                  {format(new Date(objectif.date_fin), 'dd MMMM yyyy', { locale: fr })}
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
                    <p>Vous avez atteint votre objectif avec {progression}% de réalisation.</p>
                  </div>
                ) : isOnTrack ? (
                  <div>
                    <p className="font-medium text-blue-700 mb-2">📈 Sur la bonne voie</p>
                    <p>Vous êtes à {progression}% de votre objectif. Continuez sur cette lancée !</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-orange-700 mb-2">⚠️ Attention</p>
                    <p>Vous êtes à {progression}% de votre objectif. Il peut être nécessaire d'intensifier vos efforts.</p>
                  </div>
                )}
                
                {daysRemaining > 0 && !isCompleted && (
                  <p className="mt-2">
                    Il vous reste {formatCurrency(remainingAmount)} à {
                      objectif.type === 'encaissement' ? 'encaisser' : 
                      objectif.type === 'epargne' ? 'épargner' : 'économiser'
                    } 
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
