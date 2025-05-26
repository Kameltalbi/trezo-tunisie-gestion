
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface FluxTresorerie {
  id: string;
  user_id: string;
  compte_id?: string;
  date_prevision: string;
  montant_prevu: number;
  montant_realise?: number;
  type: string;
  description?: string;
  categorie?: string;
  statut: 'prevu' | 'realise' | 'annule';
}

export const useFluxTresorerie = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['flux-tresorerie', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flux_tresorerie')
        .select('*')
        .eq('user_id', user?.id)
        .order('date_prevision', { ascending: true });

      if (error) throw error;
      return data as FluxTresorerie[];
    },
    enabled: !!user,
  });
};

export const useCreateFluxTresorerie = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (flux: Omit<FluxTresorerie, 'id' | 'user_id'>) => {
      if (!user) throw new Error('Non authentifié');

      const { data, error } = await supabase
        .from('flux_tresorerie')
        .insert({
          user_id: user.id,
          ...flux,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flux-tresorerie'] });
      toast("Flux de trésorerie ajouté avec succès");
    },
    onError: (error) => {
      toast("Erreur lors de l'ajout du flux de trésorerie");
      console.error('Erreur création flux:', error);
    }
  });
};

export const useUpdateFluxTresorerie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (flux: Partial<FluxTresorerie> & { id: string }) => {
      const { data, error } = await supabase
        .from('flux_tresorerie')
        .update(flux)
        .eq('id', flux.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flux-tresorerie'] });
      toast("Flux de trésorerie mis à jour avec succès");
    },
    onError: (error) => {
      toast("Erreur lors de la mise à jour du flux de trésorerie");
      console.error('Erreur mise à jour flux:', error);
    }
  });
};

export const useDeleteFluxTresorerie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flux_tresorerie')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flux-tresorerie'] });
      toast("Flux de trésorerie supprimé avec succès");
    },
    onError: (error) => {
      toast("Erreur lors de la suppression du flux de trésorerie");
      console.error('Erreur suppression flux:', error);
    }
  });
};
