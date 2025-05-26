
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserInvitation {
  id: string;
  email: string;
  role: 'admin' | 'editeur' | 'collaborateur' | 'utilisateur';
  invited_by: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
}

export const useUserInvitations = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-invitations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Pour l'instant, on simule les invitations en cours
      // En attendant la table des invitations
      return [] as UserInvitation[];
    },
    enabled: !!user,
  });
};

export const useInviteUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'admin' | 'editeur' | 'collaborateur' | 'utilisateur' }) => {
      if (!user) throw new Error('User not authenticated');

      // Pour l'instant, on crée directement un profil utilisateur
      // Dans une vraie application, on enverrait un email d'invitation
      
      // Vérifier si l'email existe déjà
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      // Créer un utilisateur temporaire (normalement fait par l'invitation)
      // Pour la démo, on simule la création directe
      const tempUserId = crypto.randomUUID();

      // Créer le profil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: tempUserId,
          email: email,
          full_name: email.split('@')[0], // Nom temporaire
          company_name: null,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Créer le rôle
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: tempUserId,
          role: role,
        })
        .select()
        .single();

      if (roleError) throw roleError;

      return { profile, userRole };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles-with-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['user-invitations'] });
    },
  });
};
