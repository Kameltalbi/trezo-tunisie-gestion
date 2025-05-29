
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserCurrentPlan } from "@/hooks/useUserCurrentPlan";

const PlanStatusCard = () => {
  const { user } = useAuth();
  const { data: currentPlan, isLoading } = useUserCurrentPlan();

  const getDaysLeft = () => {
    if (!currentPlan?.trial_end_date) return null;
    const today = new Date();
    const end = new Date(currentPlan.trial_end_date);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (isLoading) return <div className="text-gray-500">Chargement du plan...</div>;
  if (!currentPlan) return <div className="text-gray-500">Aucun plan disponible</div>;

  return (
    <div className="border p-4 rounded-lg bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">Mon abonnement</h3>
      <p className="text-sm">
        <strong>Plan :</strong> {currentPlan.plan_name || 'Non défini'}
      </p>
      <p className="text-sm">
        <strong>Projets max :</strong> {currentPlan.max_projects || 'Illimité'}
      </p>
      <p className="text-sm">
        <strong>Comptes bancaires max :</strong> {currentPlan.max_bank_accounts || 'Illimité'}
      </p>
      <p className="text-sm">
        <strong>Transactions max/mois :</strong> {currentPlan.max_transactions_per_month || 'Illimité'}
      </p>
      {currentPlan.is_trial && (
        <p className="text-sm text-orange-600 font-semibold">
          Il vous reste {getDaysLeft()} jours d'essai gratuit.
        </p>
      )}
    </div>
  );
};

export default PlanStatusCard;
