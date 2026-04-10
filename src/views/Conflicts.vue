<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import HeaderComponent from '../components/HeaderComponent.vue';
import { useConflictStore } from '../stores/conflict';
import ConflictCard from '../components/ConflictCard.vue';

const router = useRouter();
const conflictStore = useConflictStore();
const selectedStatus = ref('');

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'INACTIVE', label: 'Inactivos' },
  { value: 'FROZEN', label: 'Congelados' },
  { value: 'RESOLVED', label: 'Resueltos' }
];

onMounted(async () => {
  await conflictStore.getConflicts();
});

const filteredConflicts = computed(() => {
  if (!selectedStatus.value) return conflictStore.conflicts;
  return conflictStore.conflicts.filter((conflict) => conflict.status === selectedStatus.value);
});

const handleViewDetail = (conflictId) => {
  router.push(`/conflicts/${conflictId}`);
};

const handleDeleteConflict = async (conflictId) => {
  if (!window.confirm('Seguro que quieres eliminar este conflicto?')) {
    return;
  }

  try {
    await conflictStore.deleteConflict(conflictId);
    alert('Conflicto eliminado correctamente');
  } catch (error) {
    alert(error.message || 'No se pudo eliminar el conflicto');
  }
};
</script>

<template>
  <HeaderComponent />

  <section id="conflicts-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Listado principal</p>
        <h2>Conflictos</h2>
      </div>

      <div class="filters">
        <select v-model="selectedStatus" class="status-filter">
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>

        <router-link to="/conflicts/new" class="btn-create">
          Crear conflicto
        </router-link>
      </div>
    </div>

    <div v-if="conflictStore.loading" class="state-card">
      <h3>Cargando conflictos...</h3>
    </div>

    <div v-else-if="conflictStore.error" class="state-card">
      <h3>No se pudieron cargar los conflictos</h3>
      <p>{{ conflictStore.error }}</p>
      <button @click="conflictStore.getConflicts()" class="btn-retry">
        Reintentar
      </button>
    </div>

    <div v-else-if="filteredConflicts.length === 0" class="state-card">
      <h3>No hay resultados</h3>
      <p>No hay conflictos para el filtro seleccionado.</p>
    </div>

    <ul v-else class="conflict-list">
      <li v-for="conflict in filteredConflicts" :key="conflict.id">
        <ConflictCard
          :conflict="conflict"
          @view-detail="handleViewDetail"
          @delete-conflict="handleDeleteConflict"
        />
      </li>
    </ul>
  </section>
</template>

<style scoped>
#conflicts-page {
  padding: 2rem 1rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  margin-bottom: 2rem;
}

.eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #64748b;
}

.page-header h2 {
  margin: 0;
  font-size: 2rem;
  color: #0f172a;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.status-filter,
.btn-create,
.btn-retry {
  border-radius: 999px;
  padding: 0.75rem 1.1rem;
  font-weight: 600;
}

.status-filter {
  border: 1px solid #cbd5e1;
  background: white;
}

.btn-create,
.btn-retry {
  border: none;
  background: #0f172a;
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.conflict-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.5rem;
}

.state-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.state-card h3,
.state-card p {
  margin: 0;
}

.state-card p {
  margin-top: 0.75rem;
  color: #475569;
}

.btn-retry {
  margin-top: 1rem;
}

@media (max-width: 720px) {
  .page-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
