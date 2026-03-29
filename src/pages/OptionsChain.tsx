import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateOptionsChain, getAllStocks } from '@/data/mockData';
import { formatCurrency, formatVolume, formatNumber } from '@/utils/format';

const FNO = ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'BAJFINANCE', 'TATAMOTORS', 'ITC', 'LT'];

function OIBar({ value, max, color }: { value: number; max: number; color: string }) {
  const w = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-14 h-1.5 bg-background rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${w}%` }} />
    </div>
  );
}

export default function OptionsChain() {
  const [symbol, setSymbol] = useState('NIFTY');
  const [strikeRange, setStrikeRange] = useState(15);
  const [selectedExpiry, setSelectedExpiry] = useState<string | null>(null);

  const data = generateOptionsChain(symbol);
  const { chain, underlyingValue, expiryDates, analytics } = data;

  if (!selectedExpiry && expiryDates.length) {
    setSelectedExpiry(expiryDates[0]);
  }

  const atmStrike = chain.reduce((closest, item) =>
    Math.abs(item.strike - underlyingValue) < Math.abs(closest.strike - underlyingValue) ? item : closest, chain[0])?.strike;

  const atmIndex = chain.findIndex(c => c.strike === atmStrike);
  const filtered = atmIndex >= 0 ? chain.slice(Math.max(0, atmIndex - strikeRange), Math.min(chain.length, atmIndex + strikeRange + 1)) : chain;
  const maxOI = Math.max(...filtered.map(c => Math.max(c.ce.oi, c.pe.oi)), 1);

  const maxCallOI = chain.reduce((max, c) => c.ce.oi > (max.ce?.oi || 0) ? c : max, chain[0]);
  const maxPutOI = chain.reduce((max, c) => c.pe.oi > (max.pe?.oi || 0) ? c : max, chain[0]);

  return (
    <div className="p-3 max-w-[1800px] mx-auto">
      <div className="t-card overflow-hidden mb-2">
        <div className="flex items-center justify-between px-3 py-2">
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-wide">OPTIONS CHAIN</h1>
            <p className="text-[9px] text-muted-foreground mt-0.5">OI analysis, Max Pain & PCR | DEMO DATA</p>
          </div>
          <Link to={`/charts/${symbol}`} className="t-btn">VIEW CHART</Link>
        </div>
      </div>

      {/* Symbol Selector */}
      <div className="t-card px-3 py-2 mb-2">
        <div className="flex gap-1 flex-wrap">
          {FNO.map(s => (
            <button key={s} onClick={() => setSymbol(s)}
              className={`px-2 py-0.5 rounded text-[9px] font-semibold border transition-all ${symbol === s ? 'bg-primary/15 text-primary border-primary/25' : 'bg-background text-muted-foreground border-border hover:text-foreground'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-px bg-border rounded overflow-hidden mb-2">
        {[
          { label: 'SPOT', value: formatCurrency(underlyingValue), cls: 'text-foreground' },
          { label: 'MAX PAIN', value: formatNumber(analytics.maxPain), cls: 'text-terminal-amber' },
          { label: 'PCR', value: analytics.pcr.toFixed(2), cls: analytics.pcr > 1 ? 'text-terminal-green' : 'text-terminal-red' },
          { label: 'CALL OI', value: formatVolume(analytics.totalCallOI), cls: 'text-terminal-red' },
          { label: 'PUT OI', value: formatVolume(analytics.totalPutOI), cls: 'text-terminal-green' },
          { label: 'CALL VOL', value: formatVolume(analytics.totalCallVolume), cls: 'text-muted-foreground' },
          { label: 'PUT VOL', value: formatVolume(analytics.totalPutVolume), cls: 'text-muted-foreground' },
          { label: 'MAX CALL OI', value: formatNumber(maxCallOI?.strike), cls: 'text-terminal-red' },
        ].map((item, i) => (
          <div key={i} className="bg-card p-2 text-center">
            <p className="text-[8px] text-muted-foreground">{item.label}</p>
            <p className={`text-[11px] font-bold ${item.cls}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* OI Analysis */}
      <div className="t-card px-3 py-2 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-[9px]">
            <span className="text-muted-foreground">OI ANALYSIS:</span>
            <span className="text-terminal-red">MAX CALL OI @ {formatNumber(maxCallOI?.strike)} (RESISTANCE)</span>
            <span className="text-terminal-green">MAX PUT OI @ {formatNumber(maxPutOI?.strike)} (SUPPORT)</span>
            <span className={analytics.pcr > 1 ? 'text-terminal-green' : 'text-terminal-red'}>
              PCR {analytics.pcr > 1.2 ? 'BULLISH' : analytics.pcr > 0.8 ? 'NEUTRAL' : 'BEARISH'} ({analytics.pcr.toFixed(2)})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground">STRIKES:</span>
            {[10, 15, 25].map(n => (
              <button key={n} onClick={() => setStrikeRange(n)}
                className={`text-[9px] px-1.5 py-0.5 rounded ${strikeRange === n ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Expiry */}
      <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
        {expiryDates.map(exp => (
          <button key={exp} onClick={() => setSelectedExpiry(exp)}
            className={`px-2.5 py-1 rounded text-[9px] font-semibold whitespace-nowrap border transition-all ${selectedExpiry === exp ? 'bg-terminal-blue/15 text-terminal-blue border-terminal-blue/25' : 'bg-card text-muted-foreground border-border hover:text-foreground'}`}>
            {exp}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="t-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-border">
                <th colSpan={6} className="text-center bg-destructive/5 text-destructive border-r border-border py-1">CALLS (CE)</th>
                <th className="text-center bg-terminal-header text-foreground border-r border-border py-1">STRIKE</th>
                <th colSpan={6} className="text-center bg-primary/5 text-primary py-1">PUTS (PE)</th>
              </tr>
              <tr className="border-b border-border text-muted-foreground">
                <th className="p-1.5">OI</th><th className="p-1.5">CHG</th><th className="p-1.5">VOL</th><th className="p-1.5">IV</th><th className="p-1.5 border-r border-border">LTP</th><th className="p-1.5 border-r border-border">OI BAR</th>
                <th className="p-1.5 text-center bg-terminal-header border-r border-border">STRIKE</th>
                <th className="p-1.5">OI BAR</th><th className="p-1.5">LTP</th><th className="p-1.5">IV</th><th className="p-1.5">VOL</th><th className="p-1.5">CHG</th><th className="p-1.5">OI</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const isATM = row.strike === atmStrike;
                return (
                  <tr key={i} className={`border-b border-border/30 ${isATM ? 'bg-terminal-amber/5' : 'hover:bg-secondary/30'}`}>
                    <td className="p-1.5 text-right text-muted-foreground">{formatVolume(row.ce.oi)}</td>
                    <td className={`p-1.5 text-right ${row.ce.chg_oi >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>{formatVolume(row.ce.chg_oi)}</td>
                    <td className="p-1.5 text-right text-muted-foreground">{formatVolume(row.ce.volume)}</td>
                    <td className="p-1.5 text-right text-muted-foreground">{row.ce.iv}%</td>
                    <td className="p-1.5 text-right text-foreground border-r border-border">{row.ce.ltp.toFixed(2)}</td>
                    <td className="p-1.5 border-r border-border"><OIBar value={row.ce.oi} max={maxOI} color="bg-terminal-red" /></td>
                    <td className={`p-1.5 text-center font-bold border-r border-border ${isATM ? 'text-terminal-amber bg-terminal-amber/10' : 'text-foreground'}`}>
                      {formatNumber(row.strike)}
                    </td>
                    <td className="p-1.5"><OIBar value={row.pe.oi} max={maxOI} color="bg-terminal-green" /></td>
                    <td className="p-1.5 text-right text-foreground">{row.pe.ltp.toFixed(2)}</td>
                    <td className="p-1.5 text-right text-muted-foreground">{row.pe.iv}%</td>
                    <td className="p-1.5 text-right text-muted-foreground">{formatVolume(row.pe.volume)}</td>
                    <td className={`p-1.5 text-right ${row.pe.chg_oi >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>{formatVolume(row.pe.chg_oi)}</td>
                    <td className="p-1.5 text-right text-muted-foreground">{formatVolume(row.pe.oi)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
