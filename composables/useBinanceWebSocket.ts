import { ref, onUnmounted, watch } from 'vue';
import { BINANCE_WS_BASE_URL } from '~/constants/api';

type MessageCallback = (data: any) => void;

export function useBinanceWebSocket(symbols: Ref<string[]>, onMessage: MessageCallback) {
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref<boolean>(false);
  let connectionAttempt: NodeJS.Timeout | null = null;

  const connect = () => {
    // Спочатку відключаємо старе з'єднання
    if (ws.value) {
      ws.value.close();
    }
    
    // Якщо немає обраних символів, не підключаємось
    if (!symbols.value || symbols.value.length === 0) {
      isConnected.value = false;
      return;
    }

    // ВАЖЛИВО: Binance вимагає символи в нижньому регістрі для потоків
    const streams = symbols.value.map(s => `${s.toLowerCase()}@ticker`).join('/');
    const url = `${BINANCE_WS_BASE_URL}/${streams}`;

    ws.value = new WebSocket(url);

    ws.value.onopen = () => {
      console.log('WebSocket connected to:', url);
      isConnected.value = true;
    };

    ws.value.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // Переконуємося, що це дані тікера, а не статус підписки
      if (message.e === '24hrTicker') {
        onMessage(message);
      }
    };

    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error);
      isConnected.value = false;
    };

    ws.value.onclose = () => {
      console.log('WebSocket disconnected.');
      isConnected.value = false;
      ws.value = null;
    };
  };

  // Слідкуємо за зміною символів і перепідключаємось з невеликою затримкою,
  // щоб уникнути частих перепідключень при швидкому виборі
  watch(symbols, () => {
    if (connectionAttempt) clearTimeout(connectionAttempt);
    connectionAttempt = setTimeout(connect, 300); // Затримка 300мс
  }, { deep: true, immediate: true });

  onUnmounted(() => {
    if (connectionAttempt) clearTimeout(connectionAttempt);
    if (ws.value) {
      ws.value.close();
    }
  });

  return { isConnected };
}