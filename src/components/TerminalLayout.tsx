import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '@/store/useStore';
import { INDICES } from '@/data/mockData';
import { formatPercent } from '@/utils/format';

const NAV_ITEMS = [
  { path: '/', label: 'DASHBOARD', shortcut: 'F1', icon: 'DH' },
  { path: '/charts', label: 'CHARTS', shortcut: 'F2', icon: 'CH' },
  { path: '/heatmap', label: 'HEATMAP', shortcut: 'F3', icon: 'HM' },
  { path: '/scanner', label: 'SCANNER', shortcut: 'F4', icon: 'SC' },
  { path: '/screener', label: 'SCREENER', shortcut: 'F5', icon: 'SR' },
  { path: '/options', label: 'OPTIONS', shortcut: 'F6', icon: 'OC' },
  { path: '/sectors', label: 'SECTORS', shortcut: 'F7', icon: 'SE' },
  { path: '/fii-dii', label: 'FII/DII', shortcut: 'F8', icon: 'FD' },
  { path: '/news', label: 'NEWS', shortcut: 'F9', icon: 'NW' },
];

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getDay();
    if (day === 0 || day === 6) return false;
    const timeVal = now.getHours() * 60 + now.getMinutes();
    return timeVal >= 555 && timeVal <= 930;
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-10 bg-terminal-header border-b border-border flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-primary to-terminal-cyan flex items-center justify-center">
              <span className="text-[8px] font-black text-primary-foreground">SP</span>
            </div>
            <span className="text-xs font-bold text-foreground tracking-wider">STOCKPULSE</span>
            <span className="text-[10px] text-muted-foreground">TERMINAL</span>
          </div>
          <div className="w-px h-4 bg-border" />
          {/* Ticker */}
          <div className="flex items-center gap-6">
            {INDICES.map((idx, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px]">
                <span className="text-muted-foreground font-semibold">{idx.symbol}</span>
                <span className="text-foreground">{Number(idx.ltp).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                <span className={idx.change_pct >= 0 ? 'text-terminal-green' : 'text-terminal-red'}>
                  {idx.change_pct >= 0 ? '+' : ''}{idx.change_pct.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isMarketOpen() ? 'bg-terminal-green animate-pulse-green' : 'bg-muted-foreground'}`} />
            <span className="text-[10px] text-muted-foreground">
              {isMarketOpen() ? 'MKT OPEN' : 'MKT CLOSED'}
            </span>
          </div>
          <div className="w-px h-4 bg-border" />
          <span className="text-[10px] text-muted-foreground">
            {time.toLocaleTimeString('en-IN', { hour12: false })} IST
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-44' : 'w-12'} flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200`}>
          <nav className="flex-1 py-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-2 py-1.5 text-[11px] transition-all duration-100 border-l-2
                    ${isActive
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-transparent text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent'
                    }`}
                >
                  <span className={`w-5 text-center text-[10px] font-bold flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 tracking-wide">{item.label}</span>
                      <span className="text-[8px] text-muted-foreground">{item.shortcut}</span>
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="p-2 border-t border-sidebar-border">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center gap-2 text-muted-foreground hover:text-foreground text-[10px] transition-colors py-1"
            >
              <span className="text-xs">{sidebarOpen ? '«' : '»'}</span>
              {sidebarOpen && <span>COLLAPSE</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="min-h-full">{children}</div>
        </main>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-6 bg-terminal-header border-t border-border flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-terminal-green" />
            <span className="text-[9px] text-muted-foreground">DATA:LIVE</span>
          </div>
          <span className="text-[9px] text-muted-foreground">NSE+BSE</span>
          <span className="text-[9px] text-muted-foreground">STOCKS:48</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[9px] text-muted-foreground">
            {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
          </span>
          <span className="text-[9px] text-primary">STOCKPULSE v2.0</span>
        </div>
      </footer>
    </div>
  );
}
