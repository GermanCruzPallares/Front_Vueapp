import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuthStore } from "./auth.store";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  brand?: string;
  size?: string;
  color?: string;
}

export const useProductStore = defineStore("product", () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const authStore = useAuthStore();
  const baseUrl = "http://localhost:8080/api/Products";

  async function fetchAll() {
    loading.value = true;
    try {
      const response = await fetch(baseUrl, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      if (response.ok) {
        products.value = await response.json();
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      loading.value = false;
    }
  }

  async function create(product: Omit<Product, "id">) {
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        await fetchAll();
        return true;
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
    return false;
  }

  async function update(id: number, product: Omit<Product, "id">) {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authStore.token}`,
        },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        await fetchAll();
        return true;
      }
    } catch (error) {
      console.error("Error updating product:", error);
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
      console.error("Error deleting product:", error);
    }
    return false;
  }

  return { products, loading, fetchAll, create, update, remove };
});
