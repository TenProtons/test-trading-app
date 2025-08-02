<script setup lang="ts">
import { computed } from 'vue';
import type { TradingPair, TickerData } from '~/types/trading';

const props = defineProps<{
  pair: TradingPair;
  data?: TickerData;
}>();

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

const hasImageError = ref(false);
const showPlaceholder = computed(() => !props.pair.iconUrl || hasImageError.value);
const formattedPrice = computed(() => props.data ? props.data.price.toFixed(8) : '...');
const formattedChange = computed(() => props.data ? `${props.data.priceChangePercent.toFixed(2)}%` : '...');
</script>

<template>
  <div class="card bg-white dark:bg-gray-800 border-gray-200 dark:border-transparent">
    <div class="card__header">

      <img v-if="!showPlaceholder" :src="pair.iconUrl" :alt="pair.baseAsset" class="card__icon-image"
        @error="hasImageError = true" loading="lazy" />

      <div v-else class="card__icon-placeholder">
        {{ pair.baseAsset ? pair.baseAsset.charAt(0).toUpperCase() : '?' }}
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

  &__icon-image,
  &__icon-placeholder {
    @apply w-8 h-8 rounded-full flex-shrink-0;
  }

  &__icon-image {
    @apply object-cover;
  }

  &__icon-placeholder {
    @apply inline-flex items-center justify-center;
    @apply bg-gray-300 dark:bg-gray-700;
    @apply text-gray-800 dark:text-gray-200 font-bold;
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