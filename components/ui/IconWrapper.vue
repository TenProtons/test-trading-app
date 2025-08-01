<script setup lang="ts">
const props = defineProps<{
  src?: string;
  alt: string;
}>();

// Заглушка, якщо іконка не завантажиться
const placeholderIcon = `https://via.placeholder.com/32/4A5568/FFFFFF?text=${props.alt.charAt(0)}`;

const handleError = (event: Event) => {
  // Якщо сталась помилка завантаження, підставляємо URL заглушки
  (event.target as HTMLImageElement).src = placeholderIcon;
};
</script>

<template>
  <div class="icon-wrapper">
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
  @apply w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-700;
  &__image {
    @apply w-full h-full object-cover;
  }
}
</style>