import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NEWS } from '@/data/mockData';
import { timeAgo } from '@/utils/format';

const CATEGORIES = ['All', 'Market', 'Stocks', 'Economy', 'IPO'];

export default function News() {
  const [activeCategory, setActiveCategory] = useState('All');
  const displayNews = activeCategory === 'All' ? NEWS : NEWS.filter(n => n.category === activeCategory);

  return (
    <div className="p-3 max-w-[1600px] mx-auto">
      <div className="mb-3">
        <h1 className="text-sm font-bold text-foreground tracking-wide">MARKET NEWS</h1>
        <p className="text-[10px] text-muted-foreground mt-0.5">Latest Indian market news and analysis</p>
      </div>
      <div className="flex gap-1 mb-3">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-sm text-[10px] font-semibold border transition-all ${activeCategory === cat ? 'bg-primary/10 text-primary border-primary/30' : 'bg-secondary text-muted-foreground border-border hover:text-foreground'}`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {displayNews.map((article, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="t-card p-3 hover:border-primary/30 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-terminal-blue/10 text-terminal-blue">{article.category}</span>
              <span className="text-[9px] text-muted-foreground">{timeAgo(article.published_at)}</span>
            </div>
            <h3 className="text-[11px] font-medium text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-3">{article.title}</h3>
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-[9px] text-muted-foreground">{article.source}</span>
              <span className="text-[9px] text-terminal-blue">Read →</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
