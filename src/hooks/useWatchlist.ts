import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface WatchlistItem {
  id: string;
  symbol: string;
  added_price: number | null;
  quantity: number | null;
  created_at: string | null;
}

export function useWatchlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlists')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as WatchlistItem[];
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: async ({ symbol, price }: { symbol: string; price?: number }) => {
      const { error } = await supabase.from('watchlists').insert({
        user_id: user!.id,
        symbol,
        added_price: price || null,
      });
      if (error) throw error;
    },
    onSuccess: (_, { symbol }) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success(`${symbol} added to watchlist`);
    },
    onError: (err: any) => {
      if (err.message?.includes('duplicate')) toast.info('Already in watchlist');
      else toast.error('Failed to add');
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (symbol: string) => {
      const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', user!.id)
        .eq('symbol', symbol);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Removed from watchlist');
    },
  });

  const symbols = watchlist.map(w => w.symbol);
  const isInWatchlist = (symbol: string) => symbols.includes(symbol);
  const toggle = (symbol: string, price?: number) => {
    if (isInWatchlist(symbol)) removeMutation.mutate(symbol);
    else addMutation.mutate({ symbol, price });
  };

  return { watchlist, symbols, isLoading, isInWatchlist, toggle, add: addMutation.mutate, remove: removeMutation.mutate };
}
