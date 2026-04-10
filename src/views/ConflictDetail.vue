<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderComponent from '../components/HeaderComponent.vue';
import CountryFlag from '../components/CountryFlag.vue';
import { useConflictStore } from '../stores/conflict';
import { formatDate, getStatusClass, getStatusLabel } from '../utils/conflictFormatting';

const route = useRoute();
const router = useRouter();
const conflictStore = useConflictStore();
const conflictId = route.params.id;

onMounted(async () => {
  if (conflictId) {
    await conflictStore.getConflictById(conflictId);
  }
});

const handleEdit = () => {
  router.push(`/conflicts/${conflictId}/edit`);
};

const handleDelete = async () => {
  if (!window.confirm('Seguro que quieres eliminar este conflicto?')) {
    return;
  }

  try {
    await conflictStore.deleteConflict(conflictId);
    router.push('/conflicts');
  } catch (error) {
    alert(error.message || 'No se pudo eliminar el conflicto');
  }
};

const handleBack = () => {
  router.push('/conflicts');
};
</script>

<template>
  <HeaderComponent />

  <section id="conflict-detail-page">
    <div class="page-header">
      <button @click="handleBack" class="btn-back">Volver al listado</button>
      <h2>Detalle del conflicto</h2>
    </div>

    <div v-if="conflictStore.loading" class="state-card">
      <h3>Cargando conflicto...</h3>
    </div>

    <div v-else-if="conflictStore.error" class="state-card">
      <h3>No se pudo cargar el conflicto</h3>
      <p>{{ conflictStore.error }}</p>
      <button @click="conflictStore.getConflictById(conflictId)" class="btn-retry">
        Reintentar
      </button>
    </div>

    <div v-else-if="!conflictStore.currentConflict" class="state-card">
      <h3>Conflicto no encontrado</h3>
      <p>El conflicto con ID {{ conflictId }} no existe o no esta disponible.</p>
    </div>

    <article v-else class="conflict-detail">
      <div class="detail-header">
        <div>
          <h1>{{ conflictStore.currentConflict.name }}</h1>
          <span :class="['status-badge', getStatusClass(conflictStore.currentConflict.status)]">
            {{ getStatusLabel(conflictStore.currentConflict.status) }}
          </span>
        </div>

        <div class="conflict-actions">
          <button @click="handleEdit" class="btn-edit">Editar</button>
          <button @click="handleDelete" class="btn-delete">Eliminar</button>
        </div>
      </div>

      <div class="detail-grid">
        <section class="panel">
          <h3>Informacion general</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">ID</span>
              <span class="value">#{{ conflictStore.currentConflict.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">Fecha de inicio</span>
              <span class="value">{{ formatDate(conflictStore.currentConflict.startDate) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Fecha de fin</span>
              <span class="value">{{ formatDate(conflictStore.currentConflict.endDate) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Ubicacion</span>
              <span class="value">{{ conflictStore.currentConflict.location }}</span>
            </div>
          </div>
        </section>

        <section class="panel">
          <h3>Paises implicados</h3>
          <div class="countries-grid">
            <div
              v-for="country in conflictStore.currentConflict.countries"
              :key="`${conflictStore.currentConflict.id}-${country.name}`"
              class="country-card"
            >
              <CountryFlag :code="country.code" :name="country.name" />
              <div>
                <h4>{{ country.name }}</h4>
                <span>{{ country.code || 'Sin codigo ISO' }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section class="panel">
        <h3>Descripcion</h3>
        <p class="description">{{ conflictStore.currentConflict.description }}</p>
      </section>
    </article>
  </section>
</template>

<style scoped>
#conflict-detail-page {
  padding: 2rem 1rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header,
.detail-header,
.conflict-actions,
.countries-grid,
.detail-grid {
  display: flex;
}

.page-header,
.detail-header {
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.detail-header {
  margin-bottom: 1.5rem;
}

.detail-grid {
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-grid > * {
  flex: 1;
}

.panel,
.state-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.conflict-detail h1,
.panel h3,
.state-card h3 {
  margin: 0;
}

.btn-back,
.btn-edit,
.btn-delete,
.btn-retry {
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.1rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-back,
.btn-edit {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-delete,
.btn-retry {
  background: #0f172a;
  color: white;
}

.conflict-actions {
  gap: 0.75rem;
}

.status-badge {
  display: inline-flex;
  margin-top: 0.8rem;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
}

.status-badge.active { background: #dcfce7; color: #166534; }
.status-badge.inactive { background: #e2e8f0; color: #334155; }
.status-badge.frozen { background: #dbeafe; color: #1d4ed8; }
.status-badge.resolved { background: #ede9fe; color: #6d28d9; }

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.value,
.description,
.country-card span,
.state-card p {
  color: #475569;
}

.countries-grid {
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.country-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
}

.country-card h4 {
  margin: 0 0 0.2rem;
  color: #0f172a;
}

.description {
  margin: 1rem 0 0;
  line-height: 1.7;
}

.state-card p {
  margin: 0.75rem 0 0;
}

.btn-retry {
  margin-top: 1rem;
}

@media (max-width: 760px) {
  .page-header,
  .detail-header,
  .detail-grid {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
