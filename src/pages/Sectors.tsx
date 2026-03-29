import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSectorPerformance, getStocksBySector } from '@/data/mockData';
import { formatCurrency, formatPercent, formatVolume, formatMarketCap } from '@/utils/format';

export default function Sectors() {
  const { sector: paramSector } = useParams();
  const sectors = getSectorPerformance();

  if (paramSector) {
    const decoded = decodeURIComponent(paramSector);
    const stocks = getStocksBySector(decoded);
    return (
      <div className="p-3 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <Link to="/sectors" className="text-muted-foreground hover:text-foreground transition-colors text-[11px]">← ALL SECTORS</Link>
          <span className="text-border">/</span>
          <h1 className="text-sm font-bold text-foreground">{decoded}</h1>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{stocks.length} stocks</span>
        </div>
        <div className="t-card overflow-hidden">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 text-muted-foreground text-[10px]">Symbol</th>
                <th className="text-right p-2 text-muted-foreground text-[10px]">LTP</th>
                <th className="text-right p-2 text-muted-foreground text-[10px]">Change%</th>
                <th className="text-right p-2 text-muted-foreground text-[10px] hidden md:table-cell">Volume</th>
                <th className="text-right p-2 text-muted-foreground text-[10px] hidden lg:table-cell">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map(stock => (
                <tr key={stock.symbol} className="border-b border-border/30 hover:bg-secondary/50">
                  <td className="p-2"><Link to={`/stock/${stock.symbol}`} className="hover:text-primary"><p className="font-semibold text-foreground">{stock.symbol}</p><p className="text-[9px] text-muted-foreground">{stock.name}</p></Link></td>
                  <td className="p-2 text-right text-foreground">{formatCurrency(stock.ltp)}</td>
                  <td className="p-2 text-right"><span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${stock.change_pct >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>{formatPercent(stock.change_pct)}</span></td>
                  <td className="p-2 text-right text-muted-foreground hidden md:table-cell">{formatVolume(stock.volume)}</td>
                  <td className="p-2 text-right text-muted-foreground hidden lg:table-cell">{formatMarketCap(stock.market_cap)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 max-w-[1600px] mx-auto">
      <div className="mb-3">
        <h1 className="text-sm font-bold text-foreground tracking-wide">SECTOR ANALYSIS</h1>
        <p className="text-[10px] text-muted-foreground mt-0.5">Live sector performance across {sectors.length} sectors</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {sectors.map((sec, i) => (
          <motion.div key={sec.sector} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Link to={`/sectors/${encodeURIComponent(sec.sector)}`} className="t-card block hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-semibold text-foreground">{sec.sector}</h3>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${sec.avg_change >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                  {formatPercent(sec.avg_change)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-muted-foreground mb-2"><span>{sec.count} stocks</span></div>
              <div className="flex gap-0.5 h-6 items-end">
                {sec.stocks.slice(0, 15).map((s, j) => {
                  const height = Math.min(Math.abs(s.change_pct) * 15, 100);
                  return <div key={j} className={`flex-1 rounded-t ${s.change_pct >= 0 ? 'bg-terminal-green/40' : 'bg-terminal-red/40'}`} style={{ height: `${Math.max(height, 8)}%` }} />;
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {sec.stocks.slice(0, 4).map(s => (
                  <span key={s.symbol} className={`text-[8px] px-1 py-0.5 rounded ${s.change_pct >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                    {s.symbol} {s.change_pct >= 0 ? '+' : ''}{s.change_pct.toFixed(1)}%
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
