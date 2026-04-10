<script setup>
import { computed } from 'vue';
import CardContainer from './CardContainer.vue';
import CountryFlag from './CountryFlag.vue';
import { formatDate, getStatusClass, getStatusLabel } from '../utils/conflictFormatting';

const props = defineProps({
  conflict: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['view-detail', 'delete-conflict']);

const visibleCountries = computed(() => (props.conflict.countries || []).slice(0, 3));
const logoCountries = computed(() =>
  (props.conflict.countries || []).filter((country) => country?.code).slice(0, 2)
);

const extraCountries = computed(() => {
  const totalCountries = props.conflict.countries?.length || 0;
  return totalCountries > 3 ? totalCountries - 3 : 0;
});

const extraLogoCountries = computed(() => {
  const totalCountries = props.conflict.countries?.length || 0;
  return totalCountries > 2 ? totalCountries - 2 : 0;
});

const initials = computed(() =>
  props.conflict.name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
);
</script>

<template>
  <CardContainer>
    <template #header>
      <div class="card-header">
        <div class="avatar" :class="getStatusClass(props.conflict.status)">
          <div v-if="logoCountries.length" class="avatar-flags">
            <CountryFlag
              v-for="country in logoCountries"
              :key="`logo-${props.conflict.id}-${country.name}`"
              :code="country.code"
              :name="country.name"
              class="avatar-flag"
            />
            <span v-if="extraLogoCountries" class="avatar-more">+{{ extraLogoCountries }}</span>
          </div>
          <span v-else>{{ initials }}</span>
        </div>
        <div class="header-info">
          <h3>{{ props.conflict.name }}</h3>
          <span class="id-badge">ID #{{ props.conflict.id }}</span>
        </div>
      </div>
    </template>

    <div class="card-body">
      <div class="info-item">
        <span class="label">Ubicacion</span>
        <span class="value">{{ props.conflict.location }}</span>
      </div>

      <div class="info-row">
        <div class="info-item">
          <span class="label">Inicio</span>
          <span class="value">{{ formatDate(props.conflict.startDate) }}</span>
        </div>
        <div class="info-item">
          <span class="label">Fin</span>
          <span class="value">{{ formatDate(props.conflict.endDate) }}</span>
        </div>
      </div>

      <div class="info-item">
        <span class="label">Estado</span>
        <span :class="['status-tag', getStatusClass(props.conflict.status)]">
          {{ getStatusLabel(props.conflict.status) }}
        </span>
      </div>

      <div v-if="props.conflict.countries?.length" class="info-item">
        <span class="label">Paises implicados</span>
        <div class="countries">
          <span
            v-for="country in visibleCountries"
            :key="`${props.conflict.id}-${country.name}`"
            class="country-tag"
          >
            <CountryFlag :code="country.code" :name="country.name" />
            {{ country.name }}
          </span>
          <span v-if="extraCountries" class="country-tag country-tag--extra">
            +{{ extraCountries }}
          </span>
        </div>
      </div>

      <div class="info-item">
        <span class="label">Descripcion</span>
        <p class="description">{{ props.conflict.description }}</p>
      </div>
    </div>

    <template #footer>
      <div class="card-actions">
        <button @click="emit('view-detail', props.conflict.id)" class="btn-detail">
          Ver detalle
        </button>
        <button @click="emit('delete-conflict', props.conflict.id)" class="btn-delete">
          Eliminar
        </button>
      </div>
    </template>
  </CardContainer>
</template>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 62px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
  padding: 0 0.45rem;
}

.avatar.active { background: #166534; }
.avatar.inactive { background: #475569; }
.avatar.frozen { background: #2563eb; }
.avatar.resolved { background: #7c3aed; }
.avatar.unknown { background: #64748b; }

.avatar-flags {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.avatar-flag {
  width: 1.45rem;
  height: 0.95rem;
}

.avatar-more {
  font-size: 0.64rem;
  font-weight: 800;
  line-height: 1;
}

.header-info {
  min-width: 0;
}

.header-info h3 {
  margin: 0;
  color: #0f172a;
}

.id-badge {
  display: inline-flex;
  margin-top: 0.4rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 700;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.label {
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.value,
.description {
  color: #475569;
}

.status-tag {
  font-weight: 700;
}

.status-tag.active { color: #166534; }
.status-tag.inactive { color: #475569; }
.status-tag.frozen { color: #2563eb; }
.status-tag.resolved { color: #7c3aed; }

.countries {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.country-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-size: 0.82rem;
  font-weight: 600;
}

.country-tag--extra {
  justify-content: center;
  min-width: 52px;
}

.description {
  margin: 0;
  line-height: 1.6;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-detail,
.btn-delete {
  flex: 1;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-detail {
  background: #0f172a;
  color: white;
}

.btn-delete {
  background: #fee2e2;
  color: #b91c1c;
}

@media (max-width: 460px) {
  .info-row,
  .card-actions {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}
</style>
