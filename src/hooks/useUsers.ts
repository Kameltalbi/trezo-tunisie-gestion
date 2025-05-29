
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface User {
  id: string;
  account_id: string;
  full_name: string | null;
  email: string | null;
  role: 'superadmin' | 'admin' | 'financier' | 'editeur' | 'collaborateur';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useUsers = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['users', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as User[];
    },
    enabled: !!user,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: { 
      email: string; 
      password: string; 
      full_name: string; 
      role: string;
      account_id: string;
    }) => {
      // D'abord créer l'utilisateur dans auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Ensuite ajouter les métadonnées dans la table users
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          account_id: userData.account_id,
          full_name: userData.full_name,
          email: userData.email,
          role: userData.role
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Utilisateur créé avec succès");
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la création de l'utilisateur");
      console.error('Erreur création utilisateur:', error);
    }
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { 
      userId: string; 
      updates: Partial<User>;
    }) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Utilisateur mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
      console.error('Erreur mise à jour utilisateur:', error);
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Utilisateur supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression de l'utilisateur");
      console.error('Erreur suppression utilisateur:', error);
    }
  });
};
