import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllStocks } from '@/data/mockData';
import { formatCurrency, formatPercent, formatMarketCap } from '@/utils/format';

const PRESET_SCREENS = [
  { name: 'High ROE + Low Debt', filters: { minROE: 20, maxDebt: 0.5 } },
  { name: 'Value Picks (Low PE)', filters: { maxPE: 15, minROE: 12 } },
  { name: 'Growth Stars', filters: { minROE: 18, minROCE: 15 } },
  { name: 'Dividend Champions', filters: { minDividend: 3 } },
];

export default function Screener() {
  const [sortKey, setSortKey] = useState('market_cap');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, number | undefined>>({});

  const stocks = getAllStocks();

  const filtered = stocks
    .filter(s => {
      if (searchTerm && !s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) && !s.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.maxPE && (s.pe_ratio || 999) > filters.maxPE) return false;
      if (filters.minROE && (s.roe || 0) < filters.minROE) return false;
      if (filters.minROCE && (s.roce || 0) < filters.minROCE) return false;
      if (filters.maxDebt && (s.debt_to_equity || 999) > filters.maxDebt) return false;
      if (filters.minDividend && (s.dividend_yield || 0) < filters.minDividend) return false;
      return true;
    })
    .sort((a, b) => {
      const av = (a as any)[sortKey] || 0;
      const bv = (b as any)[sortKey] || 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  return (
    <div className="p-3 max-w-[1600px] mx-auto">
      <div className="mb-3">
        <h1 className="text-sm font-bold text-foreground tracking-wide">FUNDAMENTAL SCREENER</h1>
        <p className="text-[10px] text-muted-foreground mt-0.5">Screen Indian stocks by fundamental metrics</p>
      </div>

      <div className="flex gap-1 mb-3 flex-wrap">
        {PRESET_SCREENS.map((screen, i) => (
          <button key={i} onClick={() => setFilters(screen.filters as any)}
            className="px-2.5 py-1 rounded-sm text-[9px] font-semibold bg-secondary text-muted-foreground border border-border hover:border-terminal-blue/30 hover:text-terminal-blue transition-all">
            {screen.name}
          </button>
        ))}
        <button onClick={() => setFilters({})} className="px-2.5 py-1 rounded-sm text-[9px] text-muted-foreground hover:text-foreground">Clear</button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <input type="text" placeholder="Search symbol or name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-secondary border border-border rounded-sm px-2 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground w-56 focus:outline-none focus:border-primary" />
        <span className="text-[9px] text-muted-foreground">{filtered.length} stocks</span>
      </div>

      <div className="t-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-border">
                {[
                  { key: 'symbol', label: 'Symbol' }, { key: 'ltp', label: 'LTP' }, { key: 'change_pct', label: 'Chg%' },
                  { key: 'market_cap', label: 'MCap' }, { key: 'pe_ratio', label: 'P/E' }, { key: 'roe', label: 'ROE%' },
                  { key: 'roce', label: 'ROCE%' }, { key: 'debt_to_equity', label: 'D/E' }, { key: 'dividend_yield', label: 'Div%' },
                ].map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)}
                    className={`p-2 text-muted-foreground font-medium cursor-pointer hover:text-foreground text-left ${sortKey === col.key ? 'text-primary' : ''}`}>
                    {col.label} {sortKey === col.key && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((stock, i) => (
                <motion.tr key={stock.symbol} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}
                  className="border-b border-border/30 hover:bg-secondary/50">
                  <td className="p-2"><Link to={`/stock/${stock.symbol}`} className="hover:text-primary"><p className="font-semibold text-foreground">{stock.symbol}</p><p className="text-[8px] text-muted-foreground truncate max-w-[100px]">{stock.name}</p></Link></td>
                  <td className="p-2 text-right text-foreground">{formatCurrency(stock.ltp)}</td>
                  <td className="p-2 text-right"><span className={`px-1 py-0.5 rounded text-[9px] font-semibold ${stock.change_pct >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>{formatPercent(stock.change_pct)}</span></td>
                  <td className="p-2 text-right text-muted-foreground">{formatMarketCap(stock.market_cap)}</td>
                  <td className="p-2 text-right text-muted-foreground">{stock.pe_ratio || '—'}</td>
                  <td className="p-2 text-right"><span className={(stock.roe || 0) >= 15 ? 'text-terminal-green' : 'text-muted-foreground'}>{stock.roe ? `${stock.roe}%` : '—'}</span></td>
                  <td className="p-2 text-right"><span className={(stock.roce || 0) >= 15 ? 'text-terminal-green' : 'text-muted-foreground'}>{stock.roce ? `${stock.roce}%` : '—'}</span></td>
                  <td className="p-2 text-right"><span className={(stock.debt_to_equity || 0) <= 0.5 ? 'text-terminal-green' : (stock.debt_to_equity || 0) > 1 ? 'text-terminal-red' : 'text-muted-foreground'}>{stock.debt_to_equity ?? '—'}</span></td>
                  <td className="p-2 text-right text-muted-foreground">{stock.dividend_yield ? `${stock.dividend_yield}%` : '—'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
