import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStock, generateCandleData } from '@/data/mockData';
import { formatCurrency, formatPercent, formatVolume, formatMarketCap } from '@/utils/format';
import useStore from '@/store/useStore';

export default function StockDetail() {
  const { symbol } = useParams();
  const stock = getStock(symbol || '');
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const { watchlist, addToWatchlist, removeFromWatchlist } = useStore();
  const inWatchlist = watchlist.includes(symbol || '');
  const [period, setPeriod] = useState(250);

  useEffect(() => {
    if (chartRef.current && stock) renderChart();
    return () => { if (chartInstanceRef.current) { try { chartInstanceRef.current.remove(); } catch {} } };
  }, [symbol, period]);

  const renderChart = async () => {
    if (chartInstanceRef.current) { try { chartInstanceRef.current.remove(); } catch {} }
    if (!chartRef.current || !symbol) return;
    const data = generateCandleData(symbol, period);
    try {
      const { createChart, CandlestickSeries, HistogramSeries } = await import('lightweight-charts');
      const chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth, height: 350,
        layout: { background: { color: '#0a0e14' }, textColor: '#484f58', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
        grid: { vertLines: { color: '#1c233320' }, horzLines: { color: '#1c233320' } },
        crosshair: { mode: 0 },
        rightPriceScale: { borderColor: '#1c233360' },
        timeScale: { borderColor: '#1c233360' },
      });
      const cs = chart.addSeries(CandlestickSeries, { upColor: '#00d68f', downColor: '#ff4757', borderUpColor: '#00d68f', borderDownColor: '#ff4757', wickUpColor: '#00d68f80', wickDownColor: '#ff475780' });
      cs.setData(data);
      const vs = chart.addSeries(HistogramSeries, { priceFormat: { type: 'volume' }, priceScaleId: 'volume' });
      chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
      vs.setData(data.map(c => ({ time: c.time, value: c.volume, color: c.close >= c.open ? '#00d68f18' : '#ff475718' })));
      chart.timeScale().fitContent();
      chartInstanceRef.current = chart;
      const ro = new ResizeObserver(() => { if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth }); });
      ro.observe(chartRef.current);
    } catch {}
  };

  if (!stock) return <div className="flex items-center justify-center h-96 text-muted-foreground text-[11px]">Stock not found</div>;

  return (
    <div className="p-3 max-w-[1600px] mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg font-bold text-foreground">{stock.symbol}</h1>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{stock.exchange}</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-terminal-blue/10 text-terminal-blue">{stock.sector}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{stock.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => inWatchlist ? removeFromWatchlist(stock.symbol) : addToWatchlist(stock.symbol)}
              className={`t-btn ${inWatchlist ? 'border-terminal-amber/30 text-terminal-amber' : ''}`}>
              {inWatchlist ? '★ WATCHING' : '☆ WATCH'}
            </button>
            <Link to={`/charts/${stock.symbol}`} className="t-btn t-btn-active">FULL CHART</Link>
            <Link to={`/options/${stock.symbol}`} className="t-btn">OPTIONS</Link>
          </div>
        </div>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-3xl font-bold text-foreground">{formatCurrency(stock.ltp)}</span>
          <span className={`text-lg font-semibold ${stock.change_pct >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>{formatPercent(stock.change_pct)}</span>
          <span className="text-[10px] text-muted-foreground">Vol: {formatVolume(stock.volume)} | MCap: {formatMarketCap(stock.market_cap)}</span>
        </div>
      </motion.div>

      {/* Chart */}
      <div className="t-card p-2 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground font-semibold">PRICE CHART</span>
          <div className="flex gap-0.5">
            {[{ k: 60, l: '3M' }, { k: 125, l: '6M' }, { k: 250, l: '1Y' }, { k: 750, l: '3Y' }].map(p => (
              <button key={p.k} onClick={() => setPeriod(p.k)}
                className={`px-2 py-0.5 rounded text-[9px] font-semibold ${period === p.k ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>{p.l}</button>
            ))}
          </div>
        </div>
        <div ref={chartRef} className="w-full" style={{ height: 350 }} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        {[
          { l: 'Open', v: formatCurrency(stock.open) }, { l: 'High', v: formatCurrency(stock.high) },
          { l: 'Low', v: formatCurrency(stock.low) }, { l: 'Prev Close', v: formatCurrency(stock.prev_close) },
          { l: '52W High', v: formatCurrency(stock.week_52_high) }, { l: '52W Low', v: formatCurrency(stock.week_52_low) },
          { l: 'Volume', v: formatVolume(stock.volume) }, { l: 'Avg Vol (10D)', v: formatVolume(stock.avg_volume_10d || 0) },
        ].map((m, i) => (
          <div key={i} className="t-card p-2">
            <p className="text-[8px] text-muted-foreground mb-0.5">{m.l}</p>
            <p className="text-[11px] text-foreground">{m.v}</p>
          </div>
        ))}
      </div>

      {/* Fundamentals */}
      <div className="t-card p-3">
        <h3 className="text-[10px] font-semibold text-muted-foreground mb-3 tracking-wide">FUNDAMENTAL RATIOS</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { l: 'P/E Ratio', v: stock.pe_ratio }, { l: 'ROE', v: stock.roe ? `${stock.roe}%` : '—' },
            { l: 'ROCE', v: stock.roce ? `${stock.roce}%` : '—' }, { l: 'Debt/Equity', v: stock.debt_to_equity },
            { l: 'Div Yield', v: stock.dividend_yield ? `${stock.dividend_yield}%` : '—' },
            { l: 'Promoter%', v: stock.promoter_holding ? `${stock.promoter_holding}%` : '—' },
          ].map((m, i) => (
            <div key={i}>
              <p className="text-[8px] text-muted-foreground mb-0.5">{m.l}</p>
              <p className="text-[12px] font-semibold text-foreground">{m.v ?? '—'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
