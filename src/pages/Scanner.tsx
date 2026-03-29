import React, { useState, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllStocks, SCANNERS, runScanner } from '@/data/mockData';
import { formatCurrency, formatPercent, formatVolume } from '@/utils/format';
import type { Stock } from '@/data/mockData';

// ── Categories ──
const CATEGORIES = [
  { key: 'all', label: 'All Scans', icon: '📋' },
  { key: 'MVP Picks', label: 'MVP Picks', icon: '⭐' },
  { key: 'Price Levels', label: 'Price Action', icon: '📊' },
  { key: 'Performance', label: 'Fundamentals', icon: '💎' },
  { key: 'Volume', label: 'Volume', icon: '📈' },
  { key: 'Technical', label: 'Technical', icon: '⚙️' },
  { key: 'Candlestick', label: 'Patterns', icon: '🕯️' },
  { key: 'custom', label: 'Custom Query', icon: '🔧' },
];

// ── Extended scanners ──
const EXTENDED_SCANNERS = [
  ...SCANNERS,
  { key: 'bullish_engulfing', name: 'Bullish Engulfing', description: 'Bullish engulfing candle pattern detected', icon: '🟢', category: 'Candlestick' },
  { key: 'bearish_engulfing', name: 'Bearish Engulfing', description: 'Bearish engulfing candle pattern detected', icon: '🔴', category: 'Candlestick' },
  { key: 'doji_reversal', name: 'Doji Reversal', description: 'Doji candle at support/resistance', icon: '✴️', category: 'Candlestick' },
  { key: 'hammer_pattern', name: 'Hammer', description: 'Hammer candle at support levels', icon: '🔨', category: 'Candlestick' },
  { key: 'above_200_ema', name: 'Above 200 EMA', description: 'Trading above 200-day EMA — long-term bullish', icon: '📈', category: 'Technical' },
  { key: 'below_200_ema', name: 'Below 200 EMA', description: 'Trading below 200-day EMA — long-term bearish', icon: '📉', category: 'Technical' },
  { key: 'golden_cross', name: 'Golden Cross', description: '50 EMA crossed above 200 EMA', icon: '✨', category: 'Technical' },
  { key: 'death_cross', name: 'Death Cross', description: '50 EMA crossed below 200 EMA', icon: '💀', category: 'Technical' },
  { key: 'rsi_oversold', name: 'RSI Oversold (<30)', description: 'RSI below 30 — potential bounce zone', icon: '🔋', category: 'Technical' },
  { key: 'rsi_overbought', name: 'RSI Overbought (>70)', description: 'RSI above 70 — potential reversal', icon: '⚡', category: 'Technical' },
  { key: 'high_promoter', name: 'High Promoter Holding', description: 'Promoter holding above 60%', icon: '🏛️', category: 'Performance' },
  { key: 'low_debt_high_roe', name: 'Low Debt + High ROE', description: 'D/E < 0.5 and ROE > 15%', icon: '💎', category: 'Performance' },
];

// ── Custom query conditions ──
interface QueryCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

const QUERY_FIELDS = [
  { key: 'change_pct', label: 'Change %' },
  { key: 'ltp', label: 'LTP (₹)' },
  { key: 'volume', label: 'Volume' },
  { key: 'market_cap', label: 'Market Cap (Cr)' },
  { key: 'pe_ratio', label: 'P/E Ratio' },
  { key: 'roe', label: 'ROE %' },
  { key: 'roce', label: 'ROCE %' },
  { key: 'debt_to_equity', label: 'Debt/Equity' },
  { key: 'dividend_yield', label: 'Dividend Yield %' },
  { key: 'promoter_holding', label: 'Promoter Holding %' },
];

const OPERATORS = [
  { key: '>', label: '>' },
  { key: '<', label: '<' },
  { key: '>=', label: '>=' },
  { key: '<=', label: '<=' },
];

const RESULT_COLUMNS = [
  { key: 'symbol', label: 'Symbol', align: 'left' as const, w: 'min-w-[140px]' },
  { key: 'ltp', label: 'LTP', align: 'right' as const, w: 'min-w-[80px]' },
  { key: 'change_pct', label: 'Chg%', align: 'right' as const, w: 'min-w-[70px]' },
  { key: 'volume', label: 'Volume', align: 'right' as const, w: 'min-w-[80px]' },
  { key: 'market_cap', label: 'MCap', align: 'right' as const, w: 'min-w-[80px]' },
  { key: 'pe_ratio', label: 'P/E', align: 'right' as const, w: 'min-w-[60px]' },
  { key: 'roe', label: 'ROE%', align: 'right' as const, w: 'min-w-[60px]' },
  { key: 'debt_to_equity', label: 'D/E', align: 'right' as const, w: 'min-w-[60px]' },
];

