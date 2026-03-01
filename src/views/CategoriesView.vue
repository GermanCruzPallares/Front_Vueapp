<script setup lang="ts">
import { onMounted } from "vue";
import { useCategoryStore } from "../stores/category.store";
import CategoryCard from "../components/CategoryCard.vue";
import { useI18n } from "vue-i18n";

const categoryStore = useCategoryStore();
const { t } = useI18n();

onMounted(async () => {
  await categoryStore.fetchAll();
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="mb-4">
        <h2 class="text-h4 font-weight-bold">{{ t("message.categories") }}</h2>
      </v-col>
    </v-row>

    <v-row v-if="categoryStore.loading">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="category in categoryStore.categories"
        :key="category.id"
        cols="12"
        sm="6"
        md="4"
      >
        <CategoryCard :category="category" />
      </v-col>
    </v-row>
  </v-container>
</template>
