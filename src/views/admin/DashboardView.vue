<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useProductStore } from "../../stores/product.store";
import { useCategoryStore } from "../../stores/category.store";

const productStore = useProductStore();
const categoryStore = useCategoryStore();

onMounted(async () => {
  await Promise.all([productStore.fetchAll(), categoryStore.fetchAll()]);
});

const totalProducts = computed(() => productStore.products.length);
const totalCategories = computed(() => categoryStore.categories.length);
const avgPrice = computed(() => {
  if (productStore.products.length === 0) return 0;
  const total = productStore.products.reduce(
    (acc: number, p: any) => acc + p.price,
    0,
  );
  return (total / productStore.products.length).toFixed(2);
});
</script>

<template>
  <div>
    <h2 class="text-h4 font-weight-bold mb-6">Dashboard Administrativo</h2>

    <v-row>
      <v-col cols="12" sm="4">
        <v-card theme="dark" color="primary" class="rounded-xl pa-4">
          <div class="text-overline mb-1">Total Productos</div>
          <div class="text-h3 font-weight-bold">{{ totalProducts }}</div>
          <v-icon
            size="64"
            class="position-absolute"
            style="right: 16px; bottom: 16px; opacity: 0.2"
            >mdi-shoe-sneaker</v-icon
          >
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card theme="dark" color="secondary" class="rounded-xl pa-4">
          <div class="text-overline mb-1">Categorías Acivas</div>
          <div class="text-h3 font-weight-bold">{{ totalCategories }}</div>
          <v-icon
            size="64"
            class="position-absolute"
            style="right: 16px; bottom: 16px; opacity: 0.2"
            >mdi-shape</v-icon
          >
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card theme="dark" color="success" class="rounded-xl pa-4">
          <div class="text-overline mb-1">Precio Medio</div>
          <div class="text-h3 font-weight-bold">{{ avgPrice }}€</div>
          <v-icon
            size="64"
            class="position-absolute"
            style="right: 16px; bottom: 16px; opacity: 0.2"
            >mdi-cash-multiple</v-icon
          >
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <v-card class="rounded-xl pa-6 fill-height" min-height="400">
          <v-card-title>Análisis de Inventario</v-card-title>
          <div
            class="d-flex align-center justify-center fill-height bg-grey-lighten-4 rounded-lg mt-4"
          >
            <span class="text-grey"
              >Gráfico de distribución por categoría (Próximamente)</span
            >
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="rounded-xl pa-6 fill-height" min-height="400">
          <v-card-title>Acciones Rápidas</v-card-title>
          <v-list class="mt-4">
            <v-list-item
              prepend-icon="mdi-plus"
              title="Añadir Producto"
              to="/admin/products"
              link
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-plus-box"
              title="Añadir Categoría"
              to="/admin/categories"
              link
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-account-group"
              title="Gestionar Usuarios"
              disabled
            ></v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.position-absolute {
  position: absolute;
}
</style>
