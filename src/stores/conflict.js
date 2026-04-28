import { defineStore } from "pinia";
import { ref } from "vue";

export const useConflictStore = defineStore("conflicts", () => {
    const DEFAULT_API_BASE_URL = import.meta.env.PROD
        ? "/api/v1"
        : "http://localhost:8080/api/v1";

    const API_BASE_URL = (
        import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
    ).replace(/\/+$/, "");

    const API_URL = `${API_BASE_URL}/conflicts`;
    const COUNTRIES_API_URL = `${API_BASE_URL}/countries`;

    const conflicts = ref([]);
    const countries = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const currentConflict = ref(null);

    const getErrorMessage = async (response, fallback) => {
        try {
            const data = await response.json();
            return data?.message || fallback;
        } catch {
            return fallback;
        }
    };

    const getConflicts = async (status = null) => {
        loading.value = true;
        try {
            const url = status ? `${API_URL}?status=${status}` : API_URL;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(await getErrorMessage(response, "Error cargando conflictos"));
            }

            const data = await response.json();
            conflicts.value = Array.isArray(data) ? data : data?.content || data?.data || [];
            error.value = null;
        } catch (e) {
            error.value = e.message || "Error cargando conflictos";
            console.log("error cargando datos", e);
        } finally {
            loading.value = false;
        }
    };

    const getConflictById = async (id) => {
        loading.value = true;
        try {
            const response = await fetch(`${API_URL}/${id}`);

            if (!response.ok) {
                throw new Error(await getErrorMessage(response, "Error cargando conflicto"));
            }

            const data = await response.json();
            currentConflict.value = data;
            error.value = null;
        } catch (e) {
            error.value = e.message || "Error cargando conflicto";
            console.log("error cargando conflicto", e);
        } finally {
            loading.value = false;
        }
    };

    const createConflict = async (conflictData) => {
        loading.value = true;
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(conflictData)
            });

            if (!response.ok) {
                throw new Error(await getErrorMessage(response, "Error creando conflicto"));
            }

            const data = await response.json();
            await getConflicts();
            return data;
        } catch (e) {
            error.value = e.message || "Error creando conflicto";
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
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(conflictData)
            });

            if (!response.ok) {
                throw new Error(await getErrorMessage(response, "Error actualizando conflicto"));
            }

            const data = await response.json();
            await getConflicts();
            return data;
        } catch (e) {
            error.value = e.message || "Error actualizando conflicto";
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
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error(await getErrorMessage(response, "Error eliminando conflicto"));
            }

            await getConflicts();
            return true;
        } catch (e) {
            error.value = e.message || "Error eliminando conflicto";
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
                throw new Error(await getErrorMessage(response, "Error cargando paises"));
            }

            const data = await response.json();
            countries.value = Array.isArray(data) ? data : data?.content || data?.data || [];
            error.value = null;
        } catch (e) {
            error.value = e.message || "Error cargando paises";
            console.log("error cargando paises", e);
        }
    };

    const createCountry = async (countryData) => {
        loading.value = true;
        try {
            const response = await fetch(COUNTRIES_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(countryData)
            });

            if (!response.ok) {
                throw new Error(await getErrorMessage(response, "Error creando pais"));
            }

            const data = await response.json();
            await getCountries();
            return data;
        } catch (e) {
            error.value = e.message || "Error creando pais";
            console.log("error creando pais", e);
            throw e;
        } finally {
            loading.value = false;
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
        getCountries,
        createCountry
    };
});
