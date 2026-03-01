<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useProductStore } from "../stores/product.store";
import { useCategoryStore } from "../stores/category.store";
import { useUiStore } from "../stores/ui.store";
import ProductCard from "../components/ProductCard.vue";
import { useI18n } from "vue-i18n";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const uiStore = useUiStore();
const { t } = useI18n();

// Filter States
const search = ref("");
const page = ref(1);
const pageSize = ref(12);
const sortBy = ref("date");
const isAscending = ref(false);
const categoryId = ref<number | null>(null);
const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);

const showFilters = ref(false);

const loadProducts = async () => {
  await productStore.fetchPaged({
    search: search.value,
    page: page.value,
    pageSize: pageSize.value,
    sortBy: sortBy.value,
    isAscending: isAscending.value,
    categoryId: categoryId.value || undefined,
    startDate: startDate.value || undefined,
    endDate: endDate.value || undefined,
  });
};

// Debounced search for the text field
let searchTimeout: any = null;
watch(search, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    page.value = 1;
    loadProducts();
  }, 500);
});

// Immediate watch for other filters
watch([sortBy, isAscending, categoryId, startDate, endDate], () => {
  page.value = 1;
  loadProducts();
});

// Handle pagination change
watch(page, () => {
  loadProducts();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

onMounted(async () => {
  if (categoryStore.categories.length === 0) {
    await categoryStore.fetchAll();
  }
  await loadProducts();
});

const clearFilters = () => {
  search.value = "";
  categoryId.value = null;
  startDate.value = null;
  endDate.value = null;
  sortBy.value = "id";
  isAscending.value = false;
  page.value = 1;
};
</script>

<template>
  <v-container fluid class="pa-0">
    <!-- Premium Search Header -->
    <div
      :class="[
        'search-header py-12 px-6 border-b transition-colors duration-300',
        uiStore.theme === 'dark' ? 'bg-grey-darken-4' : 'bg-grey-lighten-4',
      ]"
    >
      <div class="max-width-container">
        <v-row align="center">
          <v-col cols="12" md="6">
            <h1 class="text-h2 font-weight-black mb-2">
              {{ t("message.products") }}
            </h1>
            <p
              :class="
                uiStore.theme === 'dark'
                  ? 'text-grey-lighten-1'
                  : 'text-grey-darken-1'
              "
              class="text-subtitle-1"
            >
              {{
                t("message.totalResults", { count: productStore.totalProducts })
              }}
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <div class="search-box-wrapper d-flex ga-2">
              <v-text-field
                v-model="search"
                :placeholder="t('message.searchHint')"
                prepend-inner-icon="mdi-magnify"
                variant="solo"
                flat
                :bg-color="uiStore.theme === 'dark' ? 'grey-darken-3' : 'white'"
                rounded="pill"
                hide-details
                class="search-input flex-grow-1 elevation-2"
                clearable
              ></v-text-field>
              <v-btn
                icon="mdi-tune"
                :color="
                  showFilters
                    ? 'primary'
                    : uiStore.theme === 'dark'
                      ? 'grey-darken-3'
                      : 'white'
                "
                rounded="circle"
                class="elevation-1"
                @click="showFilters = !showFilters"
              ></v-btn>
            </div>
          </v-col>
        </v-row>

        <!-- Advanced Filter Panel (Collapsible) -->
        <v-expand-transition>
          <div v-if="showFilters" class="mt-6">
            <v-card
              class="rounded-xl pa-8 border-0 shadow-lg"
              :theme="uiStore.theme"
            >
              <v-row>
                <v-col cols="12" sm="4">
                  <v-select
                    v-model="categoryId"
                    :items="categoryStore.categories"
                    item-title="name"
                    item-value="id"
                    :label="t('message.category')"
                    variant="outlined"
                    rounded="lg"
                    hide-details
                    clearable
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-select
                    v-model="sortBy"
                    :items="[
                      { title: t('message.name'), value: 'name' },
                      { title: t('message.price'), value: 'price' },
                      { title: t('message.date'), value: 'date' },
                    ]"
                    item-title="title"
                    item-value="value"
                    :label="t('message.sortBy')"
                    variant="outlined"
                    rounded="lg"
                    hide-details
                  >
                    <template v-slot:append-inner>
                      <v-btn
                        variant="text"
                        icon
                        density="compact"
                        @click.stop="isAscending = !isAscending"
                      >
                        <v-icon>{{
                          isAscending
                            ? "mdi-sort-ascending"
                            : "mdi-sort-descending"
                        }}</v-icon>
                      </v-btn>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-btn
                    block
                    color="error"
                    variant="tonal"
                    rounded="lg"
                    height="56"
                    @click="clearFilters"
                  >
                    <v-icon start>mdi-filter-off</v-icon>
                    Limpiar Filtros
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider class="my-6"></v-divider>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="startDate"
                    type="date"
                    :label="t('message.startDate')"
                    variant="outlined"
                    rounded="lg"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="endDate"
                    type="date"
                    :label="t('message.endDate')"
                    variant="outlined"
                    rounded="lg"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-expand-transition>
      </div>
    </div>

    <!-- Results Grid -->
    <v-container fluid class="max-width-container py-12 px-6">
      <!-- Loading State -->
      <v-row v-if="productStore.loading">
        <v-col v-for="n in pageSize" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader
            type="image, article, actions"
            class="rounded-xl border"
            :theme="uiStore.theme"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

      <template v-else>
        <v-row v-if="productStore.products.length > 0">
          <v-col
            v-for="product in productStore.products"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <ProductCard :product="product" class="h-100" />
          </v-col>
        </v-row>

        <!-- No Results State -->
        <v-row v-else class="text-center py-16 fill-height align-center">
          <v-col cols="12">
            <div class="no-results-state">
              <v-icon size="120" color="grey-lighten-2" class="mb-6"
                >mdi-shoe-sneaker-off</v-icon
              >
              <h3 class="text-h4 font-weight-bold text-grey-darken-1 mb-2">
                {{ t("message.noResults") }}
              </h3>
              <p class="text-subtitle-1 text-grey">
                No hemos encontrado zapatillas con esos criterios.
              </p>
              <v-btn
                color="primary"
                variant="flat"
                rounded="pill"
                class="mt-8 px-10"
                size="large"
                @click="clearFilters"
              >
                Restablecer búsqueda
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </template>

      <!-- Pagination -->
      <v-row
        v-if="productStore.totalProducts > pageSize && !productStore.loading"
        justify="center"
        class="mt-16"
      >
        <v-col cols="auto">
          <v-pagination
            v-model="page"
            :length="Math.ceil(productStore.totalProducts / pageSize)"
            rounded="circle"
            :active-color="uiStore.theme === 'dark' ? 'white' : 'primary'"
            elevation="2"
            total-visible="7"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
.max-width-container {
  max-width: 1400px;
  margin: 0 auto;
}

.search-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(15px);
}

/* Custom transitions */
.duration-300 {
  transition-duration: 300ms;
}

.shadow-lg {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1) !important;
}

.no-results-state {
  max-width: 450px;
  margin: 0 auto;
}

.v-container {
  min-height: calc(100vh - 400px);
}

/* Pagination visibility fix */
.v-pagination :deep(.v-pagination__list) {
  margin-bottom: 0px;
}
</style>
