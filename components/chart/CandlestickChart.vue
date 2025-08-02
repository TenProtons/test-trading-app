<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { createChart, type IChartApi, type ISeriesApi, type UTCTimestamp, CandlestickSeries } from 'lightweight-charts';
import { useTradingStore } from '~/stores/tradingStore';
import { useTheme } from '~/composables/useTheme';
import { useBinanceKlineSocket } from '~/composables/useBinanceKlineSocket';
import type { BinanceKline, KlineData } from '~/types/trading';
import { BINANCE_API_BASE_URL, KLINE_DATA_ENDPOINT } from '~/constants/api';

const props = defineProps<{
  symbol: string;
}>();

const store = useTradingStore();
const { theme } = useTheme();

const chartContainer = ref<HTMLDivElement | null>(null);
const isLoading = ref(true);

let chart: IChartApi | null = null;
let candleSeries: ISeriesApi<'Candlestick'> | null = null;

async function fetchHistoricalData(symbol: string): Promise<KlineData[]> {
  try {
    const url = `${BINANCE_API_BASE_URL}${KLINE_DATA_ENDPOINT}?symbol=${symbol}&interval=1m&limit=300`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch historical klines');
    const data: BinanceKline[] = await response.json();

    return data.map(k => ({
      time: (k[0] / 1000) as UTCTimestamp,
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
    }));
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return [];
  }
}

function calculatePricePrecision(price: number | undefined): number {
  if (price === undefined || price === null || price === 0) {
    return 2; // Повертаємо стандартну точність за замовчуванням
  }
  // Перетворюємо ціну в рядок і шукаємо десяткову частину
  const priceString = price.toString();
  const decimalPart = priceString.split('.')[1];

  // Якщо десяткової частини немає, точність 2 (напр. для BTC)
  if (!decimalPart) {
    return 2;
  }

  // Інакше, точність - це довжина десяткової частини
  return decimalPart.length;
}

async function initializeChart(symbol: string) {
  if (!chartContainer.value) return;
  isLoading.value = true;

  if (chart) {
    chart.remove();
  }

  const currentPairData = store.getPairRealtimeData(symbol);
  const precision = calculatePricePrecision(currentPairData?.price);
  const priceFormat = {
    type: 'price' as const,
    precision: precision,
    minMove: 1 / Math.pow(10, precision), // Найменший крок ціни, напр. 0.00000001
  };

  chart = createChart(chartContainer.value, getChartOptions());

  candleSeries = chart.addSeries(CandlestickSeries, {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
    priceFormat: priceFormat,
  });

  const historicalData = await fetchHistoricalData(symbol);
  if (candleSeries && historicalData.length > 0) {
    candleSeries.setData(historicalData);
  }

  chart.timeScale().fitContent();
  isLoading.value = false;
}

const getChartOptions = () => ({
  layout: {
    background: { color: theme.value === 'dark' ? '#1e293b' : '#ffffff' },
    textColor: theme.value === 'dark' ? '#d1d5db' : '#1f2937',
  },
  grid: {
    vertLines: { color: theme.value === 'dark' ? '#334155' : '#e5e7eb' },
    horzLines: { color: theme.value === 'dark' ? '#334155' : '#e5e7eb' },
  },
  crosshair: { mode: 1 },
  timeScale: { timeVisible: true, secondsVisible: false },
});

useBinanceKlineSocket(ref(props.symbol), (klineUpdate) => {
  if (candleSeries) {
    candleSeries.update(klineUpdate);
  }
});

onMounted(() => {
  initializeChart(props.symbol)
});
onUnmounted(() => {
  if (chart) {
    chart.remove()
  }
});
watch(theme, () => {
  if (chart) {
    chart.applyOptions(getChartOptions())
  }
});
</script>

<template>
  <div class="chart-wrapper bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
    <div class="chart-header">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">Графік: {{ symbol }} (1m)</h3>
      <button @click="store.setActiveChart(null)" class="text-gray-500 hover:text-red-500">×</button>
    </div>
    <div v-if="isLoading" class="chart-loader">Завантаження даних графіка...</div>
    <div ref="chartContainer" class="chart-container" :style="{ opacity: isLoading ? 0 : 1 }"></div>
  </div>
</template>

<style lang="scss" scoped>
.chart-wrapper {
  position: relative;
  min-height: 450px;
}

.chart-header {
  @apply flex justify-between items-center mb-4;

  button {
    @apply text-3xl font-bold p-0 leading-none;
  }
}

.chart-container {
  width: 100%;
  height: 400px;
  transition: opacity 0.3s ease;
}

.chart-loader {
  @apply absolute inset-0 flex items-center justify-center text-gray-500;
}
</style>