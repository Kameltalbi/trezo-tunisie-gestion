
// Hooks désactivés qui retournent des valeurs par défaut pour compatibilité
import { useQuery } from "@tanstack/react-query";

export const useDisabledQuery = (queryKey: string[], message = "Fonctionnalité désactivée") => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      console.warn(`Hook désactivé: ${queryKey.join('-')} - ${message}`);
      return [];
    },
    enabled: false,
  });
};

export const useDisabledMutation = (message = "Fonctionnalité désactivée") => {
  return {
    mutate: () => console.warn(`Mutation désactivée: ${message}`),
    mutateAsync: async () => {
      console.warn(`Mutation async désactivée: ${message}`);
      return null;
    },
    isLoading: false,
    error: null,
  };
};
