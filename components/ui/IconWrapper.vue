<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  src?: string;
  alt: string;
}>();

const hasError = ref(false);
const isLoaded = ref(false);

const handleError = () => {
  hasError.value = true;
};

const handleLoad = () => {
  isLoaded.value = true;
}

// Заглушка, якщо іконка не завантажилась
const placeholderIcon = computed(() => `https://via.placeholder.com/32/2D3748/FFFFFF?text=${props.alt.charAt(0)}`);
</script>

<template>
  <div class="icon-wrapper">
    <img 
      v-show="isLoaded && !hasError"
      :src="props.src" 
      :alt="props.alt" 
      class="icon-wrapper__image" 
      @error="handleError"
      @load="handleLoad"
    />
    <img 
      v-if="hasError || !props.src"
      :src="placeholderIcon" 
      :alt="props.alt" 
      class="icon-wrapper__image"
    />
  </div>
</template>

<style lang="scss" scoped>
.icon-wrapper {
  @apply w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-700;

  &__image {
    @apply w-full h-full object-cover;
  }
}
</style>