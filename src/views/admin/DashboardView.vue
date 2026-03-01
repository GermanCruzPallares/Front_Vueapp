<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useProductStore } from "../../stores/product.store";
import { useCategoryStore } from "../../stores/category.store";
import { useUiStore } from "../../stores/ui.store";
import CategoryChart from "../../components/admin/charts/CategoryChart.vue";
import PriceChart from "../../components/admin/charts/PriceChart.vue";
import InventoryChart from "../../components/admin/charts/InventoryChart.vue";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const uiStore = useUiStore();
const { t } = useI18n();

onMounted(async () => {
  await Promise.all([productStore.fetchAll(), categoryStore.fetchAll()]);
});

const filteredProducts = computed(() => {
  return productStore.products.filter((p) => {
    const matchesCategory =
      !uiStore.dashboardFilters.categoryId ||
      p.categoryId === uiStore.dashboardFilters.categoryId;
    const matchesStartDate =
      !uiStore.dashboardFilters.startDate ||
      new Date(p.createdAt) >= new Date(uiStore.dashboardFilters.startDate);
    const matchesEndDate =
      !uiStore.dashboardFilters.endDate ||
      new Date(p.createdAt) <= new Date(uiStore.dashboardFilters.endDate);
    return matchesCategory && matchesStartDate && matchesEndDate;
  });
});

const totalProducts = computed(() => filteredProducts.value.length);
const totalCategories = computed(() => {
  if (uiStore.dashboardFilters.categoryId) return 1;
  return categoryStore.categories.length;
});
const avgPrice = computed(() => {
  if (filteredProducts.value.length === 0) return 0;
  const total = filteredProducts.value.reduce(
    (acc: number, p: any) => acc + p.price,
    0,
  );
  return (total / filteredProducts.value.length).toFixed(2);
});

const refreshData = async () => {
  await Promise.all([productStore.fetchAll(), categoryStore.fetchAll()]);
};
</script>

<template>
  <!-- pa-16 en el contenedor principal y ga-16 en las filas -->
  <v-container fluid class="pa-16 d-flex flex-column ga-16">
    <v-row class="align-center">
      <v-col>
        <h2 class="text-h4 font-weight-bold">
          {{ t("message.adminDashboard") }}
        </h2>
        <div class="text-subtitle-1 text-grey">
          {{ t("message.dashboardSubtitle") }}
        </div>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          prepend-icon="mdi-refresh"
          variant="elevated"
          rounded="pill"
          @click="refreshData"
        >
          {{ t("message.refreshData") }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="ga-4 align-center">
      <v-col cols="12" md="3">
        <v-select
          v-model="uiStore.dashboardFilters.categoryId"
          :items="categoryStore.categories"
          item-title="name"
          item-value="id"
          :label="t('message.category')"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="uiStore.dashboardFilters.startDate"
          type="date"
          :label="t('message.startDate')"
          variant="outlined"
          density="compact"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          v-model="uiStore.dashboardFilters.endDate"
          type="date"
          :label="t('message.endDate')"
          variant="outlined"
          density="compact"
          hide-details
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <!-- ga-10 para separar los indicadores -->
    <v-row class="ga-10">
      <v-col cols="12" sm="3" class="pa-0">
        <v-card
          variant="flat"
          border
          :color="
            uiStore.theme === 'dark' ? 'indigo-darken-4' : 'indigo-lighten-5'
          "
          :class="[
            'rounded-xl pa-8 ma-2',
            uiStore.theme === 'dark'
              ? 'text-indigo-lighten-4'
              : 'text-indigo-darken-3',
          ]"
        >
          <div class="text-overline mb-2 opacity-70">
            {{ t("message.totalProducts") }}
          </div>
          <div class="text-h3 font-weight-bold">{{ totalProducts }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="3" class="pa-0">
        <v-card
          variant="flat"
          border
          :color="uiStore.theme === 'dark' ? 'teal-darken-4' : 'teal-lighten-5'"
          :class="[
            'rounded-xl pa-8 ma-2',
            uiStore.theme === 'dark'
              ? 'text-teal-lighten-4'
              : 'text-teal-darken-3',
          ]"
        >
          <div class="text-overline mb-2 opacity-70">
            {{ t("message.activeCategories") }}
          </div>
          <div class="text-h3 font-weight-bold">{{ totalCategories }}</div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="3" class="pa-0">
        <v-card
          variant="flat"
          border
          :color="
            uiStore.theme === 'dark' ? 'orange-darken-4' : 'orange-lighten-5'
          "
          :class="[
            'rounded-xl pa-8 ma-2',
            uiStore.theme === 'dark'
              ? 'text-orange-lighten-4'
              : 'text-orange-darken-3',
          ]"
        >
          <div class="text-overline mb-2 opacity-70">
            {{ t("message.avgPrice") }}
          </div>
          <div class="text-h3 font-weight-bold">{{ avgPrice }}€</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ga-16 para separar los bloques de gráficas -->
    <v-row class="ga-16">
      <v-col cols="12" md="4" class="pa-0">
        <v-card class="rounded-xl pa-10 elevation-2" border height="550">
          <v-card-title class="px-0 pb-8 font-weight-bold text-h5">{{
            t("message.categoryDist")
          }}</v-card-title>
          <v-divider class="mb-10"></v-divider>
          <CategoryChart :products="filteredProducts" />
        </v-card>
      </v-col>

      <v-col cols="12" md="7" class="pa-0">
        <v-card class="rounded-xl pa-10 elevation-2" border height="550">
          <v-card-title class="px-0 pb-8 font-weight-bold text-h5">{{
            t("message.avgPriceByCat")
          }}</v-card-title>
          <v-divider class="mb-10"></v-divider>
          <PriceChart :products="filteredProducts" />
        </v-card>
      </v-col>
    </v-row>

    <v-row class="ga-16">
      <v-col cols="12" md="7" class="pa-0">
        <v-card class="rounded-xl pa-10 elevation-2" border height="550">
          <v-card-title class="px-0 pb-8 font-weight-bold text-h5">{{
            t("message.stockByBrand")
          }}</v-card-title>
          <v-divider class="mb-10"></v-divider>
          <InventoryChart :products="filteredProducts" />
        </v-card>
      </v-col>

      <v-col cols="12" md="4" class="pa-0">
        <v-card class="rounded-xl pa-10 elevation-2" border height="550">
          <v-card-title class="px-0 pb-8 font-weight-bold text-h5">{{
            t("message.quickActions")
          }}</v-card-title>
          <v-divider class="mb-10"></v-divider>
          <v-list class="mt-4" lines="three" bg-color="transparent">
            <v-list-item
              :title="t('message.addProduct')"
              :subtitle="t('message.addProductSubtitle')"
              to="/admin/products"
              link
              color="primary"
              variant="tonal"
              class="rounded-lg mb-8"
            ></v-list-item>
            <v-list-item
              :title="t('message.addCategory')"
              :subtitle="t('message.addCategorySubtitle')"
              to="/admin/categories"
              link
              color="secondary"
              variant="tonal"
              class="rounded-lg"
            ></v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-container {
  max-width: 1800px;
  margin: 0 auto;
}
</style>
