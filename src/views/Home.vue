<script setup>
import { computed, onMounted } from 'vue';
import HeaderComponent from '../components/HeaderComponent.vue';
import { useConflictStore } from '../stores/conflict';

const conflictStore = useConflictStore();

onMounted(async () => {
  if (!conflictStore.conflicts.length) {
    await conflictStore.getConflicts();
  }
});

const stats = computed(() => {
  const conflicts = conflictStore.conflicts;

  return {
    total: conflicts.length,
    active: conflicts.filter((conflict) => conflict.status === 'ACTIVE').length,
    frozen: conflicts.filter((conflict) => conflict.status === 'FROZEN').length,
    resolved: conflicts.filter((conflict) => conflict.status === 'RESOLVED').length,
    countries: new Set(
      conflicts.flatMap((conflict) => (conflict.countries || []).map((country) => country.name))
    ).size
  };
});

const features = [
  {
    title: 'Seguimiento en tiempo real',
    description: 'Consulta el estado actual de cada conflicto y entra a su ficha completa.'
  },
  {
    title: 'Banderas por pais',
    description: 'Cada conflicto muestra los paises implicados con banderas reales de una libreria.'
  },
  {
    title: 'Filtros rapidos',
    description: 'Filtra por estado para centrarte en los conflictos activos, congelados o resueltos.'
  },
  {
    title: 'Edicion sencilla',
    description: 'Crea, edita y elimina conflictos desde formularios mas claros y consistentes.'
  }
];
</script>

<template>
  <HeaderComponent />

  <div class="home-content">
    <section class="hero-section">
      <p class="eyebrow">Panel central</p>
      <h1>Monitor global de conflictos</h1>
      <p class="hero-copy">
        Una vista clara para seguir conflictos, revisar sus paises implicados y mantener la informacion organizada.
      </p>
      <div class="hero-actions">
        <router-link to="/conflicts" class="btn-primary">
          Ver conflictos
        </router-link>
        <router-link to="/conflicts/new" class="btn-secondary">
          Crear conflicto
        </router-link>
      </div>
    </section>

    <section class="stats-section">
      <article class="stat-card">
        <span class="stat-number">{{ stats.total }}</span>
        <span class="stat-label">Conflictos registrados</span>
      </article>
      <article class="stat-card">
        <span class="stat-number">{{ stats.active }}</span>
        <span class="stat-label">Activos</span>
      </article>
      <article class="stat-card">
        <span class="stat-number">{{ stats.frozen }}</span>
        <span class="stat-label">Congelados</span>
      </article>
      <article class="stat-card">
        <span class="stat-number">{{ stats.resolved }}</span>
        <span class="stat-label">Resueltos</span>
      </article>
      <article class="stat-card">
        <span class="stat-number">{{ stats.countries }}</span>
        <span class="stat-label">Paises implicados</span>
      </article>
    </section>

    <section class="features-section">
      <div class="section-heading">
        <h2>Que mejora en esta version</h2>
        <p>La portada ahora usa datos reales del store y resume mejor el estado actual del proyecto.</p>
      </div>

      <div class="features-grid">
        <article v-for="feature in features" :key="feature.title" class="feature-card">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-content {
  padding: 2rem 1rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  padding: 3rem;
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
  border-radius: 24px;
  color: white;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.18);
}

.eyebrow {
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.75rem;
  opacity: 0.75;
}

.hero-section h1 {
  margin: 0;
  font-size: clamp(2.25rem, 5vw, 4rem);
  line-height: 1.05;
}

.hero-copy {
  max-width: 650px;
  margin: 1rem 0 0;
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  padding: 0.9rem 1.4rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary {
  background: white;
  color: #0f172a;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.22);
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.stat-card,
.feature-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
}

.stat-label {
  display: block;
  margin-top: 0.35rem;
  color: #475569;
}

.features-section {
  margin-top: 3rem;
}

.section-heading h2 {
  margin: 0;
  font-size: 2rem;
  color: #0f172a;
}

.section-heading p {
  margin: 0.75rem 0 0;
  color: #475569;
  max-width: 720px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.feature-card h3 {
  margin: 0 0 0.75rem;
  color: #0f172a;
}

.feature-card p {
  margin: 0;
  line-height: 1.6;
  color: #475569;
}

@media (max-width: 640px) {
  .hero-section {
    padding: 2rem 1.25rem;
  }

  .hero-actions {
    flex-direction: column;
  }
}
</style>
