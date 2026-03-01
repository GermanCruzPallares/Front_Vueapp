<script setup lang="ts">
import { onMounted } from "vue";
import { useProductStore } from "../stores/product.store";
import { useCategoryStore } from "../stores/category.store";
import ProductCard from "../components/ProductCard.vue";
import { useI18n } from "vue-i18n";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const { t } = useI18n();

onMounted(async () => {
  if (categoryStore.categories.length === 0) {
    await categoryStore.fetchAll();
  }
  await productStore.fetchAll();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="mb-4">
        <h2 class="text-h4 font-weight-bold">{{ t("message.products") }}</h2>
      </v-col>
    </v-row>

    <v-row v-if="productStore.loading">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="image, article"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="product in productStore.products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
      >
        <ProductCard :product="product" />
      </v-col>
    </v-row>
  </v-container>
</template>
