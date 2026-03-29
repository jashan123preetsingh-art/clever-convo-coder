// Comprehensive mock data for Indian Stock Market

export interface Stock {
  symbol: string;
  name: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  prev_close: number;
  change: number;
  change_pct: number;
  volume: number;
  market_cap: number;
  sector: string;
  exchange: string;
  week_52_high: number;
  week_52_low: number;
  pe_ratio?: number;
  roe?: number;
  roce?: number;
  debt_to_equity?: number;
  dividend_yield?: number;
  promoter_holding?: number;
  avg_volume_10d?: number;
}

export interface IndexData {
  symbol: string;
  ltp: number;
  open: number;
  high: number;
  low: number;
  change_pct: number;
}

export interface NewsArticle {
  title: string;
  source: string;
  category: string;
  published_at: string;
  url: string;
  summary?: string;
}

export interface FiiDiiData {
  date: string;
  fii_buy: number;
  fii_sell: number;
  fii_net: number;
  dii_buy: number;
  dii_sell: number;
  dii_net: number;
}

export interface ScannerDef {
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface OptionRow {
  strike: number;
  ce: { oi: number; chg_oi: number; volume: number; iv: number; ltp: number };
  pe: { oi: number; chg_oi: number; volume: number; iv: number; ltp: number };
}

const STOCKS: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', ltp: 1414.40, open: 1398, high: 1425, low: 1392, prev_close: 1384.5, change: 29.9, change_pct: 2.16, volume: 18500000, market_cap: 1900000, sector: 'Oil & Gas', exchange: 'NSE', week_52_high: 1608, week_52_low: 1200, pe_ratio: 25.8, roe: 9.5, roce: 12.3, debt_to_equity: 0.38, dividend_yield: 0.4, promoter_holding: 50.3, avg_volume_10d: 15000000 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', ltp: 3890.50, open: 3845, high: 3910, low: 3830, prev_close: 3820, change: 70.5, change_pct: 1.85, volume: 4200000, market_cap: 1500000, sector: 'Information Technology', exchange: 'NSE', week_52_high: 4250, week_52_low: 3300, pe_ratio: 32.4, roe: 45.2, roce: 56.8, debt_to_equity: 0.04, dividend_yield: 1.5, promoter_holding: 72.3, avg_volume_10d: 3800000 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', ltp: 1680.90, open: 1690, high: 1695, low: 1672, prev_close: 1685.1, change: -4.2, change_pct: -0.25, volume: 12000000, market_cap: 1200000, sector: 'Financial Services', exchange: 'NSE', week_52_high: 1880, week_52_low: 1450, pe_ratio: 21.3, roe: 16.8, roce: 18.2, debt_to_equity: 6.2, dividend_yield: 1.1, promoter_holding: 25.5, avg_volume_10d: 11000000 },
  { symbol: 'INFY', name: 'Infosys Ltd', ltp: 1520.40, open: 1505, high: 1535, low: 1498, prev_close: 1503.6, change: 16.8, change_pct: 1.12, volume: 8500000, market_cap: 750000, sector: 'Information Technology', exchange: 'NSE', week_52_high: 1720, week_52_low: 1250, pe_ratio: 28.5, roe: 32.1, roce: 40.5, debt_to_equity: 0.08, dividend_yield: 2.3, promoter_holding: 14.8, avg_volume_10d: 7500000 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', ltp: 1125.60, open: 1118, high: 1138, low: 1112, prev_close: 1110, change: 15.6, change_pct: 1.41, volume: 15000000, market_cap: 800000, sector: 'Financial Services', exchange: 'NSE', week_52_high: 1340, week_52_low: 950, pe_ratio: 19.5, roe: 17.2, roce: 19.1, debt_to_equity: 5.8, dividend_yield: 0.9, promoter_holding: 0, avg_volume_10d: 13000000 },
  { symbol: 'SBIN', name: 'State Bank of India', ltp: 812.30, open: 805, high: 820, low: 798, prev_close: 795, change: 17.3, change_pct: 2.18, volume: 22000000, market_cap: 720000, sector: 'Financial Services', exchange: 'NSE', week_52_high: 912, week_52_low: 600, pe_ratio: 10.2, roe: 18.5, roce: 16.8, debt_to_equity: 12.5, dividend_yield: 1.8, promoter_holding: 57.5, avg_volume_10d: 19000000 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', ltp: 7250.30, open: 7340, high: 7380, low: 7200, prev_close: 7338, change: -87.7, change_pct: -1.20, volume: 3200000, market_cap: 420000, sector: 'Financial Services', exchange: 'NSE', week_52_high: 8200, week_52_low: 6100, pe_ratio: 35.6, roe: 22.4, roce: 14.8, debt_to_equity: 3.5, dividend_yield: 0.5, promoter_holding: 54.7, avg_volume_10d: 2800000 },
  { symbol: 'ITC', name: 'ITC Ltd', ltp: 456.20, open: 452, high: 460, low: 450, prev_close: 454.2, change: 2.0, change_pct: 0.45, volume: 16000000, market_cap: 480000, sector: 'Consumer Goods', exchange: 'NSE', week_52_high: 530, week_52_low: 390, pe_ratio: 28.2, roe: 28.5, roce: 35.2, debt_to_equity: 0.01, dividend_yield: 3.2, promoter_holding: 0, avg_volume_10d: 14000000 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', ltp: 685.40, open: 672, high: 695, low: 668, prev_close: 665, change: 20.4, change_pct: 3.07, volume: 25000000, market_cap: 350000, sector: 'Automobile', exchange: 'NSE', week_52_high: 810, week_52_low: 520, pe_ratio: 8.5, roe: 35.2, roce: 18.5, debt_to_equity: 1.2, dividend_yield: 0.5, promoter_holding: 46.4, avg_volume_10d: 21000000 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', ltp: 1245.60, open: 1200, high: 1255, low: 1195, prev_close: 1204, change: 41.6, change_pct: 3.45, volume: 5800000, market_cap: 300000, sector: 'Pharma', exchange: 'NSE', week_52_high: 1380, week_52_low: 980, pe_ratio: 38.2, roe: 14.2, roce: 17.5, debt_to_equity: 0.15, dividend_yield: 0.8, promoter_holding: 54.5, avg_volume_10d: 5000000 },
  { symbol: 'LT', name: 'Larsen & Toubro', ltp: 3456.80, open: 3420, high: 3480, low: 3400, prev_close: 3410, change: 46.8, change_pct: 1.37, volume: 3100000, market_cap: 480000, sector: 'Infrastructure', exchange: 'NSE', week_52_high: 3900, week_52_low: 2800, pe_ratio: 35.1, roe: 15.2, roce: 18.3, debt_to_equity: 1.5, dividend_yield: 0.9, promoter_holding: 0, avg_volume_10d: 2800000 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', ltp: 12450.00, open: 12300, high: 12520, low: 12250, prev_close: 12280, change: 170.0, change_pct: 1.38, volume: 1200000, market_cap: 380000, sector: 'Automobile', exchange: 'NSE', week_52_high: 13200, week_52_low: 9800, pe_ratio: 30.5, roe: 14.8, roce: 18.2, debt_to_equity: 0.02, dividend_yield: 0.8, promoter_holding: 56.4, avg_volume_10d: 1000000 },
  { symbol: 'TITAN', name: 'Titan Company', ltp: 3580.50, open: 3560, high: 3600, low: 3540, prev_close: 3545, change: 35.5, change_pct: 1.00, volume: 2400000, market_cap: 320000, sector: 'Consumer Goods', exchange: 'NSE', week_52_high: 3950, week_52_low: 2900, pe_ratio: 82.5, roe: 25.3, roce: 30.2, debt_to_equity: 0.5, dividend_yield: 0.3, promoter_holding: 52.9, avg_volume_10d: 2100000 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', ltp: 2890.00, open: 2850, high: 2920, low: 2830, prev_close: 2835, change: 55.0, change_pct: 1.94, volume: 6800000, market_cap: 340000, sector: 'Infrastructure', exchange: 'NSE', week_52_high: 3500, week_52_low: 2200, pe_ratio: 72.5, roe: 8.5, roce: 10.2, debt_to_equity: 1.8, dividend_yield: 0.1, promoter_holding: 72.6, avg_volume_10d: 5500000 },
  { symbol: 'WIPRO', name: 'Wipro Ltd', ltp: 452.80, open: 448, high: 458, low: 445, prev_close: 450, change: 2.8, change_pct: 0.62, volume: 7500000, market_cap: 280000, sector: 'Information Technology', exchange: 'NSE', week_52_high: 540, week_52_low: 380, pe_ratio: 22.5, roe: 16.8, roce: 20.5, debt_to_equity: 0.2, dividend_yield: 1.2, promoter_holding: 72.9, avg_volume_10d: 6500000 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', ltp: 1580.00, open: 1565, high: 1595, low: 1558, prev_close: 1562, change: 18.0, change_pct: 1.15, volume: 5200000, market_cap: 920000, sector: 'Telecom', exchange: 'NSE', week_52_high: 1780, week_52_low: 1200, pe_ratio: 75.2, roe: 12.5, roce: 14.8, debt_to_equity: 2.8, dividend_yield: 0.5, promoter_holding: 55.1, avg_volume_10d: 4800000 },
  { symbol: 'AXISBANK', name: 'Axis Bank', ltp: 1145.60, open: 1138, high: 1158, low: 1130, prev_close: 1135, change: 10.6, change_pct: 0.93, volume: 9800000, market_cap: 350000, sector: 'Financial Services', exchange: 'NSE', week_52_high: 1340, week_52_low: 950, pe_ratio: 14.8, roe: 17.5, roce: 15.2, debt_to_equity: 8.5, dividend_yield: 0.1, promoter_holding: 8.2, avg_volume_10d: 8500000 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', ltp: 1780.00, open: 1770, high: 1795, low: 1760, prev_close: 1768, change: 12.0, change_pct: 0.68, volume: 4500000, market_cap: 350000, sector: 'Financial Services', exchange: 'NSE', week_52_high: 2010, week_52_low: 1550, pe_ratio: 22.1, roe: 14.2, roce: 15.8, debt_to_equity: 7.2, dividend_yield: 0.1, promoter_holding: 25.8, avg_volume_10d: 4000000 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', ltp: 2450.00, open: 2440, high: 2465, low: 2430, prev_close: 2455, change: -5.0, change_pct: -0.20, volume: 2800000, market_cap: 580000, sector: 'Consumer Goods', exchange: 'NSE', week_52_high: 2850, week_52_low: 2200, pe_ratio: 58.5, roe: 22.5, roce: 28.2, debt_to_equity: 0.01, dividend_yield: 1.8, promoter_holding: 61.9, avg_volume_10d: 2500000 },
  { symbol: 'NTPC', name: 'NTPC Ltd', ltp: 345.80, open: 340, high: 350, low: 338, prev_close: 338, change: 7.8, change_pct: 2.31, volume: 18000000, market_cap: 340000, sector: 'Power', exchange: 'NSE', week_52_high: 420, week_52_low: 280, pe_ratio: 18.2, roe: 12.5, roce: 10.8, debt_to_equity: 1.5, dividend_yield: 2.5, promoter_holding: 51.1, avg_volume_10d: 16000000 },
  { symbol: 'POWERGRID', name: 'Power Grid Corp', ltp: 298.50, open: 294, high: 302, low: 292, prev_close: 292, change: 6.5, change_pct: 2.23, volume: 12000000, market_cap: 280000, sector: 'Power', exchange: 'NSE', week_52_high: 360, week_52_low: 240, pe_ratio: 15.2, roe: 18.5, roce: 14.2, debt_to_equity: 2.8, dividend_yield: 3.5, promoter_holding: 51.3, avg_volume_10d: 10000000 },
  { symbol: 'TATASTEEL', name: 'Tata Steel', ltp: 142.50, open: 140, high: 145, low: 138, prev_close: 138, change: 4.5, change_pct: 3.26, volume: 35000000, market_cap: 180000, sector: 'Metals', exchange: 'NSE', week_52_high: 185, week_52_low: 118, pe_ratio: 52.5, roe: 5.8, roce: 8.2, debt_to_equity: 0.8, dividend_yield: 2.5, promoter_holding: 33.2, avg_volume_10d: 30000000 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', ltp: 892.40, open: 880, high: 900, low: 875, prev_close: 872, change: 20.4, change_pct: 2.34, volume: 8500000, market_cap: 220000, sector: 'Metals', exchange: 'NSE', week_52_high: 1050, week_52_low: 720, pe_ratio: 28.5, roe: 12.5, roce: 15.8, debt_to_equity: 1.2, dividend_yield: 0.8, promoter_holding: 44.8, avg_volume_10d: 7500000 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', ltp: 1380.20, open: 1365, high: 1395, low: 1358, prev_close: 1370, change: 10.2, change_pct: 0.74, volume: 3800000, market_cap: 380000, sector: 'Information Technology', exchange: 'NSE', week_52_high: 1580, week_52_low: 1150, pe_ratio: 24.5, roe: 22.8, roce: 28.5, debt_to_equity: 0.1, dividend_yield: 3.5, promoter_holding: 60.8, avg_volume_10d: 3200000 },
  { symbol: 'TECHM', name: 'Tech Mahindra', ltp: 1285.60, open: 1270, high: 1298, low: 1262, prev_close: 1265, change: 20.6, change_pct: 1.63, volume: 4200000, market_cap: 125000, sector: 'Information Technology', exchange: 'NSE', week_52_high: 1560, week_52_low: 1050, pe_ratio: 42.5, roe: 12.2, roce: 15.8, debt_to_equity: 0.1, dividend_yield: 2.5, promoter_holding: 35.2, avg_volume_10d: 3800000 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas', ltp: 248.50, open: 245, high: 252, low: 243, prev_close: 242, change: 6.5, change_pct: 2.69, volume: 14000000, market_cap: 310000, sector: 'Oil & Gas', exchange: 'NSE', week_52_high: 320, week_52_low: 200, pe_ratio: 7.5, roe: 14.5, roce: 18.2, debt_to_equity: 0.4, dividend_yield: 4.2, promoter_holding: 58.9, avg_volume_10d: 12000000 },
  { symbol: 'COALINDIA', name: 'Coal India', ltp: 438.20, open: 432, high: 442, low: 428, prev_close: 430, change: 8.2, change_pct: 1.91, volume: 8500000, market_cap: 270000, sector: 'Mining', exchange: 'NSE', week_52_high: 530, week_52_low: 360, pe_ratio: 8.2, roe: 52.5, roce: 60.2, debt_to_equity: 0.08, dividend_yield: 5.5, promoter_holding: 63.1, avg_volume_10d: 7500000 },
  { symbol: 'DRREDDY', name: "Dr. Reddy's Labs", ltp: 5820.00, open: 5780, high: 5860, low: 5750, prev_close: 5795, change: 25.0, change_pct: 0.43, volume: 1200000, market_cap: 98000, sector: 'Pharma', exchange: 'NSE', week_52_high: 6500, week_52_low: 4800, pe_ratio: 22.5, roe: 18.5, roce: 22.8, debt_to_equity: 0.1, dividend_yield: 0.7, promoter_holding: 26.7, avg_volume_10d: 1000000 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', ltp: 10250.00, open: 10180, high: 10320, low: 10150, prev_close: 10200, change: 50.0, change_pct: 0.49, volume: 800000, market_cap: 300000, sector: 'Cement', exchange: 'NSE', week_52_high: 11800, week_52_low: 8500, pe_ratio: 38.5, roe: 12.5, roce: 15.8, debt_to_equity: 0.4, dividend_yield: 0.4, promoter_holding: 60.4, avg_volume_10d: 700000 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', ltp: 2780.00, open: 2790, high: 2810, low: 2760, prev_close: 2800, change: -20.0, change_pct: -0.71, volume: 2200000, market_cap: 270000, sector: 'Consumer Goods', exchange: 'NSE', week_52_high: 3400, week_52_low: 2500, pe_ratio: 55.2, roe: 28.5, roce: 35.2, debt_to_equity: 0.3, dividend_yield: 0.8, promoter_holding: 52.6, avg_volume_10d: 2000000 },
  { symbol: 'NESTLEIND', name: 'Nestle India', ltp: 2320.00, open: 2340, high: 2350, low: 2310, prev_close: 2345, change: -25.0, change_pct: -1.07, volume: 800000, market_cap: 224000, sector: 'Consumer Goods', exchange: 'NSE', week_52_high: 2780, week_52_low: 2100, pe_ratio: 72.5, roe: 108.5, roce: 140.2, debt_to_equity: 0.5, dividend_yield: 1.5, promoter_holding: 62.8, avg_volume_10d: 700000 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', ltp: 2680.00, open: 2650, high: 2710, low: 2640, prev_close: 2645, change: 35.0, change_pct: 1.32, volume: 5500000, market_cap: 330000, sector: 'Automobile', exchange: 'NSE', week_52_high: 3100, week_52_low: 2100, pe_ratio: 28.5, roe: 18.5, roce: 22.8, debt_to_equity: 0.3, dividend_yield: 0.7, promoter_holding: 18.5, avg_volume_10d: 4800000 },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', ltp: 1620.00, open: 1635, high: 1640, low: 1608, prev_close: 1638, change: -18.0, change_pct: -1.10, volume: 2500000, market_cap: 260000, sector: 'Financial Services', exchange: 'NSE', week_52_high: 1900, week_52_low: 1380, pe_ratio: 32.5, roe: 12.5, roce: 14.8, debt_to_equity: 2.5, dividend_yield: 0.1, promoter_holding: 60.5, avg_volume_10d: 2200000 },
  { symbol: 'CIPLA', name: 'Cipla Ltd', ltp: 1450.00, open: 1435, high: 1465, low: 1428, prev_close: 1430, change: 20.0, change_pct: 1.40, volume: 3200000, market_cap: 118000, sector: 'Pharma', exchange: 'NSE', week_52_high: 1680, week_52_low: 1150, pe_ratio: 28.5, roe: 15.2, roce: 19.8, debt_to_equity: 0.08, dividend_yield: 0.7, promoter_holding: 33.5, avg_volume_10d: 2800000 },
  { symbol: 'DIVISLAB', name: "Divi's Laboratories", ltp: 4520.00, open: 4480, high: 4560, low: 4460, prev_close: 4490, change: 30.0, change_pct: 0.67, volume: 900000, market_cap: 120000, sector: 'Pharma', exchange: 'NSE', week_52_high: 5200, week_52_low: 3500, pe_ratio: 62.5, roe: 18.5, roce: 22.8, debt_to_equity: 0.02, dividend_yield: 0.8, promoter_holding: 51.9, avg_volume_10d: 800000 },
  { symbol: 'EICHERMOT', name: 'Eicher Motors', ltp: 4680.00, open: 4650, high: 4720, low: 4630, prev_close: 4640, change: 40.0, change_pct: 0.86, volume: 1500000, market_cap: 128000, sector: 'Automobile', exchange: 'NSE', week_52_high: 5200, week_52_low: 3800, pe_ratio: 35.5, roe: 22.5, roce: 28.2, debt_to_equity: 0.01, dividend_yield: 0.6, promoter_holding: 49.2, avg_volume_10d: 1300000 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', ltp: 4850.00, open: 4820, high: 4880, low: 4800, prev_close: 4810, change: 40.0, change_pct: 0.83, volume: 1800000, market_cap: 97000, sector: 'Automobile', exchange: 'NSE', week_52_high: 5500, week_52_low: 3800, pe_ratio: 22.5, roe: 22.8, roce: 28.5, debt_to_equity: 0.01, dividend_yield: 3.2, promoter_holding: 34.8, avg_volume_10d: 1500000 },
  { symbol: 'GRASIM', name: 'Grasim Industries', ltp: 2580.00, open: 2560, high: 2610, low: 2540, prev_close: 2545, change: 35.0, change_pct: 1.37, volume: 2200000, market_cap: 170000, sector: 'Cement', exchange: 'NSE', week_52_high: 2950, week_52_low: 2100, pe_ratio: 18.5, roe: 8.5, roce: 10.2, debt_to_equity: 0.5, dividend_yield: 0.5, promoter_holding: 42.6, avg_volume_10d: 1900000 },
  { symbol: 'TATAPOWER', name: 'Tata Power', ltp: 418.50, open: 412, high: 425, low: 408, prev_close: 408, change: 10.5, change_pct: 2.57, volume: 28000000, market_cap: 134000, sector: 'Power', exchange: 'NSE', week_52_high: 480, week_52_low: 320, pe_ratio: 38.5, roe: 10.2, roce: 12.5, debt_to_equity: 1.8, dividend_yield: 0.5, promoter_holding: 46.9, avg_volume_10d: 24000000 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', ltp: 568.20, open: 558, high: 575, low: 555, prev_close: 555, change: 13.2, change_pct: 2.38, volume: 9500000, market_cap: 128000, sector: 'Metals', exchange: 'NSE', week_52_high: 680, week_52_low: 450, pe_ratio: 12.5, roe: 12.8, roce: 14.5, debt_to_equity: 0.8, dividend_yield: 0.6, promoter_holding: 34.6, avg_volume_10d: 8500000 },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank', ltp: 1380.00, open: 1395, high: 1405, low: 1368, prev_close: 1402, change: -22.0, change_pct: -1.57, volume: 6500000, market_cap: 107000, sector: 'Financial Services', exchange: 'NSE', week_52_high: 1700, week_52_low: 1100, pe_ratio: 12.5, roe: 14.5, roce: 12.8, debt_to_equity: 9.5, dividend_yield: 1.2, promoter_holding: 16.5, avg_volume_10d: 5800000 },
  { symbol: 'VEDL', name: 'Vedanta Ltd', ltp: 438.60, open: 430, high: 445, low: 425, prev_close: 425, change: 13.6, change_pct: 3.20, volume: 18000000, market_cap: 163000, sector: 'Metals', exchange: 'NSE', week_52_high: 520, week_52_low: 280, pe_ratio: 15.5, roe: 28.5, roce: 22.8, debt_to_equity: 1.5, dividend_yield: 8.5, promoter_holding: 68.1, avg_volume_10d: 15000000 },
  { symbol: 'ZOMATO', name: 'Zomato Ltd', ltp: 245.80, open: 242, high: 250, low: 238, prev_close: 240, change: 5.8, change_pct: 2.42, volume: 32000000, market_cap: 215000, sector: 'Consumer Services', exchange: 'NSE', week_52_high: 310, week_52_low: 150, pe_ratio: 250, roe: 2.5, roce: 3.2, debt_to_equity: 0.01, dividend_yield: 0, promoter_holding: 0, avg_volume_10d: 28000000 },
  { symbol: 'PAYTM', name: 'One 97 Communications', ltp: 685.00, open: 678, high: 695, low: 670, prev_close: 672, change: 13.0, change_pct: 1.93, volume: 12000000, market_cap: 44000, sector: 'Consumer Services', exchange: 'NSE', week_52_high: 850, week_52_low: 400, pe_ratio: -1, roe: -12.5, roce: -10.2, debt_to_equity: 0.01, dividend_yield: 0, promoter_holding: 0, avg_volume_10d: 10000000 },
  { symbol: 'IRCTC', name: 'IRCTC', ltp: 895.00, open: 885, high: 905, low: 878, prev_close: 880, change: 15.0, change_pct: 1.70, volume: 5200000, market_cap: 72000, sector: 'Consumer Services', exchange: 'NSE', week_52_high: 1050, week_52_low: 650, pe_ratio: 58.5, roe: 35.2, roce: 45.8, debt_to_equity: 0.01, dividend_yield: 0.8, promoter_holding: 62.4, avg_volume_10d: 4500000 },
  { symbol: 'HAL', name: 'Hindustan Aeronautics', ltp: 4120.00, open: 4080, high: 4160, low: 4050, prev_close: 4060, change: 60.0, change_pct: 1.48, volume: 3800000, market_cap: 275000, sector: 'Defence', exchange: 'NSE', week_52_high: 5100, week_52_low: 3200, pe_ratio: 32.5, roe: 25.8, roce: 32.5, debt_to_equity: 0.01, dividend_yield: 1.2, promoter_holding: 71.6, avg_volume_10d: 3200000 },
  { symbol: 'BEL', name: 'Bharat Electronics', ltp: 285.40, open: 280, high: 290, low: 278, prev_close: 278, change: 7.4, change_pct: 2.66, volume: 25000000, market_cap: 208000, sector: 'Defence', exchange: 'NSE', week_52_high: 340, week_52_low: 210, pe_ratio: 42.5, roe: 22.5, roce: 28.8, debt_to_equity: 0.01, dividend_yield: 0.8, promoter_holding: 51.1, avg_volume_10d: 22000000 },
  { symbol: 'TRENT', name: 'Trent Ltd', ltp: 5850.00, open: 5800, high: 5920, low: 5780, prev_close: 5790, change: 60.0, change_pct: 1.04, volume: 1800000, market_cap: 210000, sector: 'Consumer Goods', exchange: 'NSE', week_52_high: 7200, week_52_low: 4200, pe_ratio: 180, roe: 18.5, roce: 22.8, debt_to_equity: 0.5, dividend_yield: 0.1, promoter_holding: 36.3, avg_volume_10d: 1500000 },
];

export const INDICES: IndexData[] = [
  { symbol: 'NIFTY 50', ltp: 22542.75, open: 22380, high: 22610, low: 22350, change_pct: 1.42 },
  { symbol: 'SENSEX', ltp: 74340.50, open: 73800, high: 74520, low: 73750, change_pct: 1.38 },
  { symbol: 'BANKNIFTY', ltp: 48250.80, open: 47900, high: 48420, low: 47850, change_pct: 0.95 },
];

export function getAllStocks(): Stock[] {
  return STOCKS;
}

export function getStock(symbol: string): Stock | undefined {
  return STOCKS.find(s => s.symbol === symbol);
}

export function getTopGainers(): Stock[] {
  return [...STOCKS].sort((a, b) => b.change_pct - a.change_pct).slice(0, 10);
}

export function getTopLosers(): Stock[] {
  return [...STOCKS].sort((a, b) => a.change_pct - b.change_pct).slice(0, 10);
}

export function getMostActive(): Stock[] {
  return [...STOCKS].sort((a, b) => b.volume - a.volume).slice(0, 10);
}

export function getSectorPerformance() {
  const sectors: Record<string, { stocks: Stock[]; total_change: number }> = {};
  STOCKS.forEach(s => {
    if (!sectors[s.sector]) sectors[s.sector] = { stocks: [], total_change: 0 };
    sectors[s.sector].stocks.push(s);
    sectors[s.sector].total_change += s.change_pct;
  });
  return Object.entries(sectors).map(([sector, data]) => ({
    sector,
    count: data.stocks.length,
    avg_change: data.total_change / data.stocks.length,
    stocks: data.stocks.sort((a, b) => b.change_pct - a.change_pct),
  })).sort((a, b) => b.avg_change - a.avg_change);
}

export function getStocksBySector(sector: string): Stock[] {
  return STOCKS.filter(s => s.sector === sector);
}

// Generate candlestick data
export function generateCandleData(symbol: string, days: number = 250): { time: string; open: number; high: number; low: number; close: number; volume: number }[] {
  const stock = getStock(symbol);
  const basePrice = stock?.ltp || 1000;
  const candles: { time: string; open: number; high: number; low: number; close: number; volume: number }[] = [];
  let price = basePrice * 0.7;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const volatility = 0.02 + Math.random() * 0.03;
    const trend = (basePrice - price) / basePrice * 0.05;
    const change = (Math.random() - 0.45 + trend) * volatility * price;
    
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.015);
    const low = Math.min(open, close) * (1 - Math.random() * 0.015);
    const volume = Math.floor(500000 + Math.random() * 15000000);

    candles.push({
      time: date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });

    price = close;
  }

  return candles;
}

export const SCANNERS: ScannerDef[] = [
  { key: 'top_gainers', name: 'Top Gainers', description: 'Stocks with highest positive change', icon: '🔺', category: 'MVP Picks' },
  { key: 'top_losers', name: 'Top Losers', description: 'Stocks with most negative change', icon: '🔻', category: 'MVP Picks' },
  { key: 'most_active', name: 'Most Active', description: 'Highest volume stocks today', icon: '📊', category: 'MVP Picks' },
  { key: 'day_high', name: 'Day High', description: 'Stocks near intraday high', icon: '🔺', category: 'Price Levels' },
  { key: 'day_low', name: 'Day Low', description: 'Stocks near intraday low', icon: '🔻', category: 'Price Levels' },
  { key: 'week_52_high_breakout', name: '52W High Breakout', description: 'Breaking 52-week high', icon: '🏆', category: 'Price Levels' },
  { key: 'week_52_low_breakdown', name: '52W Low Breakdown', description: 'Breaking 52-week low', icon: '💥', category: 'Price Levels' },
  { key: 'up_5pct_high_vol', name: 'Up >5% + High Vol', description: 'Large gains with high volume confirmation', icon: '🚀', category: 'Performance' },
  { key: 'gap_up', name: 'Gap Up', description: 'Opened above previous close', icon: '⬆️', category: 'Performance' },
  { key: 'gap_down', name: 'Gap Down', description: 'Opened below previous close', icon: '⬇️', category: 'Performance' },
  { key: 'volume_spike', name: 'Volume Spike', description: 'Volume 3x above average', icon: '📈', category: 'Volume' },
  { key: 'high_roe', name: 'High ROE', description: 'ROE above 20%', icon: '💎', category: 'Performance' },
  { key: 'low_pe', name: 'Low PE Ratio', description: 'PE below 15', icon: '💰', category: 'Performance' },
  { key: 'high_dividend', name: 'High Dividend', description: 'Dividend yield above 3%', icon: '💵', category: 'Performance' },
];

export function runScanner(key: string): Stock[] {
  switch (key) {
    case 'top_gainers': return getTopGainers();
    case 'top_losers': return getTopLosers();
    case 'most_active': return getMostActive();
    case 'day_high': return STOCKS.filter(s => s.ltp >= s.high * 0.99).slice(0, 10);
    case 'day_low': return STOCKS.filter(s => s.ltp <= s.low * 1.01).slice(0, 10);
    case 'week_52_high_breakout': return STOCKS.filter(s => s.ltp >= s.week_52_high * 0.95).slice(0, 10);
    case 'week_52_low_breakdown': return STOCKS.filter(s => s.ltp <= s.week_52_low * 1.05).slice(0, 10);
    case 'up_5pct_high_vol': return STOCKS.filter(s => s.change_pct >= 2.5).slice(0, 10);
    case 'gap_up': return STOCKS.filter(s => s.open > s.prev_close).sort((a, b) => b.change_pct - a.change_pct).slice(0, 10);
    case 'gap_down': return STOCKS.filter(s => s.open < s.prev_close).sort((a, b) => a.change_pct - b.change_pct).slice(0, 10);
    case 'volume_spike': return STOCKS.filter(s => s.volume > (s.avg_volume_10d || 0) * 1.5).slice(0, 10);
    case 'high_roe': return STOCKS.filter(s => (s.roe || 0) >= 20).sort((a, b) => (b.roe || 0) - (a.roe || 0)).slice(0, 10);
    case 'low_pe': return STOCKS.filter(s => (s.pe_ratio || 999) > 0 && (s.pe_ratio || 999) < 20).sort((a, b) => (a.pe_ratio || 0) - (b.pe_ratio || 0)).slice(0, 10);
    case 'high_dividend': return STOCKS.filter(s => (s.dividend_yield || 0) >= 2).sort((a, b) => (b.dividend_yield || 0) - (a.dividend_yield || 0)).slice(0, 10);
    default: return getTopGainers();
  }
}

export const NEWS: NewsArticle[] = [
  { title: 'Sensex jumps 500 points as banking stocks lead rally; Nifty reclaims 22,500', source: 'Economic Times', category: 'Market', published_at: new Date().toISOString(), url: '#' },
  { title: 'RBI MPC keeps repo rate unchanged at 6.5%, shifts stance to accommodative', source: 'Moneycontrol', category: 'Economy', published_at: new Date(Date.now() - 3600000).toISOString(), url: '#' },
  { title: 'TCS Q4 results: Net profit rises 12% YoY, beats street estimates', source: 'LiveMint', category: 'Stocks', published_at: new Date(Date.now() - 7200000).toISOString(), url: '#' },
  { title: 'Adani Group FPO: Fresh issue fully subscribed on Day 2 of bidding', source: 'NDTV Profit', category: 'IPO', published_at: new Date(Date.now() - 10800000).toISOString(), url: '#' },
  { title: 'Gold price surges to ₹72,000 per 10 grams; silver at all-time high', source: 'Business Standard', category: 'Market', published_at: new Date(Date.now() - 14400000).toISOString(), url: '#' },
  { title: 'FIIs pull out ₹15,000 crore from Indian equities in March amid global uncertainty', source: 'Financial Express', category: 'Market', published_at: new Date(Date.now() - 18000000).toISOString(), url: '#' },
  { title: 'Auto stocks surge as February sales data exceeds expectations across the board', source: 'Autocar India', category: 'Stocks', published_at: new Date(Date.now() - 21600000).toISOString(), url: '#' },
  { title: 'India GDP growth forecast revised upward to 7.2% by World Bank', source: 'Reuters', category: 'Economy', published_at: new Date(Date.now() - 25200000).toISOString(), url: '#' },
  { title: 'SEBI tightens rules for F&O trading; margin requirements to increase from April', source: 'Moneycontrol', category: 'Market', published_at: new Date(Date.now() - 28800000).toISOString(), url: '#' },
];

export const FII_DII_HISTORY: FiiDiiData[] = [
  { date: '2026-03-28', fii_buy: 48000, fii_sell: 58724, fii_net: -10724, dii_buy: 22000, dii_sell: 12023, dii_net: 9977 },
  { date: '2026-03-27', fii_buy: 52000, fii_sell: 54100, fii_net: -2100, dii_buy: 19500, dii_sell: 17800, dii_net: 1700 },
  { date: '2026-03-26', fii_buy: 45000, fii_sell: 42000, fii_net: 3000, dii_buy: 18000, dii_sell: 19500, dii_net: -1500 },
  { date: '2026-03-25', fii_buy: 55000, fii_sell: 60200, fii_net: -5200, dii_buy: 24000, dii_sell: 18800, dii_net: 5200 },
  { date: '2026-03-24', fii_buy: 47000, fii_sell: 51500, fii_net: -4500, dii_buy: 21000, dii_sell: 16500, dii_net: 4500 },
  { date: '2026-03-21', fii_buy: 51000, fii_sell: 48500, fii_net: 2500, dii_buy: 17500, dii_sell: 18200, dii_net: -700 },
  { date: '2026-03-20', fii_buy: 49000, fii_sell: 53800, fii_net: -4800, dii_buy: 23000, dii_sell: 17500, dii_net: 5500 },
  { date: '2026-03-19', fii_buy: 46000, fii_sell: 50200, fii_net: -4200, dii_buy: 20500, dii_sell: 16800, dii_net: 3700 },
  { date: '2026-03-18', fii_buy: 53000, fii_sell: 49500, fii_net: 3500, dii_buy: 18000, dii_sell: 19500, dii_net: -1500 },
  { date: '2026-03-17', fii_buy: 44000, fii_sell: 52000, fii_net: -8000, dii_buy: 25000, dii_sell: 17500, dii_net: 7500 },
];

export const SECTOR_FII_ALLOCATION = [
  { name: 'Financial Services', fii_pct: 34.5 },
  { name: 'Information Technology', fii_pct: 18.9 },
  { name: 'Oil & Gas', fii_pct: 12.7 },
  { name: 'Consumer Goods', fii_pct: 8.3 },
  { name: 'Pharma', fii_pct: 6.2 },
  { name: 'Automobile', fii_pct: 5.8 },
  { name: 'Metals', fii_pct: 4.1 },
  { name: 'Power', fii_pct: 3.5 },
  { name: 'Telecom', fii_pct: 2.8 },
  { name: 'Infrastructure', fii_pct: 2.2 },
  { name: 'Defence', fii_pct: 1.0 },
];

export function generateOptionsChain(symbol: string): { chain: OptionRow[]; underlyingValue: number; expiryDates: string[]; analytics: Record<string, number> } {
  const stock = getStock(symbol);
  const spot = stock?.ltp || 22500;
  const strikeDiff = spot > 5000 ? 100 : spot > 1000 ? 50 : spot > 500 ? 25 : 10;
  const atmStrike = Math.round(spot / strikeDiff) * strikeDiff;
  
  const chain: OptionRow[] = [];
  let totalCallOI = 0, totalPutOI = 0, totalCallVol = 0, totalPutVol = 0;

  for (let i = -20; i <= 20; i++) {
    const strike = atmStrike + i * strikeDiff;
    const dist = Math.abs(i);
    const ceOI = Math.floor((30000 - dist * 1200 + Math.random() * 5000) * 75);
    const peOI = Math.floor((25000 - dist * 1000 + Math.random() * 5000) * 75);
    const ceVol = Math.floor(5000 + Math.random() * 20000);
    const peVol = Math.floor(4000 + Math.random() * 18000);
    const ceIV = 12 + dist * 0.8 + Math.random() * 3;
    const peIV = 13 + dist * 0.9 + Math.random() * 3;
    const intrinsicCE = Math.max(spot - strike, 0);
    const intrinsicPE = Math.max(strike - spot, 0);
    const ceLTP = intrinsicCE + (5 - dist * 0.2 + Math.random() * 8) * (strikeDiff / 50);
    const peLTP = intrinsicPE + (5 - dist * 0.2 + Math.random() * 8) * (strikeDiff / 50);

    totalCallOI += Math.max(ceOI, 0);
    totalPutOI += Math.max(peOI, 0);
    totalCallVol += ceVol;
    totalPutVol += peVol;

    chain.push({
      strike,
      ce: { oi: Math.max(ceOI, 500), chg_oi: Math.floor((Math.random() - 0.3) * 5000), volume: ceVol, iv: Math.round(ceIV * 10) / 10, ltp: Math.max(Math.round(ceLTP * 100) / 100, 0.5) },
      pe: { oi: Math.max(peOI, 500), chg_oi: Math.floor((Math.random() - 0.3) * 5000), volume: peVol, iv: Math.round(peIV * 10) / 10, ltp: Math.max(Math.round(peLTP * 100) / 100, 0.5) },
    });
  }

  const maxPain = atmStrike;
  const pcr = totalPutOI / (totalCallOI || 1);

  const today = new Date();
  const expiryDates: string[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + (i + 1) * 7 - d.getDay() + 4);
    expiryDates.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
  }

  return {
    chain,
    underlyingValue: spot,
    expiryDates,
    analytics: {
      maxPain,
      pcr: Math.round(pcr * 100) / 100,
      totalCallOI,
      totalPutOI,
      totalCallVolume: totalCallVol,
      totalPutVolume: totalPutVol,
    },
  };
}
