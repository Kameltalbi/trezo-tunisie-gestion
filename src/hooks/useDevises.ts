
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Devise {
  id: string;
  nom: string;
  symbole: string;
  code: string;
  decimales: number;
  separateur: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useDevises = () => {
  return useQuery({
    queryKey: ['devises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devises')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data as Devise[];
    },
  });
};

export const useDefaultDevise = () => {
  return useQuery({
    queryKey: ['devises', 'default'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devises')
        .select('*')
        .eq('is_default', true)
        .single();

      if (error) throw error;
      return data as Devise;
    },
  });
};

export const useCreateDevise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Devise, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: devise, error } = await supabase
        .from('devises')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return devise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devises'] });
    },
  });
};

export const useUpdateDevise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Devise> & { id: string }) => {
      const { data: devise, error } = await supabase
        .from('devises')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return devise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devises'] });
    },
  });
};

export const useDeleteDevise = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('devises')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devises'] });
    },
  });
};
