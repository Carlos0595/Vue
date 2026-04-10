<template>
  <div class="custom-card">
    <!-- Header slot -->
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>

    <!-- Default slot (main content) -->
    <div class="card-content">
      <slot />
    </div>

    <!-- Footer slot -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
// Componente contenedor con slots
</script>

<style scoped>
.custom-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.custom-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.5rem 1.5rem 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-content {
  padding: 1.5rem;
  flex: 1;
}

.card-footer {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}
</style>