import { defineStore } from "pinia";
import { ref } from "vue";

export const useConflictStore = defineStore("conflicts", () => {
    const API_BASE_URL = (
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"
    ).replace(/\/+$/, "");
    const API_URL = `${API_BASE_URL}/conflicts`;
    const COUNTRIES_API_URL = `${API_BASE_URL}/countries`;

    const conflicts = ref([]);
    const countries = ref([]);
    const loading = ref(false);
    const error = ref(false);
    const currentConflict = ref(null);

    const getConflicts = async (status = null) => {
        loading.value = true;
        try {
            const url = status ? `${API_URL}?status=${status}` : API_URL;
            const response = await fetch(url);
            const data = await response.json();
            conflicts.value = data;
            error.value = false;
        } catch (e) {
            error.value = true;
            console.log("error intentant carregar dades", e);
        } finally {
            loading.value = false;
        }
    }

    const getConflictById = async (id) => {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();
            currentConflict.value = data;
            error.value = false;
        } catch (e) {
            error.value = true;
            console.log("error carregant conflicte", e);
        } finally {
            loading.value = false;
        }
    }

    const createConflict = async (conflictData) => {
        loading.value = true;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(conflictData)
            });
            const data = await response.json();
            if (response.ok) {
                await getConflicts();
                return data;
            } else {
                throw new Error(data.message || 'Error creant conflicte');
            }
        } catch (e) {
            error.value = true;
            console.log("error creant conflicte", e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    const updateConflict = async (id, conflictData) => {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(conflictData)
            });
            const data = await response.json();
            if (response.ok) {
                await getConflicts();
                return data;
            } else {
                throw new Error(data.message || 'Error actualitzant conflicte');
            }
        } catch (e) {
            error.value = true;
            console.log("error actualitzant conflicte", e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    const deleteConflict = async (id) => {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await getConflicts();
                return true;
            } else {
                throw new Error('Error eliminant conflicte');
            }
        } catch (e) {
            error.value = true;
            console.log("error eliminant conflicte", e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    const getCountries = async () => {
        try {
            const response = await fetch(COUNTRIES_API_URL);
            const data = await response.json();
            countries.value = data;
            error.value = false;
        } catch (e) {
            error.value = true;
            console.log("error carregant països", e);
        }
    }

    // ✅ NUEVO: Crear país
    const createCountry = async (countryData) => {
        loading.value = true;
        try {
            const response = await fetch(COUNTRIES_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(countryData)
            });
            const data = await response.json();
            if (response.ok) {
                await getCountries(); // Recargar lista de países
                return data;
            } else {
                throw new Error(data.message || 'Error creant país');
            }
        } catch (e) {
            error.value = true;
            console.log("error creant país", e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    return {
        conflicts,
        countries,
        loading,
        error,
        currentConflict,
        getConflicts,
        getConflictById,
        createConflict,
        updateConflict,
        deleteConflict,
        getCountries,
        createCountry  // ✅ EXPORTAR EL NUEVO MÉTODO
    }
});
