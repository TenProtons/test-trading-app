<script setup lang="ts">
import { computed } from 'vue';
import type { TradingPair, TickerData } from '~/types/trading';

const props = defineProps<{
  pair: TradingPair;
  data?: TickerData;
}>();

const placeholderIcon = computed(() => `https://via.placeholder.com/32/A0AEC0/FFFFFF?text=${props.pair.baseAsset.charAt(0)}`);
const handleError = (event: Event) => {
  (event.target as HTMLImageElement).src = placeholderIcon.value;
};

const priceChangeColor = computed(() => {
  if (!props.data || props.data.priceChangePercent === 0) return 'text-gray-500 dark:text-gray-400';
  return props.data.priceChangePercent > 0 ? 'text-green-500' : 'text-red-500';
});

const priceUpDownColor = computed(() => {
  if (!props.data) return 'text-gray-900 dark:text-gray-100';
  if (props.data.price > props.data.lastPrice) return 'text-green-500';
  if (props.data.price < props.data.lastPrice) return 'text-red-500';
  return 'text-gray-900 dark:text-gray-100';
});

const formattedPrice = computed(() => props.data ? props.data.price.toFixed(4) : '...');
const formattedChange = computed(() => props.data ? `${props.data.priceChangePercent.toFixed(2)}%` : '...');
</script>

<template>
  <div class="card bg-white dark:bg-gray-800 border-gray-200 dark:border-transparent">
    <div class="card__header">

      <div
        class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 inline-flex items-center justify-center bg-gray-300 dark:bg-gray-700">
        <img :src="pair.iconUrl || placeholderIcon" :alt="pair.baseAsset" class="w-full h-full object-cover"
          @error="handleError" loading="lazy" />
      </div>

      <span class="card__name text-gray-900 dark:text-white">{{ pair.name }}</span>
    </div>
    <div class="card__body">
      <span class="card__price" :class="priceUpDownColor">{{ formattedPrice }}</span>
      <span class="card__change" :class="priceChangeColor">{{ formattedChange }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  @apply p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:border-blue-500 border cursor-pointer;

  &__header {
    @apply flex items-center mb-3;
  }

  &__name {
    @apply ml-3 font-bold text-lg;
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