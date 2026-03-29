import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllStocks } from '@/data/mockData';
import { formatCurrency, formatPercent } from '@/utils/format';

// ── Filter config ──
interface FilterRange {
  min?: number;
  max?: number;
}

interface FilterState {
  pe_ratio: FilterRange;
  roe: FilterRange;
  roce: FilterRange;
  debt_to_equity: FilterRange;
  dividend_yield: FilterRange;
  market_cap: FilterRange;
  promoter_holding: FilterRange;
  change_pct: FilterRange;
}

const EMPTY_FILTERS: FilterState = {
  pe_ratio: {}, roe: {}, roce: {}, debt_to_equity: {},
  dividend_yield: {}, market_cap: {}, promoter_holding: {}, change_pct: {},
};

const FILTER_DEFS = [
  { key: 'pe_ratio' as const, label: 'P/E Ratio', unit: '' },
  { key: 'roe' as const, label: 'ROE', unit: '%' },
  { key: 'roce' as const, label: 'ROCE', unit: '%' },
  { key: 'debt_to_equity' as const, label: 'Debt/Equity', unit: '' },
  { key: 'dividend_yield' as const, label: 'Dividend Yield', unit: '%' },
  { key: 'market_cap' as const, label: 'Market Cap', unit: 'Cr' },
  { key: 'promoter_holding' as const, label: 'Promoter Holding', unit: '%' },
  { key: 'change_pct' as const, label: 'Day Change', unit: '%' },
];

const PRESET_SCREENS = [
  { name: 'All Stocks', icon: '📋', filters: EMPTY_FILTERS },
  { name: 'High ROE + Low Debt', icon: '🏆', filters: { ...EMPTY_FILTERS, roe: { min: 20 }, debt_to_equity: { max: 0.5 } } },
  { name: 'Value Picks', icon: '💎', filters: { ...EMPTY_FILTERS, pe_ratio: { max: 15 }, roe: { min: 12 } } },
  { name: 'Growth Stars', icon: '🚀', filters: { ...EMPTY_FILTERS, roe: { min: 18 }, roce: { min: 15 } } },
  { name: 'Dividend Champs', icon: '💰', filters: { ...EMPTY_FILTERS, dividend_yield: { min: 3 } } },
  { name: 'Blue Chips', icon: '🛡️', filters: { ...EMPTY_FILTERS, market_cap: { min: 200000 }, debt_to_equity: { max: 1 } } },
  { name: 'Quality Score', icon: '⭐', filters: { ...EMPTY_FILTERS, roe: { min: 15 }, roce: { min: 15 }, debt_to_equity: { max: 0.5 } } },
];

const COLUMNS = [
  { key: 'symbol', label: 'Stock', align: 'left' as const },
  { key: 'ltp', label: 'LTP', align: 'right' as const },
  { key: 'change_pct', label: 'Chg%', align: 'right' as const },
  { key: 'market_cap', label: 'MCap', align: 'right' as const },
  { key: 'pe_ratio', label: 'P/E', align: 'right' as const },
  { key: 'roe', label: 'ROE%', align: 'right' as const },
  { key: 'roce', label: 'ROCE%', align: 'right' as const },
  { key: 'debt_to_equity', label: 'D/E', align: 'right' as const },
  { key: 'dividend_yield', label: 'Div%', align: 'right' as const },
  { key: 'promoter_holding', label: 'Prom%', align: 'right' as const },
];

const PAGE_SIZE = 40;

function formatMCap(v: number | null | undefined): string {
  if (!v) return '—';
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L Cr`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K Cr`;
  return `₹${v.toFixed(0)} Cr`;
}

