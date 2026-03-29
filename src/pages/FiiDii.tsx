import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FII_DII_HISTORY, SECTOR_FII_ALLOCATION } from '@/data/mockData';
import { formatCurrency } from '@/utils/format';

export default function FiiDii() {
  const latest = FII_DII_HISTORY[0];
  const combined = latest.fii_net + latest.dii_net;

  return (
    <div className="p-3 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-sm font-bold text-foreground tracking-wide">FII & DII DATA</h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">Institutional Money Matrix | Real-time flow tracking</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${latest.fii_net < 0 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
          {latest.fii_net < 0 ? 'AGGRESSIVE SELLING' : 'NET BUYING'}
        </span>
      </div>

      {/* Latest Session */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="t-card p-4 mb-3">
        <p className="text-[9px] text-muted-foreground mb-3">Latest Session: {latest.date}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-[9px] text-muted-foreground mb-1">FII / FPI Net</p>
            <p className={`text-2xl font-bold ${latest.fii_net < 0 ? 'text-terminal-red' : 'text-terminal-green'}`}>{formatCurrency(latest.fii_net, true)}</p>
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground mb-1">DII Net</p>
            <p className={`text-2xl font-bold ${latest.dii_net > 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>{formatCurrency(latest.dii_net, true)}</p>
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground mb-1">Combined Liquidity</p>
            <p className={`text-2xl font-bold ${combined >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>{formatCurrency(combined, true)}</p>
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground mb-1">FII Streak</p>
            <p className="text-2xl font-bold text-terminal-red">2 Days</p>
            <p className="text-[9px] text-terminal-red/60">Consecutive Selling</p>
          </div>
        </div>
      </motion.div>

      {/* Cumulative */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
        {[
          { label: 'FII 5-Yr Cumulative', value: -11010, color: 'text-terminal-red' },
          { label: 'DII 5-Yr Cumulative', value: 20450, color: 'text-terminal-green' },
          { label: 'SIP Monthly Run Rate', value: 26500, color: 'text-terminal-blue' },
          { label: 'FII NSE200 Ownership', value: '16.1%', color: 'text-terminal-amber' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="t-card p-3">
            <p className="text-[9px] text-muted-foreground mb-1">{item.label}</p>
            <p className={`text-lg font-bold ${item.color}`}>{typeof item.value === 'string' ? item.value : formatCurrency(item.value, true)}</p>
          </motion.div>
        ))}
      </div>

      {/* History */}
      <div className="t-card overflow-hidden mb-3">
        <div className="p-2 border-b border-border">
          <h3 className="text-[11px] font-semibold text-foreground">DAILY FLOW HISTORY</h3>
        </div>
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-2 text-muted-foreground">Date</th>
              <th className="text-right p-2 text-muted-foreground">FII Buy</th>
              <th className="text-right p-2 text-muted-foreground">FII Sell</th>
              <th className="text-right p-2 text-muted-foreground">FII Net</th>
              <th className="text-right p-2 text-muted-foreground">DII Buy</th>
              <th className="text-right p-2 text-muted-foreground">DII Sell</th>
              <th className="text-right p-2 text-muted-foreground">DII Net</th>
            </tr>
          </thead>
          <tbody>
            {FII_DII_HISTORY.map((row, i) => (
              <tr key={i} className="border-b border-border/30 hover:bg-secondary/30">
                <td className="p-2 text-muted-foreground">{row.date}</td>
                <td className="p-2 text-right text-muted-foreground">{formatCurrency(row.fii_buy, true)}</td>
                <td className="p-2 text-right text-muted-foreground">{formatCurrency(row.fii_sell, true)}</td>
                <td className={`p-2 text-right font-semibold ${row.fii_net >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>{formatCurrency(row.fii_net, true)}</td>
                <td className="p-2 text-right text-muted-foreground">{formatCurrency(row.dii_buy, true)}</td>
                <td className="p-2 text-right text-muted-foreground">{formatCurrency(row.dii_sell, true)}</td>
                <td className={`p-2 text-right font-semibold ${row.dii_net >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>{formatCurrency(row.dii_net, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sector Allocation */}
      <div className="t-card p-3">
        <h3 className="text-[11px] font-semibold text-foreground mb-3">SECTOR-WISE FII / FPI ALLOCATION</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {SECTOR_FII_ALLOCATION.map((sec, i) => (
            <div key={i} className="p-2 rounded bg-secondary border border-border/50">
              <p className="text-[9px] text-muted-foreground mb-1">{sec.name}</p>
              <p className="text-[11px] font-bold text-foreground">{sec.fii_pct.toFixed(1)}%</p>
              <div className="h-1 bg-background rounded-full mt-1.5">
                <div className="h-full bg-terminal-blue rounded-full" style={{ width: `${Math.min(sec.fii_pct, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
