
import { useLocalMutation } from "./useLocalMutation";
import { toast } from "sonner";

// Hooks simulés pour les permissions
export const useUserPermissions = (userId: string) => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useUserGlobalPermissions = (userId: string) => {
  return {
    data: { can_delete: true },
    isLoading: false,
    error: null
  };
};

export const useUpdateUserPermissions = () => {
  const mutationFn = async (data: any) => {
    console.log('Permissions simulées:', data);
    return data;
  };

  return useLocalMutation(
    mutationFn,
    () => toast.success("Permissions mises à jour avec succès")
  );
};