export default function Screener() {
  const [sortKey, setSortKey] = useState('market_cap');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [activePreset, setActivePreset] = useState('All Stocks');
  const [showFilters, setShowFilters] = useState(true);

  const stocks = getAllStocks();

  const filtered = useMemo(() => {
    return stocks
      .filter(s => {
        if (searchTerm && !s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) && !s.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        // Apply range filters
        for (const def of FILTER_DEFS) {
          const f = filters[def.key];
          const val = (s as any)[def.key];
          if (f.min !== undefined && (val === null || val === undefined || val < f.min)) return false;
          if (f.max !== undefined && (val === null || val === undefined || val > f.max)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const av = (a as any)[sortKey] || 0;
        const bv = (b as any)[sortKey] || 0;
        return sortDir === 'asc' ? av - bv : bv - av;
      });
  }, [stocks, searchTerm, filters, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }, [sortKey]);

  const handlePreset = (preset: typeof PRESET_SCREENS[0]) => {
    setFilters(preset.filters);
    setActivePreset(preset.name);
    setPage(0);
  };

  const updateFilter = (key: keyof FilterState, field: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value === '' ? undefined : parseFloat(value) },
    }));
    setActivePreset('');
    setPage(0);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setActivePreset('All Stocks');
    setPage(0);
  };

  const activeFilterCount = FILTER_DEFS.filter(d => filters[d.key].min !== undefined || filters[d.key].max !== undefined).length;

  return (
    <div className="p-3 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-2">
            STOCK SCREENER
            <span className="text-[9px] font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded">
              {stocks.length} stocks
            </span>
          </h1>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            Screen by fundamentals • Like{' '}
            <a href="https://www.screener.in" target="_blank" rel="noopener noreferrer" className="text-terminal-blue hover:underline">Screener.in</a>{' • '}
            <a href="https://www.trendlyne.com/stock-screeners/" target="_blank" rel="noopener noreferrer" className="text-terminal-blue hover:underline">Trendlyne</a>{' • '}
            <a href="https://chartink.com/screener" target="_blank" rel="noopener noreferrer" className="text-terminal-blue hover:underline">ChartInk</a>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(v => !v)}
            className={`px-3 py-1.5 rounded text-[10px] font-semibold border transition-all
              ${showFilters ? 'bg-primary/15 text-primary border-primary/30' : 'bg-secondary text-muted-foreground border-border hover:text-foreground'}`}>
            🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="px-2 py-1.5 rounded text-[9px] text-destructive hover:text-destructive/80 transition-colors">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Presets */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {PRESET_SCREENS.map(screen => (
          <button key={screen.name} onClick={() => handlePreset(screen)}
            className={`px-3 py-1.5 rounded text-[10px] font-semibold border transition-all
              ${activePreset === screen.name
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-card text-muted-foreground border-border/50 hover:text-foreground hover:border-border'}`}>
            {screen.icon} {screen.name}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        {/* ── Filter sidebar ── */}
        {showFilters && (
          <div className="w-52 flex-shrink-0 space-y-3">
            {FILTER_DEFS.map(def => (
              <div key={def.key}>
                <p className="text-[9px] text-muted-foreground font-semibold mb-1">{def.label} {def.unit && `(${def.unit})`}</p>
                <div className="flex gap-1.5">
                  <input type="number" placeholder="Min" step="any"
                    value={filters[def.key].min ?? ''}
                    onChange={e => updateFilter(def.key, 'min', e.target.value)}
                    className="bg-secondary border border-border rounded px-2 py-1.5 text-[10px] text-foreground placeholder:text-muted-foreground w-full focus:outline-none focus:border-primary/50 transition-colors" />
                  <input type="number" placeholder="Max" step="any"
                    value={filters[def.key].max ?? ''}
                    onChange={e => updateFilter(def.key, 'max', e.target.value)}
                    className="bg-secondary border border-border rounded px-2 py-1.5 text-[10px] text-foreground placeholder:text-muted-foreground w-full focus:outline-none focus:border-primary/50 transition-colors" />
                </div>
              </div>
            ))}

            {/* External links */}
            <div className="border-t border-border pt-2 space-y-1">
              <p className="text-[8px] text-muted-foreground uppercase tracking-wider font-semibold">Full Data Sources</p>
              {[
                { name: 'Screener.in', url: 'https://www.screener.in', desc: '4000+ stocks' },
                { name: 'Trendlyne', url: 'https://trendlyne.com/stock-screeners/', desc: 'DVM, Durability' },
                { name: 'Tickertape', url: 'https://www.tickertape.in/screener', desc: 'Custom screens' },
                { name: 'MoneyControl', url: 'https://www.moneycontrol.com/stocks/marketinfo/marketcap/nse/index.html', desc: 'Market data' },
              ].map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-2 py-1.5 rounded text-[9px] hover:bg-secondary/80 transition-colors group">
                  <div>
                    <span className="text-terminal-blue group-hover:underline font-medium">{link.name}</span>
                    <span className="text-muted-foreground ml-1">{link.desc}</span>
                  </div>
                  <span className="text-muted-foreground">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Main table ── */}
        <div className="flex-1 min-w-0">
          {/* Search + info bar */}
          <div className="flex items-center justify-between mb-2">
            <input type="text" placeholder="🔍 Search symbol or name..." value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
              className="bg-secondary border border-border rounded px-3 py-2 text-[11px] text-foreground placeholder:text-muted-foreground w-72 focus:outline-none focus:border-primary/50 transition-colors" />
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length} results</span>
              {totalPages > 1 && <span>Page {page + 1}/{totalPages}</span>}
            </div>
          </div>

          {/* Table */}
          <div className="t-card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-secondary/40">
                    <th className="px-3 py-2.5 text-left text-[9px] font-semibold text-muted-foreground w-8">#</th>
                    {COLUMNS.map(col => (
                      <th key={col.key} onClick={() => handleSort(col.key)}
                        className={`px-3 py-2.5 text-[9px] font-semibold cursor-pointer select-none transition-colors hover:text-foreground
                          ${col.align === 'right' ? 'text-right' : 'text-left'}
                          ${sortKey === col.key ? 'text-primary' : 'text-muted-foreground'}`}>
                        {col.label} {sortKey === col.key && (sortDir === 'asc' ? '↑' : '↓')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((stock, idx) => (
                    <tr key={stock.symbol} className="border-t border-border/20 hover:bg-secondary/20 transition-colors">
                      <td className="px-3 py-2 text-muted-foreground text-[9px]">{page * PAGE_SIZE + idx + 1}</td>
                      <td className="px-3 py-2">
                        <Link to={`/stock/${stock.symbol}`} className="hover:text-primary transition-colors">
                          <p className="font-bold text-foreground text-[11px]">{stock.symbol}</p>
                          <p className="text-[8px] text-muted-foreground truncate max-w-[130px]">{stock.name}</p>
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-right text-foreground font-medium">{formatCurrency(stock.ltp)}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold
                          ${stock.change_pct >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                          {formatPercent(stock.change_pct)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{formatMCap(stock.market_cap)}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{stock.pe_ratio && stock.pe_ratio > 0 ? stock.pe_ratio.toFixed(1) : '—'}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={(stock.roe || 0) >= 15 ? 'text-primary font-medium' : 'text-muted-foreground'}>{stock.roe ? `${stock.roe}%` : '—'}</span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={(stock.roce || 0) >= 15 ? 'text-primary font-medium' : 'text-muted-foreground'}>{stock.roce ? `${stock.roce}%` : '—'}</span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className={(stock.debt_to_equity || 0) <= 0.5 ? 'text-primary font-medium' : (stock.debt_to_equity || 0) > 1 ? 'text-destructive' : 'text-muted-foreground'}>
                          {stock.debt_to_equity !== undefined ? stock.debt_to_equity.toFixed(2) : '—'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{stock.dividend_yield ? `${stock.dividend_yield}%` : '—'}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{stock.promoter_holding ? `${stock.promoter_holding}%` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-3 border-t border-border/30">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="px-3 py-1 rounded text-[9px] font-medium bg-secondary text-muted-foreground border border-border hover:text-foreground disabled:opacity-30 transition-all">
                  ← Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = page < 3 ? i : Math.min(page - 2 + i, totalPages - 1);
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded text-[9px] font-semibold transition-all ${p === page ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground border border-border hover:text-foreground'}`}>
                      {p + 1}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                  className="px-3 py-1 rounded text-[9px] font-medium bg-secondary text-muted-foreground border border-border hover:text-foreground disabled:opacity-30 transition-all">
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
