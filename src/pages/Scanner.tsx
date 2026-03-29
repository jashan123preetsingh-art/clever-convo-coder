import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SCANNERS, runScanner } from '@/data/mockData';
import { formatCurrency, formatPercent, formatVolume } from '@/utils/format';
import type { Stock } from '@/data/mockData';

const CATEGORIES = ['All Scans', 'MVP Picks', 'Price Levels', 'Performance', 'Volume'];

export default function Scanner() {
  const { key: activeKey } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Scans');
  const [searchTerm, setSearchTerm] = useState('');

  const results = activeKey ? runScanner(activeKey) : null;
  const activeScan = SCANNERS.find(s => s.key === activeKey);

  const filteredScanners = SCANNERS.filter(s => {
    if (activeCategory !== 'All Scans' && s.category !== activeCategory) return false;
    if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-3 max-w-[1600px] mx-auto">
      <div className="mb-3">
        <h1 className="text-sm font-bold text-foreground tracking-wide">MARKET SCANNERS</h1>
        <p className="text-[10px] text-muted-foreground mt-0.5">Institutional-grade price action scanning across NSE & BSE</p>
      </div>

      <div className="flex gap-3">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0">
          <input type="text" placeholder="Search scans..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-secondary border border-border rounded-sm px-2 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground w-full focus:outline-none focus:border-primary mb-3" />
          <div className="flex gap-1 mb-3 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-sm text-[9px] font-semibold transition-all border ${activeCategory === cat ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary text-muted-foreground border-border hover:text-foreground'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="space-y-0.5 max-h-[500px] overflow-y-auto">
            {filteredScanners.map(scanner => (
              <button key={scanner.key} onClick={() => navigate(`/scanner/${scanner.key}`)}
                className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-sm text-[11px] transition-all ${activeKey === scanner.key ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                <span>{scanner.icon}</span>
                <span className="truncate">{scanner.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1">
          {!activeKey ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredScanners.map((scanner, i) => (
                <motion.div key={scanner.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  onClick={() => navigate(`/scanner/${scanner.key}`)}
                  className="t-card cursor-pointer hover:border-primary/30 transition-all group">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-[11px] font-semibold text-foreground group-hover:text-primary transition-colors">{scanner.name}</h3>
                    <span className="text-sm">{scanner.icon}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground">{scanner.description}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span>{activeScan?.icon}</span> {activeScan?.name}
                  </h2>
                  <p className="text-[9px] text-muted-foreground">{activeScan?.description} — {results?.length} stocks found</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${(results?.length || 0) > 0 ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  {results?.length} results
                </span>
              </div>
              {results && results.length > 0 ? (
                <div className="t-card overflow-hidden">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2 text-muted-foreground font-medium text-[10px]">Symbol</th>
                        <th className="text-right p-2 text-muted-foreground font-medium text-[10px]">LTP</th>
                        <th className="text-right p-2 text-muted-foreground font-medium text-[10px]">Change%</th>
                        <th className="text-right p-2 text-muted-foreground font-medium text-[10px] hidden md:table-cell">Volume</th>
                        <th className="text-right p-2 text-muted-foreground font-medium text-[10px] hidden lg:table-cell">52W Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((stock: Stock, i: number) => (
                        <tr key={stock.symbol} className="border-b border-border/30 hover:bg-secondary/50 transition-colors">
                          <td className="p-2">
                            <Link to={`/stock/${stock.symbol}`} className="hover:text-primary transition-colors">
                              <p className="font-semibold text-foreground">{stock.symbol}</p>
                              <p className="text-[9px] text-muted-foreground truncate max-w-[150px]">{stock.name}</p>
                            </Link>
                          </td>
                          <td className="p-2 text-right text-foreground">{formatCurrency(stock.ltp)}</td>
                          <td className="p-2 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${stock.change_pct >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                              {formatPercent(stock.change_pct)}
                            </span>
                          </td>
                          <td className="p-2 text-right text-muted-foreground hidden md:table-cell">{formatVolume(stock.volume)}</td>
                          <td className="p-2 text-right text-muted-foreground hidden lg:table-cell">
                            {formatCurrency(stock.week_52_low)} - {formatCurrency(stock.week_52_high)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="t-card p-12 text-center">
                  <p className="text-muted-foreground text-[11px]">No stocks match this scanner's criteria</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
