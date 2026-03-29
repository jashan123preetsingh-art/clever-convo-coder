import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStock, getAllStocks, generateCandleData } from '@/data/mockData';
import { formatCurrency, formatPercent } from '@/utils/format';

const POPULAR = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'SBIN', 'BAJFINANCE', 'ITC', 'TATAMOTORS', 'SUNPHARMA', 'LT', 'MARUTI', 'TITAN', 'ADANIENT', 'WIPRO'];
const PERIODS = [
  { key: 60, label: '3M' }, { key: 125, label: '6M' }, { key: 250, label: '1Y' },
  { key: 750, label: '3Y' }, { key: 1250, label: '5Y' },
];

export default function Charts() {
  const { symbol: paramSymbol } = useParams();
  const [symbol, setSymbol] = useState(paramSymbol || 'RELIANCE');
  const [period, setPeriod] = useState(250);
  const [searchInput, setSearchInput] = useState('');
  const [crosshairData, setCrosshairData] = useState<any>(null);
  const [indicators, setIndicators] = useState({ sma20: true, sma50: true, volume: true });
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  const stock = getStock(symbol);
  const chartData = generateCandleData(symbol, period);

  useEffect(() => {
    if (chartRef.current && chartData.length > 0) renderChart();
    return () => { if (chartInstanceRef.current) { try { chartInstanceRef.current.remove(); } catch {} } };
  }, [symbol, period, indicators]);

  const renderChart = async () => {
    if (chartInstanceRef.current) { try { chartInstanceRef.current.remove(); } catch {} }
    if (!chartRef.current || !chartData.length) return;

    try {
      const { createChart, CandlestickSeries, HistogramSeries, LineSeries } = await import('lightweight-charts');

      const chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth,
        height: 550,
        layout: {
          background: { color: '#0a0e14' },
          textColor: '#484f58',
          fontSize: 10,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
        },
        grid: { vertLines: { color: '#1c233320' }, horzLines: { color: '#1c233320' } },
        crosshair: {
          mode: 0,
          vertLine: { color: '#58a6ff30', width: 1, labelBackgroundColor: '#111720' },
          horzLine: { color: '#58a6ff30', width: 1, labelBackgroundColor: '#111720' },
        },
        rightPriceScale: { borderColor: '#1c233360', scaleMargins: { top: 0.05, bottom: 0.2 }, textColor: '#484f58' },
        timeScale: { borderColor: '#1c233360', rightOffset: 5, barSpacing: 8 },
      });

      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#00d68f', downColor: '#ff4757',
        borderUpColor: '#00d68f', borderDownColor: '#ff4757',
        wickUpColor: '#00d68f80', wickDownColor: '#ff475780',
      });
      candleSeries.setData(chartData);

      if (indicators.volume) {
        const volumeSeries = chart.addSeries(HistogramSeries, { priceFormat: { type: 'volume' }, priceScaleId: 'volume' });
        chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
        volumeSeries.setData(chartData.map(c => ({ time: c.time, value: c.volume, color: c.close >= c.open ? '#00d68f12' : '#ff475712' })));
      }

      if (indicators.sma20 && chartData.length > 20) {
        const sma20Series = chart.addSeries(LineSeries, { color: '#e3b34160', lineWidth: 1, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
        const sma20 = [];
        for (let i = 19; i < chartData.length; i++) {
          const sum = chartData.slice(i - 19, i + 1).reduce((s, c) => s + c.close, 0);
          sma20.push({ time: chartData[i].time, value: sum / 20 });
        }
        sma20Series.setData(sma20);
      }

      if (indicators.sma50 && chartData.length > 50) {
        const sma50Series = chart.addSeries(LineSeries, { color: '#58a6ff40', lineWidth: 1, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
        const sma50 = [];
        for (let i = 49; i < chartData.length; i++) {
          const sum = chartData.slice(i - 49, i + 1).reduce((s, c) => s + c.close, 0);
          sma50.push({ time: chartData[i].time, value: sum / 50 });
        }
        sma50Series.setData(sma50);
      }

      chart.subscribeCrosshairMove((param: any) => {
        if (!param?.time) { setCrosshairData(null); return; }
        const candle = param.seriesData?.get(candleSeries);
        if (candle) setCrosshairData({ ...candle, time: param.time });
      });

      chart.timeScale().fitContent();
      chartInstanceRef.current = chart;

      const ro = new ResizeObserver(() => { if (chartRef.current) chart.applyOptions({ width: chartRef.current.clientWidth }); });
      ro.observe(chartRef.current);
    } catch (err) {
      console.error('Chart render error:', err);
    }
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      const found = getAllStocks().find(s => s.symbol.includes(searchInput.toUpperCase()));
      if (found) setSymbol(found.symbol);
      setSearchInput('');
    }
  };

  const info = stock || { ltp: 0, change_pct: 0, name: symbol };

  return (
    <div className="p-2 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="t-card overflow-hidden mb-2">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3">
            <input type="text" placeholder="SEARCH SYMBOL..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearch}
              className="bg-secondary border border-border rounded-sm px-2 py-1 text-[11px] text-foreground placeholder:text-muted-foreground w-36 focus:outline-none focus:border-primary" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-foreground">{symbol}</h1>
                <span className={`text-sm font-bold ${(info as any).change_pct >= 0 ? 'text-terminal-green' : 'text-terminal-red'}`}>
                  {formatCurrency((info as any).ltp)}
                </span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${(info as any).change_pct >= 0 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                  {formatPercent((info as any).change_pct)}
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground">{(info as any).name} | NSE</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/stock/${symbol}`} className="t-btn">DETAIL</Link>
            <Link to={`/options/${symbol}`} className="t-btn">OPTIONS</Link>
          </div>
        </div>
        <div className="flex gap-0.5 px-2 pb-2 flex-wrap">
          {POPULAR.map(s => (
            <button key={s} onClick={() => setSymbol(s)}
              className={`px-2 py-0.5 rounded text-[9px] font-semibold transition-all border ${symbol === s ? 'bg-primary/15 text-primary border-primary/25' : 'bg-background text-muted-foreground border-border hover:text-foreground'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="t-card px-2 py-1.5 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5 bg-background rounded p-0.5">
            {PERIODS.map(p => (
              <button key={p.key} onClick={() => setPeriod(p.key)}
                className={`px-2 py-0.5 rounded text-[9px] font-semibold ${period === p.key ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="w-px h-4 bg-border" />
          {[{ key: 'sma20', label: 'SMA 20', color: 'text-terminal-amber' }, { key: 'sma50', label: 'SMA 50', color: 'text-terminal-blue' }, { key: 'volume', label: 'VOLUME', color: 'text-muted-foreground' }].map(ind => (
            <button key={ind.key} onClick={() => setIndicators(prev => ({ ...prev, [ind.key]: !prev[ind.key as keyof typeof prev] }))}
              className={`px-2 py-0.5 rounded text-[9px] font-semibold border ${indicators[ind.key as keyof typeof indicators] ? `${ind.color} border-current bg-current/10` : 'text-muted-foreground border-border'}`}>
              {ind.label}
            </button>
          ))}
        </div>
        {crosshairData && (
          <div className="flex items-center gap-3 text-[9px]">
            <span className="text-muted-foreground">O:<span className="text-foreground ml-0.5">{crosshairData.open?.toFixed(2)}</span></span>
            <span className="text-muted-foreground">H:<span className="text-foreground ml-0.5">{crosshairData.high?.toFixed(2)}</span></span>
            <span className="text-muted-foreground">L:<span className="text-foreground ml-0.5">{crosshairData.low?.toFixed(2)}</span></span>
            <span className="text-muted-foreground">C:<span className="text-foreground ml-0.5">{crosshairData.close?.toFixed(2)}</span></span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="t-card overflow-hidden">
        <div ref={chartRef} className="w-full" style={{ height: 550 }} />
      </div>
    </div>
  );
}
