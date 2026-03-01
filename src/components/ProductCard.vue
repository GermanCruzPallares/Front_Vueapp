<script setup lang="ts">
import { useAuthStore } from "../stores/auth.store";
import { useCategoryStore } from "../stores/category.store";
import { useI18n } from "vue-i18n";
import type { Product } from "../stores/product.store";
import { computed } from "vue";

const props = defineProps<{
  product: Product;
  showActions?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", product: Product): void;
  (e: "delete", id: number): void;
}>();

const categoryStore = useCategoryStore();
const { t } = useI18n();

const categoryName = computed(() => {
  const cat = categoryStore.categories.find(
    (c: any) => c.id === props.product.categoryId,
  );
  return cat ? cat.name : "S/C";
});
</script>

<template>
  <v-card
    class="mb-4 elevation-3 rounded-xl overflow-hidden"
    border
    :to="showActions ? undefined : `/products/${product.id}`"
  >
    <v-img
      height="200"
      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      cover
      class="bg-grey-lighten-2"
    >
      <v-chip class="ma-2 font-weight-bold" color="primary" label>
        {{ product.price }}€
      </v-chip>
    </v-img>

    <v-card-item>
      <div class="text-overline mb-1 text-primary font-weight-bold">
        {{ categoryName }}
      </div>
      <v-card-title class="text-h6 font-weight-bold">
        {{ product.name }}
      </v-card-title>
      <div class="text-body-2 text-grey-darken-1">
        {{ product.brand }} - {{ t("message.size") }} {{ product.size }}
      </div>
    </v-card-item>

    <v-card-text>
      <p class="text-body-2 line-clamp-2">{{ product.description }}</p>
    </v-card-text>

    <v-divider v-if="showActions"></v-divider>

    <v-card-actions v-if="showActions" class="pa-4 bg-grey-lighten-4">
      <v-btn
        variant="elevated"
        color="primary"
        size="small"
        prepend-icon="mdi-pencil"
        @click="emit('edit', product)"
      >
        {{ t("message.edit") }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        variant="tonal"
        color="error"
        size="small"
        prepend-icon="mdi-delete"
        @click="emit('delete', product.id)"
      >
        {{ t("message.delete") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
