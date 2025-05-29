
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

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
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const {
      table,
      event = '*',
      filter,
      onInsert,
      onUpdate,
      onDelete,
      onChange,
    } = options;

    // Créer le canal
    const channel = supabase.channel(`realtime-${table}`);

    // Configuration de base
    const config: any = {
      event,
      schema: 'public',
      table,
    };

    if (filter) {
      config.filter = filter;
    }

    // Ajouter les listeners
    channel.on('postgres_changes', config, (payload) => {
      console.log(`Realtime ${payload.eventType} on ${table}:`, payload);

      switch (payload.eventType) {
        case 'INSERT':
          onInsert?.(payload);
          break;
        case 'UPDATE':
          onUpdate?.(payload);
          break;
        case 'DELETE':
          onDelete?.(payload);
          break;
      }

      onChange?.(payload);
    });

    // S'abonner
    channel.subscribe((status) => {
      console.log(`Realtime ${table} status:`, status);
    });

    channelRef.current = channel;

    // Cleanup
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [options.table, options.event, options.filter]);

  return channelRef.current;
};
