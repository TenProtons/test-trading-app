<script setup lang="ts">
import { computed } from 'vue';
import type { TickerData, TradingPair } from '../../types/trading';

const props = defineProps<{
  pair: TradingPair;
  data?: TickerData;
}>();

const priceChangeColor = computed(() => {
  if (!props.data) return 'text-gray-400';
  if (props.data.priceChangePercent > 0) return 'text-green-500';
  if (props.data.priceChangePercent < 0) return 'text-red-500';
  return 'text-gray-400';
});

const priceUpDownColor = computed(() => {
  if (!props.data) return 'text-gray-400';
  if (props.data.price > props.data.lastPrice) return 'text-green-500';
  if (props.data.price < props.data.lastPrice) return 'text-red-500';
  return 'text-gray-400';
});

const formattedPrice = computed(() => {
  return props.data ? props.data.price.toFixed(4) : '...';
});

const formattedChange = computed(() => {
  return props.data ? `${props.data.priceChangePercent.toFixed(2)}%` : '...';
});
</script>

<template>
  <div class="card">
    <div class="card__header">
      <IconWrapper :src="pair.iconUrl" :alt="pair.baseAsset" />
      <span class="card__name">{{ pair.name }}</span>
    </div>
    <div class="card__body">
      <span class="card__price" :class="priceUpDownColor">{{ formattedPrice }}</span>
      <span class="card__change" :class="priceChangeColor">{{ formattedChange }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  @apply bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:border-blue-500 border border-transparent cursor-pointer;

  &__header {
    @apply flex items-center mb-3;
  }
  
  &__name {
    @apply ml-3 font-bold text-lg text-white;
  }
  
  &__body {
    @apply flex justify-between items-baseline;
  }
  
  &__price {
    @apply text-2xl font-semibold transition-colors duration-200;
  }
  
  &__change {
    @apply text-base font-medium transition-colors duration-200;
  }
}
</style>