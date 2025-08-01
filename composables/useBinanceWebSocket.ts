import { ref, onUnmounted, watch, type Ref } from 'vue';
import { BINANCE_WS_BASE_URL } from '../constants/api';

type MessageCallback = (data: any) => void;

export function useBinanceWebSocket(symbols: Ref<string[]>, onMessage: MessageCallback) {
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref<boolean>(false);

  const connect = () => {
    if (!symbols.value.length) {
      disconnect();
      return;
    }

    // Формуємо список потоків для підписки
    const streams = symbols.value.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const url = `${BINANCE_WS_BASE_URL}/${streams}`;

    // Перепідключаємось, якщо URL змінився
    if (ws.value && ws.value.url !== url) {
      disconnect();
    }

    if (ws.value) return; // Вже підключено

    ws.value = new WebSocket(url);

    ws.value.onopen = () => {
      isConnected.value = true;
      console.log('WebSocket connected');
    };

    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.e === '24hrTicker') {
        onMessage(data);
      }
    };

    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error);
      isConnected.value = false;
    };

    ws.value.onclose = () => {
      isConnected.value = false;
      ws.value = null;
      console.log('WebSocket disconnected');
    };
  };

  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
    }
  };

  // Слідкуємо за зміною обраних пар і перепідключаємось
  watch(symbols, connect, { deep: true, immediate: true });

  // Гарантуємо закриття з'єднання при знищенні компонента
  onUnmounted(disconnect);

  return {
    isConnected,
  };
}