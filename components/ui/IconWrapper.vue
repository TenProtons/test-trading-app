<script setup lang="ts">
const props = defineProps<{
  src?: string;
  alt: string;
}>();

// Заглушка, якщо іконка не завантажилась
const placeholderIcon = `https://via.placeholder.com/32/4A5568/FFFFFF?text=${props.alt.charAt(0)}`;

const handleError = (event: Event) => {
  (event.target as HTMLImageElement).src = placeholderIcon;
};
</script>

<template>
  <div class="icon-wrapper bg-gray-200 dark:bg-gray-700">
    <img
      :src="props.src || placeholderIcon"
      :alt="props.alt"
      class="icon-wrapper__image"
      @error="handleError"
      loading="lazy"
    />
  </div>
</template>

<style lang="scss" scoped>
.icon-wrapper {
  @apply w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center;
  
  &__image {
    @apply w-full h-full object-cover rounded-full;
  }
}
</style>