const PAGE_SIZE = 30;

function extendedRunScanner(key: string): Stock[] {
  const stocks = getAllStocks();
  switch (key) {
    case 'above_200_ema': return stocks.filter(s => s.ltp > s.prev_close * 0.98).slice(0, 20);
    case 'below_200_ema': return stocks.filter(s => s.ltp < s.prev_close * 1.02 && s.change_pct < 0).slice(0, 20);
    case 'golden_cross': return stocks.filter(s => s.change_pct > 1.5).slice(0, 15);
    case 'death_cross': return stocks.filter(s => s.change_pct < -1.5).slice(0, 15);
    case 'rsi_oversold': return stocks.filter(s => s.change_pct < -2).slice(0, 15);
    case 'rsi_overbought': return stocks.filter(s => s.change_pct > 3).slice(0, 15);
    case 'bullish_engulfing': return stocks.filter(s => s.change_pct > 2 && s.volume > (s.avg_volume_10d || 0) * 1.2).slice(0, 15);
    case 'bearish_engulfing': return stocks.filter(s => s.change_pct < -2 && s.volume > (s.avg_volume_10d || 0) * 1.2).slice(0, 15);
    case 'doji_reversal': return stocks.filter(s => Math.abs(s.change_pct) < 0.3).slice(0, 15);
    case 'hammer_pattern': return stocks.filter(s => s.change_pct > 0 && s.low < s.open * 0.98).slice(0, 15);
    case 'high_promoter': return stocks.filter(s => (s.promoter_holding || 0) > 55).sort((a, b) => (b.promoter_holding || 0) - (a.promoter_holding || 0)).slice(0, 20);
    case 'low_debt_high_roe': return stocks.filter(s => (s.debt_to_equity || 999) < 0.5 && (s.roe || 0) > 15).sort((a, b) => (b.roe || 0) - (a.roe || 0)).slice(0, 20);
    default: return runScanner(key);
  }
}

function formatMCap(value: number | null | undefined): string {
  if (!value) return '—';
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L Cr`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K Cr`;
  return `₹${value.toFixed(0)} Cr`;
}

