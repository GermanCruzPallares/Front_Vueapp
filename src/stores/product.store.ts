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
  createdAt: string;
}

export const useProductStore = defineStore("product", () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const authStore = useAuthStore();
  const baseUrl = "http://localhost:8080/api/Products";

  const totalProducts = ref(0);

  async function fetchAll() {
    loading.value = true;
    try {
      const response = await fetch(`${baseUrl}/all`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      if (response.ok) {
        products.value = await response.json();
      }
    } catch (error) {
      console.error("Error fetching all products:", error);
    } finally {
      loading.value = false;
    }
  }

  async function fetchPaged(params: {
    search?: string;
    page: number;
    pageSize: number;
    sortBy?: string;
    isAscending?: boolean;
    categoryId?: number;
    startDate?: string;
    endDate?: string;
  }) {
    loading.value = true;
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      query.append("page", params.page.toString());
      query.append("pageSize", params.pageSize.toString());
      if (params.sortBy) query.append("sortBy", params.sortBy);
      query.append("isAscending", (params.isAscending ?? false).toString());
      if (params.categoryId)
        query.append("categoryId", params.categoryId.toString());
      if (params.startDate) query.append("startDate", params.startDate);
      if (params.endDate) query.append("endDate", params.endDate);

      const response = await fetch(`${baseUrl}?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        products.value = data.items;
        totalProducts.value = data.totalItems;
      }
    } catch (error) {
      console.error("Error fetching paged products:", error);
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
        return true;
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
    return false;
  }

  async function fetchById(id: number) {
    loading.value = true;
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("Error fetching product by id:", error);
    } finally {
      loading.value = false;
    }
    return null;
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

  return {
    products,
    totalProducts,
    loading,
    fetchAll,
    fetchPaged,
    fetchById,
    create,
    update,
    remove,
  };
});
