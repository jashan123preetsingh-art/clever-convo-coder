import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function callAI(apiKey: string, systemPrompt: string, userPrompt: string, model = "google/gemini-3-flash-preview"): Promise<string> {
  const resp = await fetch(AI_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      stream: false,
    }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`AI error ${resp.status}: ${t}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || "No response";
}

// Fetch stock data from Yahoo
async function fetchStockData(symbol: string) {
  const ySymbol = symbol.includes(".") ? symbol : `${symbol}.NS`;
  try {
    const resp = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ySymbol}?interval=1d&range=3mo`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const result = data.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const closes = result.indicators?.quote?.[0]?.close || [];
    const volumes = result.indicators?.quote?.[0]?.volume || [];
    const lastClose = closes[closes.length - 1];
    const prevClose = closes[closes.length - 2];
    const change = lastClose - prevClose;
    const changePct = (change / prevClose) * 100;

    // Simple technicals
    const sma20 = closes.slice(-20).reduce((a: number, b: number) => a + (b || 0), 0) / 20;
    const sma50 = closes.slice(-50).reduce((a: number, b: number) => a + (b || 0), 0) / Math.min(50, closes.length);
    const avgVol = volumes.slice(-10).reduce((a: number, b: number) => a + (b || 0), 0) / 10;
    const high52 = Math.max(...closes.filter((c: any) => c));
    const low52 = Math.min(...closes.filter((c: any) => c && c > 0));

    return {
      symbol, price: lastClose, change, changePct, prevClose,
      high: meta.regularMarketDayHigh, low: meta.regularMarketDayLow,
      volume: volumes[volumes.length - 1], avgVolume: avgVol,
      sma20, sma50, high52, low52,
      recentCloses: closes.slice(-20),
      recentVolumes: volumes.slice(-10),
    };
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symbol, action } = await req.json();
    if (!symbol) {
      return new Response(JSON.stringify({ error: "Symbol required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // If action is "quick" — just run a single fast analysis
    if (action === "quick") {
      const stockData = await fetchStockData(symbol);
      const result = await callAI(LOVABLE_API_KEY,
        "You are an expert Indian stock market analyst. Give a concise 3-line analysis with Buy/Sell/Hold recommendation.",
        `Analyze ${symbol}: Price ₹${stockData?.price?.toFixed(2)}, Change ${stockData?.changePct?.toFixed(2)}%, SMA20 ₹${stockData?.sma20?.toFixed(2)}, SMA50 ₹${stockData?.sma50?.toFixed(2)}, 52W High ₹${stockData?.high52?.toFixed(2)}, 52W Low ₹${stockData?.low52?.toFixed(2)}`
      );
      return new Response(JSON.stringify({ result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Full multi-agent workflow
    const stockData = await fetchStockData(symbol);
    const dataContext = stockData
      ? `Stock: ${symbol}, Price: ₹${stockData.price?.toFixed(2)}, Change: ${stockData.changePct?.toFixed(2)}%, SMA20: ₹${stockData.sma20?.toFixed(2)}, SMA50: ₹${stockData.sma50?.toFixed(2)}, Volume: ${stockData.volume?.toLocaleString()}, Avg Vol: ${stockData.avgVolume?.toLocaleString()}, 52W High: ₹${stockData.high52?.toFixed(2)}, 52W Low: ₹${stockData.low52?.toFixed(2)}`
      : `Stock: ${symbol} (limited data available)`;

    // Run 4 analysts in parallel
    const [fundamental, technical, sentiment, news] = await Promise.all([
      callAI(LOVABLE_API_KEY,
        "You are a Fundamentals Analyst for Indian stocks. Evaluate company financials, PE ratio, debt, growth prospects, promoter holding, ROE/ROCE. Be specific with numbers. Keep under 150 words.",
        `Perform fundamental analysis for ${symbol}. ${dataContext}`
      ),
      callAI(LOVABLE_API_KEY,
        "You are a Technical Analyst for Indian stocks. Analyze price action, support/resistance, moving averages, RSI, MACD patterns, volume profile. Be specific with levels. Keep under 150 words.",
        `Perform technical analysis for ${symbol}. ${dataContext}. Recent closes: ${stockData?.recentCloses?.slice(-10)?.map((c: number) => c?.toFixed(2))?.join(', ')}`
      ),
      callAI(LOVABLE_API_KEY,
        "You are a Sentiment Analyst for Indian stocks. Analyze market sentiment, social media buzz, retail vs institutional interest, FII/DII activity. Keep under 150 words.",
        `Analyze market sentiment for ${symbol}. ${dataContext}`
      ),
      callAI(LOVABLE_API_KEY,
        "You are a News Analyst for Indian stocks. Analyze recent news impact, regulatory changes, sector trends, macro factors affecting the stock. Keep under 150 words.",
        `Analyze news and macro factors for ${symbol}. ${dataContext}`
      ),
    ]);

    // Bull vs Bear Research Debate
    const analysisContext = `
FUNDAMENTAL ANALYSIS: ${fundamental}
TECHNICAL ANALYSIS: ${technical}
SENTIMENT ANALYSIS: ${sentiment}
NEWS ANALYSIS: ${news}`;

    const [bullCase, bearCase] = await Promise.all([
      callAI(LOVABLE_API_KEY,
        "You are a Bullish Researcher. Build the strongest possible bull case for this stock based on the analyst reports. Be specific with price targets and catalysts. Keep under 150 words.",
        `Build bull case for ${symbol}.\n${analysisContext}`
      ),
      callAI(LOVABLE_API_KEY,
        "You are a Bearish Researcher. Build the strongest possible bear case for this stock based on the analyst reports. Highlight risks, red flags, and downside targets. Keep under 150 words.",
        `Build bear case for ${symbol}.\n${analysisContext}`
      ),
    ]);

    // Trader Decision
    const traderDecision = await callAI(LOVABLE_API_KEY,
      "You are a senior Trader for Indian markets. Based on all analyst reports and the bull/bear debate, make a CLEAR trading decision. State: ACTION (Strong Buy/Buy/Hold/Sell/Strong Sell), ENTRY PRICE, TARGET PRICE, STOP LOSS, POSITION SIZE (% of portfolio), TIME HORIZON. Be decisive. Keep under 200 words.",
      `Make trading decision for ${symbol}.\n${analysisContext}\n\nBULL CASE: ${bullCase}\n\nBEAR CASE: ${bearCase}`,
      "google/gemini-2.5-flash"
    );

    // Risk Assessment
    const riskAssessment = await callAI(LOVABLE_API_KEY,
      "You are a Risk Manager. Evaluate the trader's proposal. Assess: risk/reward ratio, portfolio impact, volatility risk, liquidity risk, event risks. Give a RISK SCORE (1-10, 10=highest risk). Approve or flag concerns. Keep under 150 words.",
      `Evaluate this trade for ${symbol}:\n\nTRADER PROPOSAL: ${traderDecision}\n\nMARKET DATA: ${dataContext}`,
      "google/gemini-2.5-flash"
    );

    return new Response(JSON.stringify({
      symbol,
      stockData: stockData ? { price: stockData.price, change: stockData.change, changePct: stockData.changePct, volume: stockData.volume, sma20: stockData.sma20, sma50: stockData.sma50, high52: stockData.high52, low52: stockData.low52 } : null,
      agents: {
        fundamental,
        technical,
        sentiment,
        news,
        bullCase,
        bearCase,
        traderDecision,
        riskAssessment,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Trading agent error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    const status = msg.includes("429") ? 429 : msg.includes("402") ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
