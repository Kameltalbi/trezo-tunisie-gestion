
import { useState } from 'react';

export interface LocalMutationResult<T> {
  mutate: (data: any) => void;
  mutateAsync: (data: any) => Promise<T>;
  isPending: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const useLocalMutation = <T>(
  mutationFn: (data: any) => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void
): LocalMutationResult<T> => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = async (data: any): Promise<T> => {
    try {
      setIsPending(true);
      setError(null);
      const result = await mutationFn(data);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const mutate = (data: any) => {
    mutateAsync(data).catch(() => {
      // Error already handled in mutateAsync
    });
  };

  return {
    mutate,
    mutateAsync,
    isPending,
    isLoading: isPending,
    error
  };
};
