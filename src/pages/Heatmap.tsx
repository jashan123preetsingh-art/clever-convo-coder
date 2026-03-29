import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllStocks, getSectorPerformance } from '@/data/mockData';
import { formatPercent } from '@/utils/format';

function getHeatColor(changePct: number): string {
  if (changePct >= 3) return 'bg-green-600';
  if (changePct >= 2) return 'bg-green-700/80';
  if (changePct >= 1) return 'bg-green-800/70';
  if (changePct >= 0.5) return 'bg-green-900/60';
  if (changePct > 0) return 'bg-green-950/50';
  if (changePct === 0) return 'bg-secondary';
  if (changePct > -0.5) return 'bg-red-950/50';
  if (changePct > -1) return 'bg-red-900/60';
  if (changePct > -2) return 'bg-red-800/70';
  if (changePct > -3) return 'bg-red-700/80';
  return 'bg-red-600';
}

export default function Heatmap() {
  const sectors = getSectorPerformance();
  const stocks = getAllStocks();
  const maxMcap = useMemo(() => Math.max(...stocks.map(s => s.market_cap || 1), 1), [stocks]);

  return (
    <div className="p-3 max-w-[1800px] mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-sm font-bold text-foreground tracking-wide">MARKET HEATMAP</h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">{stocks.length} stocks across {sectors.length} sectors — Live from NSE</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mb-3">
        <span className="text-[9px] text-muted-foreground mr-2">Change:</span>
        {['-3%', '-2%', '-1%', '0%', '+1%', '+2%', '+3%'].map((label, i) => {
          const vals = [-3, -2, -1, 0, 1, 2, 3];
          return (
            <div key={i} className={`w-10 h-4 rounded text-[8px] flex items-center justify-center text-foreground ${getHeatColor(vals[i])}`}>
              {label}
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        {sectors.map((sec) => (
          <motion.div key={sec.sector} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="t-card p-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Link to={`/sectors/${encodeURIComponent(sec.sector)}`} className="text-[11px] font-semibold text-foreground hover:text-terminal-blue transition-colors">
                  {sec.sector}
                </Link>
                <span className="text-[9px] text-muted-foreground">({sec.count})</span>
              </div>
              <span className={`text-[10px] font-semibold ${sec.avg_change >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
                {formatPercent(sec.avg_change)}
              </span>
            </div>
            <div className="flex flex-wrap gap-0.5">
              {sec.stocks.map((stock) => {
                const size = Math.max(Math.sqrt((stock.market_cap || 1) / maxMcap) * 120, 50);
                return (
                  <Link key={stock.symbol} to={`/stock/${stock.symbol}`}
                    style={{ width: size, height: Math.max(size * 0.6, 36) }}
                    className={`rounded-sm flex flex-col items-center justify-center p-0.5 transition-all hover:ring-1 hover:ring-foreground/30 ${getHeatColor(stock.change_pct)}`}>
                    <span className="text-[9px] font-bold truncate max-w-full text-foreground">{stock.symbol}</span>
                    <span className="text-[8px] text-foreground/80">{stock.change_pct >= 0 ? '+' : ''}{stock.change_pct.toFixed(1)}%</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
