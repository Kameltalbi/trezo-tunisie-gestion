
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useAutoRegisterUser = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const registerUser = async () => {
      try {
        // Vérifier si l'utilisateur existe déjà dans users_app
        const { data: existing, error: checkError } = await supabase
          .from("users_app")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (existing || checkError) return;

        // Chercher le plan trial
        const { data: trialPlan, error: planError } = await supabase
          .from("plans")
          .select("id")
          .eq("name", "trial")
          .maybeSingle();

        if (planError || !trialPlan) {
          console.error("Plan 'trial' introuvable", planError);
          return;
        }

        // Calculer la date de fin d'essai (14 jours)
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 14);

        // Insérer l'utilisateur dans users_app
        const { error: insertError } = await supabase.from("users_app").insert({
          id: user.id,
          email: user.email || "",
          role: "user",
          plan_id: trialPlan.id,
          trial_end_date: trialEnd.toISOString().split("T")[0],
        });

        if (insertError) {
          console.error("Erreur création utilisateur trial :", insertError);
        } else {
          console.log("Utilisateur créé avec succès avec plan trial");
        }
      } catch (error) {
        console.error("Erreur dans useAutoRegisterUser:", error);
      }
    };

    registerUser();
  }, [user]);
};
