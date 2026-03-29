import { create } from 'zustand';

interface StoreState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
}

const useStore = create<StoreState>((set, get) => ({
  sidebarOpen: true,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  watchlist: JSON.parse(localStorage.getItem('watchlist') || '[]'),
  addToWatchlist: (symbol: string) => {
    const current = get().watchlist;
    if (!current.includes(symbol)) {
      const updated = [...current, symbol];
      localStorage.setItem('watchlist', JSON.stringify(updated));
      set({ watchlist: updated });
    }
  },
  removeFromWatchlist: (symbol: string) => {
    const updated = get().watchlist.filter(s => s !== symbol);
    localStorage.setItem('watchlist', JSON.stringify(updated));
    set({ watchlist: updated });
  },
}));

export default useStore;
