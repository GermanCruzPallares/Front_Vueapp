import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth.store";

export interface Category {
  id: number;
  name: string;
  description: string;
}

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const authStore = useAuthStore();
  const baseUrl = "http://localhost:8080/api/Categories";

  async function fetchAll() {
    loading.value = true;
    try {
      const response = await fetch(baseUrl, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      if (response.ok) {
        categories.value = await response.json();
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      loading.value = false;
    }
  }

  async function create(category: Omit<Category, "id">) {
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(category),
      });
      if (response.ok) {
        await fetchAll();
        return true;
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
    return false;
  }

  async function update(id: number, category: Omit<Category, "id">) {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(category),
      });
      if (response.ok) {
        await fetchAll();
        return true;
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
    return false;
  }

  async function remove(id: number) {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      if (response.ok) {
        await fetchAll();
        return true;
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    return false;
  }

  return { categories, loading, fetchAll, create, update, remove };
});
