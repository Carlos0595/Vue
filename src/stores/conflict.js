import { defineStore } from "pinia";
import { ref } from "vue";
import { normalizeConflictCountries } from "../utils/countries";

export const useConflictStore = defineStore("conflicts", () => {
    const API_URL = "http://localhost:8080/api/v1/conflicts";
    const COUNTRIES_API_URL = "http://localhost:8080/api/v1/countries";

    const conflicts = ref([]);
    const countries = ref([]);
    const loading = ref(false);
    const error = ref("");
    const currentConflict = ref(null);

    const normalizeConflict = (conflict) => ({
        ...conflict,
        countries: normalizeConflictCountries(conflict.countries)
    });

    const getConflicts = async (status = null) => {
        loading.value = true;
        try {
            const url = status ? `${API_URL}?status=${status}` : API_URL;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("No se pudieron cargar los conflictos");
            }

            const data = await response.json();
            conflicts.value = data.map(normalizeConflict);
            error.value = "";
        } catch (e) {
            error.value = e.message || "Error cargando conflictos";
            console.log("error cargando conflictos", e);
        } finally {
            loading.value = false;
        }
    };

    const getConflictById = async (id) => {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) {
                throw new Error("No se pudo cargar el conflicto");
            }

            const data = await response.json();
            currentConflict.value = normalizeConflict(data);
            error.value = "";
        } catch (e) {
            currentConflict.value = null;
            error.value = e.message || "Error cargando el conflicto";
            console.log("error cargando conflicto", e);
        } finally {
            loading.value = false;
        }
    };

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
            if (!response.ok) {
                throw new Error(data.message || 'Error creando el conflicto');
            }

            await getConflicts();
            error.value = "";
            return data;
        } catch (e) {
            error.value = e.message || "Error creando el conflicto";
            console.log("error creando conflicto", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

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
            if (!response.ok) {
                throw new Error(data.message || 'Error actualizando el conflicto');
            }

            await getConflicts();
            error.value = "";
            return data;
        } catch (e) {
            error.value = e.message || "Error actualizando el conflicto";
            console.log("error actualizando conflicto", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const deleteConflict = async (id) => {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error eliminando el conflicto');
            }

            await getConflicts();
            error.value = "";
            return true;
        } catch (e) {
            error.value = e.message || "Error eliminando el conflicto";
            console.log("error eliminando conflicto", e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const getCountries = async () => {
        try {
            const response = await fetch(COUNTRIES_API_URL);
            if (!response.ok) {
                throw new Error("No se pudieron cargar los paises");
            }

            const data = await response.json();
            countries.value = data;
            error.value = "";
        } catch (e) {
            error.value = e.message || "Error cargando paises";
            console.log("error cargando paises", e);
        }
    };

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
        getCountries
    };
});
