import { ref, onUnmounted, watch } from 'vue';
import type { UTCTimestamp } from 'lightweight-charts';
import { BINANCE_WS_BASE_URL } from '~/constants/api';
import type { KlineData } from '~/types/trading';

type KlineMessageCallback = (data: KlineData) => void;

export function useBinanceKlineSocket(
  symbol: Ref<string | null>,
  onMessage: KlineMessageCallback
) {
  const ws = ref<WebSocket | null>(null);

  const connect = (targetSymbol: string | null) => {
    // Закриваємо старе з'єднання
    if (ws.value) {
      ws.value.onclose = null; // Прибираємо обробник, щоб уникнути логіки перепідключення
      ws.value.close();
    }

    if (!targetSymbol) return;

    const url = `${BINANCE_WS_BASE_URL}/${targetSymbol.toLowerCase()}@kline_1m`;
    const newWs = new WebSocket(url);

    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.e === 'kline') {
        const kline = data.k;
        // Перетворюємо дані у наш формат KlineData
        onMessage({
          time: (kline.t / 1000) as UTCTimestamp,
          open: parseFloat(kline.o),
          high: parseFloat(kline.h),
          low: parseFloat(kline.l),
          close: parseFloat(kline.c),
        });
      }
    };

    newWs.onerror = (error) => {
      console.error('Kline WebSocket error:', error);
    };

    ws.value = newWs;
  };

  // Слідкуємо за зміною символу і перепідключаємось
  watch(symbol, connect, { immediate: true });

  onUnmounted(() => {
    if (ws.value) {
      ws.value.close();
    }
  });
}