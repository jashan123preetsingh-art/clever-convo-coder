import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface PriceAlert {
  id: string;
  symbol: string;
  condition: string;
  target_price: number;
  triggered: boolean | null;
  triggered_at: string | null;
  created_at: string | null;
}

export function usePriceAlerts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['price-alerts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as PriceAlert[];
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  const addAlert = useMutation({
    mutationFn: async (alert: { symbol: string; condition: string; target_price: number }) => {
      const { error } = await supabase.from('price_alerts').insert({
        user_id: user!.id,
        ...alert,
      });
      if (error) throw error;
    },
    onSuccess: (_, { symbol, condition, target_price }) => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      toast.success(`Alert set: ${symbol} ${condition} ₹${target_price}`);
    },
    onError: () => toast.error('Failed to create alert'),
  });

  const removeAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('price_alerts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
    },
  });

  const activeAlerts = alerts.filter(a => !a.triggered);
  const triggeredAlerts = alerts.filter(a => a.triggered);

  return { alerts, activeAlerts, triggeredAlerts, isLoading, addAlert: addAlert.mutate, removeAlert: removeAlert.mutate };
}
