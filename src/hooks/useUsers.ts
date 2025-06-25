
import { useLocalData } from "./useLocalData";
import { useLocalMutation } from "./useLocalMutation";
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
  
  const mutationFn = async (userData: { 
    email: string; 
    password: string; 
    full_name: string; 
    role: string;
    account_id: string;
  }) => {
    return await create({
      account_id: userData.account_id,
      full_name: userData.full_name,
      email: userData.email,
      role: userData.role as any,
      is_active: true
    });
  };

  return useLocalMutation(
    mutationFn,
    () => toast.success("Utilisateur créé avec succès")
  );
};

export const useUpdateUser = () => {
  const { update } = useLocalData<User>('trezo_users');
  
  const mutationFn = async ({ userId, updates }: { userId: string; updates: Partial<User> }) => {
    return await update(userId, updates);
  };

  return useLocalMutation(
    mutationFn,
    () => toast.success("Utilisateur mis à jour avec succès")
  );
};

export const useDeleteUser = () => {
  const { delete: deleteItem } = useLocalData<User>('trezo_users');
  
  const mutationFn = async (userId: string) => {
    await deleteItem(userId);
  };

  return useLocalMutation(
    mutationFn,
    () => toast.success("Utilisateur supprimé avec succès")
  );
};
