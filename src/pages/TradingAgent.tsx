import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

interface AgentResult {
  symbol: string;
  stockData: any;
  agents: {
    fundamental: string;
    technical: string;
    sentiment: string;
    news: string;
    bullCase: string;
    bearCase: string;
    traderDecision: string;
    riskAssessment: string;
  };
}

const AGENT_STEPS = [
  { key: 'analysts', label: 'Analyst Team', icon: '🔬', agents: ['fundamental', 'technical', 'sentiment', 'news'] },
  { key: 'debate', label: 'Bull vs Bear Debate', icon: '⚔️', agents: ['bullCase', 'bearCase'] },
  { key: 'trader', label: 'Trader Decision', icon: '📊', agents: ['traderDecision'] },
  { key: 'risk', label: 'Risk Assessment', icon: '🛡️', agents: ['riskAssessment'] },
];

const AGENT_META: Record<string, { label: string; icon: string; color: string }> = {
  fundamental: { label: 'Fundamentals', icon: '📈', color: 'terminal-blue' },
  technical: { label: 'Technical', icon: '📉', color: 'terminal-cyan' },
  sentiment: { label: 'Sentiment', icon: '💭', color: 'terminal-purple' },
  news: { label: 'News & Macro', icon: '📰', color: 'terminal-amber' },
  bullCase: { label: 'Bull Case', icon: '🐂', color: 'terminal-green' },
  bearCase: { label: 'Bear Case', icon: '🐻', color: 'terminal-red' },
  traderDecision: { label: 'Trading Decision', icon: '🎯', color: 'primary' },
  riskAssessment: { label: 'Risk Assessment', icon: '🛡️', color: 'terminal-amber' },
};

