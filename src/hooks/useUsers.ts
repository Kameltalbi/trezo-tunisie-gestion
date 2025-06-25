
import { useLocalData } from "./useLocalData";
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
  return useLocalData<User>('trezo_users');
};

export const useCreateUser = () => {
  const { create } = useLocalData<User>('trezo_users');
  
  return {
    mutate: async (userData: { 
      email: string; 
      password: string; 
      full_name: string; 
      role: string;
      account_id: string;
    }) => {
      const newUser = await create({
        account_id: userData.account_id,
        full_name: userData.full_name,
        email: userData.email,
        role: userData.role as any,
        is_active: true
      });
      toast.success("Utilisateur créé avec succès");
      return newUser;
    },
    mutateAsync: async (userData: { 
      email: string; 
      password: string; 
      full_name: string; 
      role: string;
      account_id: string;
    }) => {
      const newUser = await create({
        account_id: userData.account_id,
        full_name: userData.full_name,
        email: userData.email,
        role: userData.role as any,
        is_active: true
      });
      toast.success("Utilisateur créé avec succès");
      return newUser;
    },
    isLoading: false,
    error: null,
  };
};

export const useUpdateUser = () => {
  const { update } = useLocalData<User>('trezo_users');
  
  return {
    mutate: ({ userId, updates }: { userId: string; updates: Partial<User> }) => {
      update(userId, updates);
      toast.success("Utilisateur mis à jour avec succès");
    },
    mutateAsync: async ({ userId, updates }: { userId: string; updates: Partial<User> }) => {
      const result = await update(userId, updates);
      toast.success("Utilisateur mis à jour avec succès");
      return result;
    },
    isLoading: false,
    error: null,
  };
};

export const useDeleteUser = () => {
  const { delete: deleteItem } = useLocalData<User>('trezo_users');
  
  return {
    mutate: (userId: string) => {
      deleteItem(userId);
      toast.success("Utilisateur supprimé avec succès");
    },
    mutateAsync: async (userId: string) => {
      await deleteItem(userId);
      toast.success("Utilisateur supprimé avec succès");
    },
    isLoading: false,
    error: null,
  };
};
