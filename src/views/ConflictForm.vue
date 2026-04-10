<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderComponent from '../components/HeaderComponent.vue';
import CountryFlag from '../components/CountryFlag.vue';
import { useConflictStore } from '../stores/conflict';
import { getCountryCode, normalizeConflictCountries } from '../utils/countries';

const route = useRoute();
const router = useRouter();
const conflictStore = useConflictStore();

const conflictId = route.params.id;
const isEditing = computed(() => Boolean(conflictId));
const isSubmitting = ref(false);

const formData = ref({
  name: '',
  startDate: '',
  endDate: '',
  status: 'ACTIVE',
  description: '',
  location: '',
  countriesText: ''
});

const errors = ref({});

const statusOptions = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' },
  { value: 'FROZEN', label: 'Congelado' },
  { value: 'RESOLVED', label: 'Resuelto' }
];

onMounted(async () => {
  await conflictStore.getCountries();

  if (!isEditing.value) {
    return;
  }

  await conflictStore.getConflictById(conflictId);
  const conflict = conflictStore.currentConflict;

  if (!conflict) {
    return;
  }

  formData.value = {
    name: conflict.name || '',
    startDate: conflict.startDate ? conflict.startDate.split('T')[0] : '',
    endDate: conflict.endDate ? conflict.endDate.split('T')[0] : '',
    status: conflict.status || 'ACTIVE',
    description: conflict.description || '',
    location: conflict.location || '',
    countriesText: (conflict.countries || []).map((country) => country.name).join(', ')
  };
});

const parsedCountries = computed(() =>
  normalizeConflictCountries(
    formData.value.countriesText
      .split(',')
      .map((country) => country.trim())
      .filter(Boolean),
    conflictStore.countries
  )
);

const validateForm = () => {
  const nextErrors = {};

  if (!formData.value.name.trim()) {
    nextErrors.name = 'El nombre es obligatorio.';
  } else if (formData.value.name.trim().length < 3) {
    nextErrors.name = 'El nombre debe tener al menos 3 caracteres.';
  }

  if (!formData.value.startDate) {
    nextErrors.startDate = 'La fecha de inicio es obligatoria.';
  }

  if (formData.value.endDate && formData.value.endDate < formData.value.startDate) {
    nextErrors.endDate = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
  }

  if (!formData.value.location.trim()) {
    nextErrors.location = 'La ubicacion es obligatoria.';
  }

  if (!formData.value.description.trim()) {
    nextErrors.description = 'La descripcion es obligatoria.';
  }

  if (!parsedCountries.value.length) {
    nextErrors.countriesText = 'Introduce al menos un pais.';
  } else if (parsedCountries.value.some((country) => !country.code)) {
    nextErrors.countriesText = 'Revisa los paises. Todos deben tener un codigo ISO reconocible.';
  }

  errors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  const conflictData = {
    name: formData.value.name.trim(),
    startDate: `${formData.value.startDate}T00:00:00`,
    endDate: formData.value.endDate ? `${formData.value.endDate}T00:00:00` : null,
    status: formData.value.status,
    description: formData.value.description.trim(),
    location: formData.value.location.trim(),
    countries: parsedCountries.value.map((country) => ({
      name: country.name,
      code: getCountryCode(country, conflictStore.countries)
    }))
  };

  try {
    if (isEditing.value) {
      await conflictStore.updateConflict(conflictId, conflictData);
      alert('Conflicto actualizado correctamente');
    } else {
      await conflictStore.createConflict(conflictData);
      alert('Conflicto creado correctamente');
    }

    router.push('/conflicts');
  } catch (error) {
    alert(error.message || 'No se pudo guardar el conflicto');
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/conflicts');
};
</script>

<template>
  <HeaderComponent />

  <section id="conflict-form-page">
    <div class="page-header">
      <p class="eyebrow">{{ isEditing ? 'Edicion' : 'Alta' }}</p>
      <h2>{{ isEditing ? 'Editar conflicto' : 'Crear conflicto' }}</h2>
    </div>

    <form class="conflict-form" @submit.prevent="handleSubmit">
      <div class="form-grid">
        <div class="form-group form-group--full">
          <label for="name">Nombre del conflicto</label>
          <input id="name" v-model="formData.name" type="text" :class="{ error: errors.name }" />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label for="startDate">Fecha de inicio</label>
          <input id="startDate" v-model="formData.startDate" type="date" :class="{ error: errors.startDate }" />
          <span v-if="errors.startDate" class="error-message">{{ errors.startDate }}</span>
        </div>

        <div class="form-group">
          <label for="endDate">Fecha de fin</label>
          <input id="endDate" v-model="formData.endDate" type="date" :class="{ error: errors.endDate }" />
          <span v-if="errors.endDate" class="error-message">{{ errors.endDate }}</span>
        </div>

        <div class="form-group">
          <label for="status">Estado</label>
          <select id="status" v-model="formData.status">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="location">Ubicacion</label>
          <input id="location" v-model="formData.location" type="text" :class="{ error: errors.location }" />
          <span v-if="errors.location" class="error-message">{{ errors.location }}</span>
        </div>

        <div class="form-group form-group--full">
          <label for="description">Descripcion</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="5"
            :class="{ error: errors.description }"
          ></textarea>
          <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
        </div>

        <div class="form-group form-group--full">
          <label for="countriesText">Paises implicados</label>
          <input
            id="countriesText"
            v-model="formData.countriesText"
            type="text"
            list="country-suggestions"
            placeholder="Ejemplo: Ucrania, Rusia, Israel"
            :class="{ error: errors.countriesText }"
          />
          <datalist id="country-suggestions">
            <option
              v-for="country in conflictStore.countries"
              :key="country.id || country.code || country.name"
              :value="country.name || country.countryName"
            ></option>
          </datalist>
          <span class="help-text">
            Separa los paises con comas. Intentare resolver su codigo ISO para mostrar la bandera correcta.
          </span>
          <span v-if="errors.countriesText" class="error-message">{{ errors.countriesText }}</span>
        </div>
      </div>

      <div v-if="parsedCountries.length" class="preview-panel">
        <h3>Vista previa de paises</h3>
        <div class="preview-list">
          <span v-for="country in parsedCountries" :key="country.name" class="preview-item">
            <CountryFlag :code="country.code" :name="country.name" />
            {{ country.name }}
            <strong>{{ country.code || 'sin codigo' }}</strong>
          </span>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" :disabled="isSubmitting" @click="handleCancel">
          Cancelar
        </button>
        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear' }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
#conflict-form-page {
  max-width: 920px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #64748b;
}

.page-header h2,
.preview-panel h3 {
  margin: 0;
  color: #0f172a;
}

.conflict-form,
.preview-panel {
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.conflict-form {
  padding: 1.75rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.form-group--full {
  grid-column: 1 / -1;
}

label {
  font-weight: 700;
  color: #0f172a;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 0.85rem 1rem;
  background: white;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.error {
  border-color: #dc2626;
}

.help-text,
.error-message {
  font-size: 0.88rem;
}

.help-text {
  color: #64748b;
}

.error-message {
  color: #dc2626;
}

.preview-panel {
  margin-top: 1.25rem;
  padding: 1.25rem;
}

.preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.preview-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
}

.preview-item strong {
  font-size: 0.78rem;
  text-transform: uppercase;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-cancel,
.btn-submit {
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1.25rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-cancel {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-submit {
  background: #0f172a;
  color: white;
}

.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

@media (max-width: 720px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
