// Інтерфейс для торгової пари, отриманої з REST API
export interface TradingPair {
  id: string; // e.g., 'BTCUSDT'
  name: string; // e.g., 'BTC/USDT'
  baseAsset: string; // e.g., 'BTC'
  quoteAsset: string; // e.g., 'USDT'
  iconUrl?: string; // Optional icon URL
}

// Інтерфейс для даних тікера з WebSocket
export interface TickerData {
  symbol: string;         // 'BTCUSDT'
  price: number;          // Current price
  priceChangePercent: number; // 24h price change percent
  lastPrice: number;      // Previous price to determine color
}

// Інтерфейс для даних свічки (kline) з WebSocket
export interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}