export default function TradingAgent() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const runAgent = async () => {
    if (!symbol.trim()) { toast.error('Enter a stock symbol'); return; }
    setLoading(true);
    setResult(null);
    setCurrentStep(0);
    setExpandedAgent(null);

    try {
      // Simulate step progression
      const stepTimer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < 3) return prev + 1;
          clearInterval(stepTimer);
          return prev;
        });
      }, 4000);

      const resp = await fetch(`${FUNCTIONS_URL}/trading-agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ symbol: symbol.toUpperCase().trim() }),
      });

      clearInterval(stepTimer);

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || 'Agent failed');
      }

      const data = await resp.json();
      setResult(data);
      setCurrentStep(4);
      toast.success(`Analysis complete for ${data.symbol}`);
    } catch (err: any) {
      toast.error(err.message || 'Agent failed');
      setCurrentStep(-1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🤖</span>
          <h1 className="text-base md:text-lg font-black text-foreground tracking-wide">TRADING AGENT</h1>
          <span className="text-[8px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20">AI-POWERED</span>
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground">Multi-agent stock analysis inspired by TradingAgents framework — 4 Analysts → Bull/Bear Debate → Trader Decision → Risk Assessment</p>
      </div>

      {/* Input */}
      <div className="t-card p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-[10px] text-muted-foreground font-semibold mb-1.5 uppercase tracking-wider">Stock Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && runAgent()}
              placeholder="e.g. RELIANCE, TCS, INFY"
              className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-data"
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={runAgent}
              disabled={loading || !symbol.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-primary to-[hsl(var(--terminal-cyan))] text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Running Agents...
                </span>
              ) : '🚀 Run Analysis'}
            </button>
          </div>
        </div>

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'TATAMOTORS', 'ADANIENT'].map(s => (
            <button key={s} onClick={() => setSymbol(s)}
              className="px-2 py-1 text-[9px] bg-secondary/60 border border-border/50 rounded text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Workflow Progress */}
      {(loading || result) && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            {AGENT_STEPS.map((step, i) => (
              <React.Fragment key={step.key}>
                <div className={`flex items-center gap-1.5 ${i <= currentStep ? 'opacity-100' : 'opacity-30'} transition-opacity duration-500`}>
                  <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-500 ${
                    i < currentStep ? 'bg-primary/20 border-primary text-primary' :
                    i === currentStep && loading ? 'border-terminal-amber animate-pulse text-terminal-amber bg-terminal-amber/10' :
                    i <= currentStep ? 'bg-primary/20 border-primary text-primary' :
                    'border-border bg-secondary text-muted-foreground'
                  }`}>
                    {i < currentStep || (currentStep >= 4) ? '✓' : step.icon}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-semibold text-foreground hidden sm:block">{step.label}</span>
                </div>
                {i < AGENT_STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 transition-colors duration-500 ${i < currentStep ? 'bg-primary' : 'bg-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {/* Stock summary */}
            {result.stockData && (
              <div className="t-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-foreground font-data">{result.symbol}</h2>
                    <p className="text-xs text-muted-foreground">Analysis Date: {new Date().toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground font-data">₹{result.stockData.price?.toFixed(2)}</p>
                    <p className={`text-sm font-semibold font-data ${result.stockData.changePct >= 0 ? 'text-primary' : 'text-destructive'}`}>
                      {result.stockData.changePct >= 0 ? '+' : ''}{result.stockData.changePct?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Analyst Reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(result.agents).map(([key, content]) => {
                const meta = AGENT_META[key];
                if (!meta) return null;
                const isExpanded = expandedAgent === key;
                return (
                  <motion.div key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Object.keys(AGENT_META).indexOf(key) * 0.1 }}
                    className={`t-card overflow-hidden ${key === 'traderDecision' || key === 'riskAssessment' ? 'md:col-span-2' : ''}`}
                  >
                    <button
                      onClick={() => setExpandedAgent(isExpanded ? null : key)}
                      className="w-full flex items-center justify-between p-3 hover:bg-secondary/30 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{meta.icon}</span>
                        <div>
                          <h3 className="text-[11px] font-bold text-foreground">{meta.label}</h3>
                          {!isExpanded && (
                            <p className="text-[9px] text-muted-foreground line-clamp-1 max-w-[300px]">{content.slice(0, 80)}...</p>
                          )}
                        </div>
                      </div>
                      <span className={`text-muted-foreground text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 text-[11px] text-foreground/90 leading-relaxed border-t border-border/30 pt-2 prose prose-sm prose-invert max-w-none [&_p]:text-[11px] [&_p]:leading-relaxed [&_li]:text-[11px] [&_strong]:text-foreground">
                            <ReactMarkdown>
                              {content}
                            </ReactMarkdown>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Expand All button */}
            <div className="flex justify-center">
              <button
                onClick={() => setExpandedAgent(expandedAgent ? null : 'all')}
                className="text-[10px] text-primary hover:underline"
              >
                {expandedAgent ? 'Collapse All' : 'Expand All Reports'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!loading && !result && (
        <div className="t-card p-8 md:p-12 text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h2 className="text-sm font-bold text-foreground mb-2">Multi-Agent Trading Analysis</h2>
          <p className="text-[10px] text-muted-foreground max-w-md mx-auto mb-6">
            Enter a stock symbol above to run a full multi-agent analysis workflow. 
            4 specialized AI analysts will evaluate the stock, followed by a bull/bear debate, 
            trading decision, and risk assessment.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { icon: '📈', title: 'Fundamentals', desc: 'Financials, PE, ROE, growth' },
              { icon: '📉', title: 'Technical', desc: 'Price action, indicators' },
              { icon: '💭', title: 'Sentiment', desc: 'Market mood, FII/DII' },
              { icon: '📰', title: 'News & Macro', desc: 'Events, sector trends' },
            ].map(a => (
              <div key={a.title} className="bg-secondary/30 border border-border/30 rounded-lg p-3 text-center">
                <span className="text-2xl">{a.icon}</span>
                <p className="text-[10px] font-semibold text-foreground mt-1">{a.title}</p>
                <p className="text-[8px] text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
