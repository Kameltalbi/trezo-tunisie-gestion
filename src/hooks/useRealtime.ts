
import { useEffect, useRef } from 'react';

interface RealtimeOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onChange?: (payload: any) => void;
}

export const useRealtime = (options: RealtimeOptions) => {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    console.log('Realtime désactivé pour:', options.table);
    // Realtime désactivé dans le mode local
    return () => {
      // Cleanup simulé
    };
  }, [options.table]);

  return channelRef.current;
};
