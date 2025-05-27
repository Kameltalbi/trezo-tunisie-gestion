
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Plan {
  label: string | null;
  name: string;
  max_users: number | null;
  price: number;
}

interface UserAppData {
  trial_end_date: string | null;
  plans: Plan | null;
}

const PlanStatusCard = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [trialEndDate, setTrialEndDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPlan = async () => {
      const { data, error } = await supabase
        .from("users_app")
        .select("trial_end_date, plans(label, name, max_users, price)")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erreur récupération plan:", error);
        return;
      }

      const userData = data as UserAppData;
      setPlan(userData.plans);
      setTrialEndDate(userData.trial_end_date);
    };

    fetchPlan();
  }, [user]);

  const getDaysLeft = () => {
    if (!trialEndDate) return null;
    const today = new Date();
    const end = new Date(trialEndDate);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (!plan) return <div className="text-gray-500">Chargement du plan...</div>;

  return (
    <div className="border p-4 rounded-lg bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">Mon abonnement</h3>
      <p className="text-sm">
        <strong>Plan :</strong> {plan.label || plan.name} ({plan.name})
      </p>
      <p className="text-sm">
        <strong>Utilisateurs max :</strong> {plan.max_users || 'Illimité'}
      </p>
      <p className="text-sm">
        <strong>Prix :</strong> {plan.price} DT/an
      </p>
      {plan.name === 'trial' && (
        <p className="text-sm text-orange-600 font-semibold">
          Il vous reste {getDaysLeft()} jours d'essai gratuit.
        </p>
      )}
    </div>
  );
};

export default PlanStatusCard;
