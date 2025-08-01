<script setup lang="ts">
const props = defineProps<{
  src?: string;
  alt: string;
}>();

const placeholderIcon = `https://via.placeholder.com/32/A0AEC0/FFFFFF?text=${props.alt.charAt(0)}`;

const handleError = (event: Event) => {
  (event.target as HTMLImageElement).src = placeholderIcon;
};
</script>

<template>
  <div class="icon-container">
    <img
      :src="props.src || placeholderIcon"
      :alt="props.alt"
      class="icon-image"
      @error="handleError"
      loading="lazy"
    />
  </div>
</template>

<style lang="scss" scoped>
.icon-container {
  @apply w-8 h-8 rounded-full flex-shrink-0;
  
  @apply bg-gray-300 dark:bg-gray-700;

  @apply overflow-hidden;

  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-image {
  @apply w-full h-full;

  @apply object-cover;
}
</style>