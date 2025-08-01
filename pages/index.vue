<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTradingStore } from '../stores/tradingStore';
import { useBinanceWebSocket } from '../composables/useBinanceWebSocket';
import TradingPairSelector from '../components/TradingPairSelector.vue';
import SelectedPairCard from '../components/selected/SelectedPairCard.vue';

const CandlestickChart = defineAsyncComponent(() => import('../components/chart/CandlestickChart.vue'));

const store = useTradingStore();
const {
  allPairs,
  selectedSymbols,
  isLoading,
  selectedPairs,
  getPairRealtimeData,
  activeChartSymbol
} = storeToRefs(store);

onMounted(() => {
  store.loadFromLocalStorage();
  if (!allPairs.value.length) {
    store.fetchAllPairs();
  }
});

// Підключення до WebSocket
const { isConnected } = useBinanceWebSocket(selectedSymbols, (data) => {
  store.updateTickerData(data);
});

function handleModelUpdate(newSymbols: string[]) {
  store.updateSelectedSymbols(newSymbols);
}

function handleCardClick(symbol: string) {
    // Тут буде логіка для відображення графіка
    // Наприклад: store.setActiveChart(symbol);
    alert(`Графік для ${symbol} ще не реалізовано.`);
}

</script>

<template>
  <div class="main-page">
    <div class="main-page__selector-container">
      <TradingPairSelector 
        :all-pairs="allPairs" 
        :model-value="selectedSymbols"
        @update:model-value="handleModelUpdate"
      />
      <div v-if="isLoading" class="main-page__loader">
        Завантаження списку пар...
      </div>
      <div class="main-page__ws-status">
        Статус WebSocket: 
        <span :class="isConnected ? 'text-green-500' : 'text-red-500'">
          {{ isConnected ? 'Підключено' : 'Відключено' }}
        </span>
      </div>
    </div>

    <div v-if="selectedPairs.length" class="main-page__grid">
      <SelectedPairCard
        v-for="pair in selectedPairs"
        :key="pair.id"
        :pair="pair"
        :data="getPairRealtimeData(pair.id)"
        @click="handleCardClick(pair.id)"
      />
    </div>
    <div v-else class="main-page__placeholder">
      Обрані пари будуть відображені тут.
    </div>

    <div v-if="activeChartSymbol" class="main-page__chart-container">
      <CandlestickChart :symbol="activeChartSymbol" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-page {
  @apply container mx-auto;

  &__selector-container {
    @apply mb-8;
  }
  
  &__loader {
    @apply text-center text-gray-400 mt-4;
  }
  
  &__ws-status {
    @apply text-center text-sm text-gray-500 mt-2;
  }

  &__grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
  }

  &__placeholder {
    @apply text-center text-gray-500 py-16;
  }

  &__chart-container {
    @apply mt-8;
  }
}
</style>