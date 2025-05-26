
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useDashboardData = () => {
  const { user } = useAuth();
  
  // Récupérer les encaissements des 5 derniers mois
  const encaissements = useQuery({
    queryKey: ['dashboard-encaissements', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('encaissements')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date_transaction', new Date(new Date().setMonth(new Date().getMonth() - 5)).toISOString())
        .order('date_transaction', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Soldes mensuels
  const soldes = useQuery({
    queryKey: ['dashboard-soldes', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flux_tresorerie')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date_prevision', new Date(new Date().setMonth(new Date().getMonth() - 5)).toISOString())
        .order('date_prevision', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Dépenses par catégorie
  const depenses = useQuery({
    queryKey: ['dashboard-depenses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('decaissements')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date_transaction', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Revenus par source
  const revenus = useQuery({
    queryKey: ['dashboard-revenus', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('encaissements')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date_transaction', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return {
    encaissements,
    soldes,
    depenses,
    revenus,
  };
};
