<script setup>
import { onMounted, ref } from 'vue';
import HeaderComponent from '../components/HeaderComponent.vue';
import { useConflictStore } from '../stores/conflict';

const conflictStore = useConflictStore();
const stats = ref({
  active: 0,
  frozen: 0,
  resolved: 0,
  totalCountries: 0
});

onMounted(async () => {
  // Cargar conflictos
  await conflictStore.getConflicts();
  
  // Calcular estadísticas reales
  const conflicts = conflictStore.conflicts;
  
  stats.value.active = conflicts.filter(c => c.status === 'ACTIVE').length;
  stats.value.frozen = conflicts.filter(c => c.status === 'FROZEN').length;
  stats.value.resolved = conflicts.filter(c => c.status === 'RESOLVED').length;
  
  // Cargar países y contar
  await conflictStore.getCountries();
  stats.value.totalCountries = conflictStore.countries.length;
});
</script>

<template>
    <HeaderComponent />
    <div class="home-content">
        <div class="hero-section">
            <h1>Benvigut al Monitor Global de Conflictes</h1>
            <p>Una eina per fer seguiment i monitoritzar conflictes globals en temps real.</p>
            <router-link to="/conflicts" class="btn-primary">
                Veure Conflictes
            </router-link>
        </div>

        <div class="features-section">
            <h3>Característiques Principals</h3>
            <div class="features-grid">
                <div class="feature-card">
                    <h4>📊 Monitorització en Temps Real</h4>
                    <p>Seguiment constant de l'estat dels conflictes globals.</p>
                </div>
                <div class="feature-card">
                    <h4>🌍 Cobertura Global</h4>
                    <p>Informació sobre conflictes a tot el món amb detalls per país.</p>
                </div>
                <div class="feature-card">
                    <h4>📅 Històric Complet</h4>
                    <p>Dates d'inici, evolució i possibles dates de finalització.</p>
                </div>
                <div class="feature-card">
                    <h4>🔍 Cercador Avançat</h4>
                    <p>Filtra per estat, país o paraules clau.</p>
                </div>
            </div>
        </div>

        <div class="stats-section">
            <h3>Estadístiques Ràpides</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">{{ stats.active }}</div>
                    <div class="stat-label">Conflictes Actius</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ stats.frozen }}</div>
                    <div class="stat-label">Conflictes Congelats</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ stats.totalCountries }}</div>
                    <div class="stat-label">Països Afectats</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{ stats.resolved }}</div>
                    <div class="stat-label">Conflictes Resolts</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.home-content {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
}

.hero-section {
    text-align: center;
    padding: 3rem 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    color: white;
    margin-bottom: 3rem;
}

.hero-section h1 {
    margin: 0 0 1rem 0;
    font-size: 2.5rem;
    font-weight: 700;
}

.hero-section p {
    margin: 0 0 2rem 0;
    font-size: 1.25rem;
    opacity: 0.9;
}

.btn-primary {
    display: inline-block;
    padding: 1rem 2rem;
    background: white;
    color: #667eea;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.2s;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.features-section, .stats-section {
    margin-bottom: 3rem;
}

.features-section h3, .stats-section h3 {
    text-align: center;
    margin-bottom: 2rem;
    color: #1f2937;
    font-size: 1.75rem;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.feature-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.feature-card h4 {
    margin: 0 0 1rem 0;
    color: #1f2937;
}

.feature-card p {
    margin: 0;
    color: #6b7280;
    line-height: 1.5;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #4f46e5;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: #6b7280;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
</style>