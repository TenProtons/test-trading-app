import { ref, onUnmounted, watch } from 'vue';
import { BINANCE_WS_BASE_URL } from '~/constants/api';

type MessageCallback = (data: any) => void;

export function useBinanceWebSocket(symbols: Ref<string[]>, onMessage: MessageCallback) {
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref<boolean>(false);

  watch(symbols, (newSymbols) => {
    if (ws.value) {
      ws.value.onopen = null;
      ws.value.onmessage = null;
      ws.value.onerror = null;
      ws.value.onclose = null;
      ws.value.close();
    }

    if (!newSymbols || newSymbols.length === 0) {
      isConnected.value = false;
      ws.value = null;
      return;
    }

    const streams = newSymbols.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const newWs = new WebSocket(`${BINANCE_WS_BASE_URL}/${streams}`);

    newWs.onopen = () => {
      console.log('WebSocket connected to:', newWs.url);
      isConnected.value = true;
    };

    newWs.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.e === '24hrTicker') {
        onMessage(message);
      }
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
      // isConnected буде встановлено в false в обробнику onclose, який завжди викликається після onerror.
    };

    newWs.onclose = () => {
      // Переконуємось, що це саме наш поточний сокет закрився, а не якийсь старий.
      if (ws.value === newWs) {
        console.log('WebSocket disconnected.');
        isConnected.value = false;
        ws.value = null;
      }
    };

    ws.value = newWs;
  }, {
    deep: true,
    immediate: true
  });

  onUnmounted(() => {
    if (ws.value) {
      ws.value.close();
    }
  });

  return { isConnected };
}