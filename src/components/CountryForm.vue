<script setup>
import { ref } from 'vue';
import { useConflictStore } from '../stores/conflict';

const conflictStore = useConflictStore();
const showForm = ref(false);
const formData = ref({
    name: '',
    code: ''
});
const errors = ref({});
const isSubmitting = ref(false);

const validateForm = () => {
    errors.value = {};
    if (!formData.value.name.trim()) {
        errors.value.name = 'El nom és obligatori';
    }
    if (!formData.value.code.trim()) {
        errors.value.code = 'El codi és obligatori';
    } else if (formData.value.code.length !== 2) {
        errors.value.code = 'El codi ha de tenir 2 lletres (ex: ES, FR, UA)';
    }
    return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
    if (!validateForm()) return;
    
    isSubmitting.value = true;
    try {
        await conflictStore.createCountry({
            name: formData.value.name,
            code: formData.value.code.toUpperCase()
        });
        alert('País creat correctament');
        formData.value = { name: '', code: '' };
        showForm.value = false;
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div class="country-creator">
        <button type="button" @click="showForm = !showForm" class="btn-add-country">
            {{ showForm ? 'Cancel·lar' : '+ Afegir País' }}
        </button>

        <div v-if="showForm" class="country-form-popup">
            <h4>Crear Nou País</h4>
            <div class="form-group">
                <label>Nom del país *</label>
                <input 
                    v-model="formData.name" 
                    type="text" 
                    placeholder="Ex: Espanya, França, Alemanya"
                />
                <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>
            <div class="form-group">
                <label>Codi (2 lletres) *</label>
                <input 
                    v-model="formData.code" 
                    type="text" 
                    placeholder="Ex: ES, FR, DE" 
                    maxlength="2"
                    style="text-transform: uppercase"
                />
                <span v-if="errors.code" class="error-message">{{ errors.code }}</span>
            </div>
            <button 
                type="button" 
                @click="handleSubmit" 
                :disabled="isSubmitting" 
                class="btn-save"
            >
                {{ isSubmitting ? 'Guardant...' : 'Crear País' }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.country-creator {
    margin-bottom: 1.5rem;
}

.btn-add-country {
    background: #4f46e5;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
}

.btn-add-country:hover {
    background: #4338ca;
}

.country-form-popup {
    margin-top: 1rem;
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
}

.country-form-popup h4 {
    margin: 0 0 1rem 0;
    color: #1f2937;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
}

.form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
}

.form-group input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.error-message {
    display: block;
    margin-top: 0.25rem;
    color: #dc2626;
    font-size: 0.75rem;
}

.btn-save {
    background: #059669;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
}

.btn-save:hover:not(:disabled) {
    background: #047857;
}

.btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>