import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import type { TickerData, TradingPair } from '../types/trading';
import { BINANCE_API_BASE_URL, COIN_ICON_BASE_URL, EXCHANGE_INFO_ENDPOINT } from '../constants/api';

// Допоміжна функція для отримання іконки
const getIconUrl = (asset: string) => `${COIN_ICON_BASE_URL}${asset.toLowerCase()}.png`;

export const useTradingStore = defineStore('trading', () => {
  // STATE
  const allPairs = ref<TradingPair[]>([]);
  const selectedSymbols = ref<string[]>([]);
  const realtimeData = reactive<Record<string, TickerData>>({});
  const isLoading = ref<boolean>(false);
  const activeChartSymbol = ref<string | null>(null);

  // GETTERS (Computed)
  const selectedPairs = computed((): TradingPair[] => {
    return selectedSymbols.value
      .map(symbol => allPairs.value.find(p => p.id === symbol))
      .filter((p): p is TradingPair => p !== undefined);
  });

  const getPairRealtimeData = computed(() => {
    return (symbol: string): TickerData | undefined => realtimeData[symbol];
  });

  // ACTIONS
  async function fetchAllPairs() {
    isLoading.value = true;
    try {
      const response = await fetch(`${BINANCE_API_BASE_URL}${EXCHANGE_INFO_ENDPOINT}`);
      if (!response.ok) throw new Error('Failed to fetch exchange info');

      const data = await response.json();
      // Фільтруємо тільки активні пари та популярні ринки
      const popularQuoteAssets = ['USDT', 'EUR'];

      allPairs.value = data.symbols
        .filter((s: any) => s.status === 'TRADING' && popularQuoteAssets.includes(s.quoteAsset))
        .map((s: any): TradingPair => ({
          id: s.symbol,
          name: `${s.baseAsset}/${s.quoteAsset}`,
          baseAsset: s.baseAsset,
          quoteAsset: s.quoteAsset,
          iconUrl: getIconUrl(s.baseAsset),
        }));
    } catch (error) {
      console.error("Error fetching trading pairs:", error);
    } finally {
      isLoading.value = false;
    }
  }

  function updateSelectedSymbols(symbols: string[]) {
    selectedSymbols.value = symbols;
    saveToLocalStorage();
  }

  function updateTickerData(data: any) {
    const symbol = data.s;
    const currentPrice = parseFloat(data.c);

    const existingData = realtimeData[symbol];
    const lastPrice = existingData ? existingData.price : currentPrice;

    realtimeData[symbol] = {
      symbol: symbol,
      price: currentPrice,
      priceChangePercent: parseFloat(data.P),
      lastPrice: lastPrice,
    };
  }

  function setActiveChart(symbol: string | null) {
    activeChartSymbol.value = symbol;
  }

  function saveToLocalStorage() {
    localStorage.setItem('selectedTradingSymbols', JSON.stringify(selectedSymbols.value));
  }

  function loadFromLocalStorage() {
    const savedSymbols = localStorage.getItem('selectedTradingSymbols');
    if (savedSymbols) {
      selectedSymbols.value = JSON.parse(savedSymbols);
    }
  }

  return {
    allPairs,
    selectedSymbols,
    realtimeData,
    isLoading,
    activeChartSymbol,
    selectedPairs,
    getPairRealtimeData,
    fetchAllPairs,
    updateSelectedSymbols,
    updateTickerData,
    setActiveChart,
    loadFromLocalStorage,
  };
});