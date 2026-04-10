<script setup>
import { computed } from 'vue';

const props = defineProps({
  code: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
});

const flagClass = computed(() => {
  if (!props.code) return null;
  return `flag:${props.code.toUpperCase()}`;
});

const accessibleLabel = computed(() => props.title || props.name || props.code || 'Bandera');
</script>

<template>
  <span v-if="flagClass" :class="flagClass" class="country-flag" :title="accessibleLabel" :aria-label="accessibleLabel" />
  <span v-else class="country-flag country-flag--fallback" :title="accessibleLabel" :aria-label="accessibleLabel">
    ?
  </span>
</template>

<style scoped>
.country-flag {
  display: inline-block;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  flex-shrink: 0;
}

.country-flag--fallback {
  width: 1.5em;
  height: 1em;
  background: #e2e8f0;
  color: #475569;
  font-size: 0.85rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
