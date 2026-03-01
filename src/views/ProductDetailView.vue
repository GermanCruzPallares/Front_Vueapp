<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore, type Product } from "../stores/product.store";
import { useI18n } from "vue-i18n";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const { t } = useI18n();

const product = ref<Product | null>(null);
const loading = ref(true);

onMounted(async () => {
  const id = parseInt(route.params.id as string);
  product.value = await productStore.fetchById(id);
});
</script>

<template>
  <v-container class="pa-8">
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-6"
      @click="router.back()"
    >
      {{ t("message.home") }}
    </v-btn>

    <v-row v-if="loading">
      <v-col cols="12" md="6">
        <v-skeleton-loader type="image"></v-skeleton-loader>
      </v-col>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="article, actions"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else-if="product">
      <v-col cols="12" md="6">
        <v-card class="rounded-xl overflow-hidden elevation-2" border>
          <v-img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            height="500"
            cover
          >
            <v-chip
              color="primary"
              variant="flat"
              class="ma-4 font-weight-bold"
              size="large"
            >
              {{ product.price }}€
            </v-chip>
          </v-img>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <div class="d-flex flex-column h-100 pa-4 mt-8 mt-md-0">
          <h1 class="text-h2 font-weight-black mb-4">{{ product.name }}</h1>

          <div class="d-flex ga-4 mb-8 flex-wrap">
            <v-chip
              v-if="product.brand"
              prepend-icon="mdi-tag"
              color="secondary"
              variant="outlined"
            >
              {{ product.brand }}
            </v-chip>
            <v-chip
              v-if="product.size"
              prepend-icon="mdi-ruler"
              color="orange"
              variant="outlined"
            >
              {{ product.size }}
            </v-chip>
            <v-chip
              v-if="product.color"
              prepend-icon="mdi-palette"
              color="purple"
              variant="outlined"
            >
              {{ product.color }}
            </v-chip>
          </div>

          <v-divider class="mb-8"></v-divider>

          <p class="text-h6 text-grey-darken-1 mb-8 leading-relaxed">
            {{ product.description || "Sin descripción disponible." }}
          </p>

          <v-card variant="tonal" color="primary" class="rounded-xl pa-6 mb-8">
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-overline">{{ t("message.category") }}</div>
                <div class="text-h5 font-weight-bold">
                  {{ (product as any).categoryName }}
                </div>
              </div>
              <v-icon size="48" opacity="0.3">mdi-shoe-sneaker</v-icon>
            </div>
          </v-card>

          <v-spacer></v-spacer>

          <v-btn
            size="x-large"
            color="primary"
            block
            rounded="pill"
            prepend-icon="mdi-cart-plus"
            class="elevation-4"
          >
            Añadir al Carrito
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" class="text-center py-16">
        <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
        <h2 class="text-h4">Producto no encontrado</h2>
        <v-btn color="primary" variant="outlined" class="mt-6" to="/products">
          Volver a la tienda
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.leading-relaxed {
  line-height: 1.8 !important;
}
</style>