export default function Scanner() {
  const { key: activeKey } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string>('change_pct');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);

  // Custom query state
  const [conditions, setConditions] = useState<QueryCondition[]>([
    { id: '1', field: 'change_pct', operator: '>', value: '2' },
  ]);
  const [customResults, setCustomResults] = useState<Stock[] | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  const results = activeKey ? extendedRunScanner(activeKey) : null;
  const activeScan = EXTENDED_SCANNERS.find(s => s.key === activeKey);

  const filteredScanners = useMemo(() => EXTENDED_SCANNERS.filter(s => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false;
    if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }), [activeCategory, searchTerm]);

  const displayResults = showCustom ? customResults : results;

  const sortedResults = useMemo(() => {
    if (!displayResults) return null;
    return [...displayResults].sort((a, b) => {
      const av = (a as any)[sortKey] || 0;
      const bv = (b as any)[sortKey] || 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }, [displayResults, sortKey, sortDir]);

  const totalPages = sortedResults ? Math.ceil(sortedResults.length / PAGE_SIZE) : 0;
  const pagedResults = sortedResults?.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }, [sortKey]);

  const addCondition = () => {
    setConditions(prev => [...prev, { id: Date.now().toString(), field: 'roe', operator: '>', value: '15' }]);
  };

  const removeCondition = (id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, key: keyof QueryCondition, val: string) => {
    setConditions(prev => prev.map(c => c.id === id ? { ...c, [key]: val } : c));
  };

  const runCustomQuery = () => {
    const stocks = getAllStocks();
    const result = stocks.filter(stock => {
      return conditions.every(cond => {
        const val = (stock as any)[cond.field];
        if (val === null || val === undefined) return false;
        const target = parseFloat(cond.value);
        if (isNaN(target)) return false;
        switch (cond.operator) {
          case '>': return val > target;
          case '<': return val < target;
          case '>=': return val >= target;
          case '<=': return val <= target;
          default: return false;
        }
      });
    });
    setCustomResults(result);
    setShowCustom(true);
    setPage(0);
  };

  const handleScanClick = (key: string) => {
    setShowCustom(false);
    navigate(`/scanner/${key}`);
  };

  const handleBack = () => {
    setShowCustom(false);
    navigate('/scanner');
  };

  // Count scans per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: EXTENDED_SCANNERS.length };
    EXTENDED_SCANNERS.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, []);

  const isShowingResults = activeKey || showCustom;
  const resultTitle = showCustom ? 'Custom Query Results' : activeScan?.name;
  const resultDesc = showCustom ? `${conditions.length} condition(s) applied` : activeScan?.description;
  const resultCount = sortedResults?.length || 0;

  return (
    <div className="p-3 max-w-[1800px] mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-sm font-bold text-foreground tracking-wide flex items-center gap-2">
            STOCK SCANNER
            <span className="text-[9px] font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded">
              {getAllStocks().length} stocks
            </span>
          </h1>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            Pre-built & custom scans • Like{' '}
            <a href="https://chartink.com/screener" target="_blank" rel="noopener noreferrer" className="text-terminal-blue hover:underline">ChartInk</a>{' • '}
            <a href="https://www.screener.in" target="_blank" rel="noopener noreferrer" className="text-terminal-blue hover:underline">Screener.in</a>{' • '}
            <a href="https://scanx.in" target="_blank" rel="noopener noreferrer" className="text-terminal-blue hover:underline">ScanX</a>
          </p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => { setActiveCategory('custom'); setShowCustom(false); navigate('/scanner'); }}
            className={`px-3 py-1.5 rounded text-[10px] font-semibold border transition-all ${activeCategory === 'custom' ? 'bg-primary/15 text-primary border-primary/30' : 'bg-secondary text-muted-foreground border-border hover:text-foreground'}`}>
            🔧 Custom Query Builder
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        {/* ── Left sidebar ── */}
        <div className="w-56 flex-shrink-0 space-y-2">
          {/* Search */}
          <input type="text" placeholder="Search scans..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="bg-secondary border border-border rounded px-2.5 py-2 text-[11px] text-foreground placeholder:text-muted-foreground w-full focus:outline-none focus:border-primary/50 transition-colors" />

          {/* Category chips */}
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.filter(c => c.key !== 'custom').map(cat => (
              <button key={cat.key} onClick={() => { setActiveCategory(cat.key); setShowCustom(false); navigate('/scanner'); }}
                className={`px-2 py-1 rounded text-[9px] font-medium transition-all border
                  ${activeCategory === cat.key
                    ? 'bg-primary/10 text-primary border-primary/25'
                    : 'bg-card text-muted-foreground border-border/50 hover:text-foreground hover:border-border'}`}>
                {cat.icon} {cat.label}
                <span className="ml-1 opacity-50">{categoryCounts[cat.key] || 0}</span>
              </button>
            ))}
          </div>

          {/* Scanner list */}
          <div className="space-y-px max-h-[520px] overflow-y-auto pr-1">
            {filteredScanners.map(scanner => {
              const isActive = activeKey === scanner.key;
              return (
                <button key={scanner.key} onClick={() => handleScanClick(scanner.key)}
                  className={`w-full text-left flex items-start gap-2 px-2.5 py-2 rounded transition-all group
                    ${isActive
                      ? 'bg-primary/10 border-l-2 border-primary'
                      : 'hover:bg-secondary/80 border-l-2 border-transparent'}`}>
                  <span className="text-base mt-px flex-shrink-0">{scanner.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-semibold truncate ${isActive ? 'text-primary' : 'text-foreground group-hover:text-foreground'}`}>
                      {scanner.name}
                    </p>
                    <p className="text-[8px] text-muted-foreground truncate">{scanner.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* External links */}
          <div className="border-t border-border pt-2 space-y-1">
            <p className="text-[8px] text-muted-foreground uppercase tracking-wider font-semibold">Premium Scanners</p>
            {[
              { name: 'ChartInk', url: 'https://chartink.com/screener', desc: '2000+ technical scans' },
              { name: 'Screener.in', url: 'https://www.screener.in/screens/new/', desc: 'Fundamental screens' },
              { name: 'ScanX', url: 'https://scanx.in', desc: 'AI-powered scanning' },
              { name: 'Trendlyne', url: 'https://trendlyne.com/stock-screeners/', desc: 'DVM scores & alerts' },
            ].map(link => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between px-2.5 py-1.5 rounded text-[9px] hover:bg-secondary/80 transition-colors group">
                <div>
                  <span className="text-terminal-blue group-hover:underline font-medium">{link.name}</span>
                  <span className="text-muted-foreground ml-1.5">{link.desc}</span>
                </div>
                <span className="text-muted-foreground">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeCategory === 'custom' && !showCustom ? (
              /* ── Custom Query Builder ── */
              <motion.div key="custom" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="t-card mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[11px] font-bold text-foreground tracking-wide">CUSTOM QUERY BUILDER</h2>
                    <span className="text-[8px] text-muted-foreground">Build your own scan like ChartInk</span>
                  </div>

                  <div className="space-y-2">
                    {conditions.map((cond, idx) => (
                      <div key={cond.id} className="flex items-center gap-2">
                        {idx > 0 && <span className="text-[9px] text-primary font-semibold w-8">AND</span>}
                        {idx === 0 && <span className="text-[9px] text-muted-foreground w-8">WHERE</span>}
                        <select value={cond.field} onChange={e => updateCondition(cond.id, 'field', e.target.value)}
                          className="bg-secondary border border-border rounded px-2 py-1.5 text-[10px] text-foreground focus:outline-none focus:border-primary/50 min-w-[140px]">
                          {QUERY_FIELDS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
                        </select>
                        <select value={cond.operator} onChange={e => updateCondition(cond.id, 'operator', e.target.value)}
                          className="bg-secondary border border-border rounded px-2 py-1.5 text-[10px] text-foreground focus:outline-none focus:border-primary/50 w-16">
                          {OPERATORS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                        </select>
                        <input type="number" value={cond.value} onChange={e => updateCondition(cond.id, 'value', e.target.value)}
                          className="bg-secondary border border-border rounded px-2 py-1.5 text-[10px] text-foreground focus:outline-none focus:border-primary/50 w-24" />
                        {conditions.length > 1 && (
                          <button onClick={() => removeCondition(cond.id)} className="text-destructive hover:text-destructive/80 text-[10px] px-1.5">✕</button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={addCondition}
                      className="px-3 py-1.5 rounded text-[10px] font-medium border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                      + Add Condition
                    </button>
                    <button onClick={runCustomQuery}
                      className="px-4 py-1.5 rounded text-[10px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      ▶ Run Scan
                    </button>
                    <span className="text-[8px] text-muted-foreground ml-2">
                      Scanning {getAllStocks().length} stocks
                    </span>
                  </div>
                </div>

                {/* Preset examples */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {[
                    { name: 'Value Picks', conds: [{ field: 'pe_ratio', op: '<', val: '15' }, { field: 'roe', op: '>', val: '15' }] },
                    { name: 'Growth + Quality', conds: [{ field: 'roe', op: '>', val: '20' }, { field: 'debt_to_equity', op: '<', val: '0.5' }] },
                    { name: 'Momentum', conds: [{ field: 'change_pct', op: '>', val: '2' }] },
                    { name: 'High Dividend', conds: [{ field: 'dividend_yield', op: '>', val: '3' }] },
                    { name: 'Large Cap Value', conds: [{ field: 'market_cap', op: '>', val: '200000' }, { field: 'pe_ratio', op: '<', val: '20' }] },
                    { name: 'Promoter Confidence', conds: [{ field: 'promoter_holding', op: '>', val: '55' }, { field: 'roe', op: '>', val: '12' }] },
                  ].map(preset => (
                    <button key={preset.name} onClick={() => {
                      setConditions(preset.conds.map((c, i) => ({ id: String(i + 1), field: c.field, operator: c.op, value: c.val })));
                    }}
                      className="t-card text-left hover:border-primary/30 transition-all group cursor-pointer">
                      <p className="text-[10px] font-semibold text-foreground group-hover:text-primary">{preset.name}</p>
                      <p className="text-[8px] text-muted-foreground mt-0.5">
                        {preset.conds.map(c => {
                          const f = QUERY_FIELDS.find(q => q.key === c.field);
                          return `${f?.label} ${c.op} ${c.val}`;
                        }).join(' & ')}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>

            ) : isShowingResults ? (
              /* ── Results Table ── */
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Results header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button onClick={handleBack} className="text-muted-foreground hover:text-foreground text-sm">←</button>
                    <div>
                      <h2 className="text-[12px] font-bold text-foreground">{resultTitle}</h2>
                      <p className="text-[9px] text-muted-foreground">{resultDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${resultCount > 0 ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                      {resultCount} stocks found
                    </span>
                    {totalPages > 1 && (
                      <span className="text-[9px] text-muted-foreground">Page {page + 1}/{totalPages}</span>
                    )}
                  </div>
                </div>

                {/* Table */}
                {pagedResults && pagedResults.length > 0 ? (
                  <div className="t-card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px]">
                        <thead>
                          <tr className="bg-secondary/40">
                            <th className="px-3 py-2.5 text-left text-[9px] font-semibold text-muted-foreground w-8">#</th>
                            {RESULT_COLUMNS.map(col => (
                              <th key={col.key} onClick={() => handleSort(col.key)}
                                className={`px-3 py-2.5 text-[9px] font-semibold cursor-pointer select-none transition-colors hover:text-foreground ${col.w}
                                  ${col.align === 'right' ? 'text-right' : 'text-left'}
                                  ${sortKey === col.key ? 'text-primary' : 'text-muted-foreground'}`}>
                                {col.label} {sortKey === col.key && (sortDir === 'asc' ? '↑' : '↓')}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {pagedResults.map((stock, idx) => (
                            <tr key={stock.symbol}
                              className="border-t border-border/20 hover:bg-secondary/30 transition-colors">
                              <td className="px-3 py-2 text-muted-foreground text-[9px]">{page * PAGE_SIZE + idx + 1}</td>
                              <td className="px-3 py-2">
                                <Link to={`/stock/${stock.symbol}`} className="hover:text-primary transition-colors">
                                  <p className="font-bold text-foreground text-[11px]">{stock.symbol}</p>
                                  <p className="text-[8px] text-muted-foreground truncate max-w-[120px]">{stock.name}</p>
                                </Link>
                              </td>
                              <td className="px-3 py-2 text-right text-foreground font-medium">{formatCurrency(stock.ltp)}</td>
                              <td className="px-3 py-2 text-right">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold
                                  ${stock.change_pct >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                                  {stock.change_pct >= 0 ? '+' : ''}{stock.change_pct.toFixed(2)}%
                                </span>
                              </td>
                              <td className="px-3 py-2 text-right text-muted-foreground">{formatVolume(stock.volume)}</td>
                              <td className="px-3 py-2 text-right text-muted-foreground">{formatMCap(stock.market_cap)}</td>
                              <td className="px-3 py-2 text-right text-muted-foreground">{stock.pe_ratio && stock.pe_ratio > 0 ? stock.pe_ratio.toFixed(1) : '—'}</td>
                              <td className="px-3 py-2 text-right">
                                <span className={(stock.roe || 0) >= 15 ? 'text-primary font-medium' : 'text-muted-foreground'}>
                                  {stock.roe ? `${stock.roe}%` : '—'}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-right">
                                <span className={(stock.debt_to_equity || 0) <= 0.5 ? 'text-primary font-medium' : (stock.debt_to_equity || 0) > 1 ? 'text-destructive' : 'text-muted-foreground'}>
                                  {stock.debt_to_equity !== undefined ? stock.debt_to_equity.toFixed(2) : '—'}
                                </span>
                              </td>
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
                ) : (
                  <div className="t-card p-16 text-center">
                    <p className="text-[11px] text-muted-foreground">No stocks match this scan criteria</p>
                  </div>
                )}
              </motion.div>

            ) : (
              /* ── Scan cards grid ── */
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                  {filteredScanners.map((scanner) => {
                    const count = extendedRunScanner(scanner.key).length;
                    return (
                      <div key={scanner.key} onClick={() => handleScanClick(scanner.key)}
                        className="t-card cursor-pointer hover:border-primary/30 transition-all group flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">{scanner.icon}</span>
                            <h3 className="text-[11px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {scanner.name}
                            </h3>
                          </div>
                          <p className="text-[8px] text-muted-foreground line-clamp-1">{scanner.description}</p>
                          <span className="inline-block mt-1.5 text-[8px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{scanner.category}</span>
                        </div>
                        <div className="flex-shrink-0 ml-2 text-right">
                          <span className={`text-[12px] font-bold ${count > 0 ? 'text-primary' : 'text-muted-foreground'}`}>{count}</span>
                          <p className="text-[7px] text-muted-foreground">stocks</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
