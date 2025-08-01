<script setup lang="ts">
import { ref, computed } from 'vue';
import type { TradingPair } from '../types/trading';

const props = defineProps<{
  allPairs: TradingPair[];
  modelValue: string[]; // Масив обраних символів (ID)
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchQuery = ref('');

const filteredPairs = computed(() => {
  if (!searchQuery.value) {
    return props.allPairs;
  }
  return props.allPairs.filter(pair =>
    pair.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectedPairsSet = computed(() => new Set(props.modelValue));

function togglePair(symbol: string) {
  const newSelection = new Set(props.modelValue);
  if (newSelection.has(symbol)) {
    newSelection.delete(symbol);
  } else {
    newSelection.add(symbol);
  }
  emit('update:modelValue', Array.from(newSelection));
}

function removePair(symbol: string) {
  const newSelection = props.modelValue.filter(s => s !== symbol);
  emit('update:modelValue', newSelection);
}
</script>

<template>
  <div class="selector">
    <label class="selector__label">Виберіть торгові пари</label>
    <div class="selector__control" @click="isOpen = !isOpen">
      <div v-if="!modelValue.length" class="selector__placeholder">
        Натисніть щоб вибрати...
      </div>
      <div v-else class="selector__tags">
        <span v-for="symbol in modelValue" :key="symbol" class="selector__tag">
          {{ symbol }}
          <button @click.stop="removePair(symbol)" class="selector__tag-remove">×</button>
        </span>
      </div>
      <span class="selector__arrow" :class="{ 'selector__arrow--open': isOpen }">▼</span>
    </div>
    
    <div v-if="isOpen" class="selector__dropdown">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Пошук..." 
        class="selector__search"
      />
      <ul class="selector__list">
        <li 
          v-for="pair in filteredPairs" 
          :key="pair.id" 
          @click="togglePair(pair.id)"
          class="selector__item"
          :class="{'selector__item--selected': selectedPairsSet.has(pair.id)}"
        >
          <IconWrapper :src="pair.iconUrl" :alt="pair.baseAsset" />
          <span class="selector__item-name">{{ pair.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.selector {
  @apply relative w-full max-w-lg mx-auto;

  &__label {
    @apply block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1;
  }

  &__control {
    @apply bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-2 flex items-center justify-between cursor-pointer min-h-[42px];
  }
  
  &__placeholder {
    @apply text-gray-500 dark:text-gray-400;
  }

  &__tags {
    @apply flex flex-wrap gap-1;
  }

  &__tag {
    @apply bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1;
  }

  &__tag-remove {
    @apply text-white hover:text-red-300 font-bold;
  }
  
  &__arrow {
    @apply transition-transform duration-200 text-gray-500 dark:text-gray-400;
    &--open {
      @apply transform rotate-180;
    }
  }

  &__dropdown {
    @apply absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg;
  }

  &__search {
    @apply w-full p-2 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 outline-none;
  }

  &__list {
    @apply max-h-60 overflow-y-auto;
  }
  
  &__item {
    @apply flex items-center p-2 cursor-pointer text-gray-800 dark:text-gray-200;
    @apply hover:bg-gray-100 dark:hover:bg-gray-700;
    
    &--selected {
      @apply bg-blue-600 text-white;
      @apply dark:bg-blue-700;
    }
  }
  
  &__item-name {
    @apply ml-3;
  }
}
</style>