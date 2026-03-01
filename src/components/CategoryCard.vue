<script setup lang="ts">
import { useAuthStore } from "../stores/auth.store";
import { useI18n } from "vue-i18n";
import type { Category } from "../stores/category.store";

const props = defineProps<{
  category: Category;
  showActions?: boolean;
}>();

const emit = defineEmits<{
  (e: "edit", category: Category): void;
  (e: "delete", id: number): void;
}>();

const { t } = useI18n();
</script>

<template>
  <v-card class="mb-4 elevation-2 rounded-lg" border>
    <v-card-item>
      <v-card-title class="text-h6 font-weight-bold primary--text">
        {{ category.name }}
      </v-card-title>
      <v-card-subtitle> ID: {{ category.id }} </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <p class="text-body-1">{{ category.description }}</p>
    </v-card-text>

    <v-divider v-if="showActions"></v-divider>

    <v-card-actions v-if="showActions" class="pa-4">
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        color="primary"
        prepend-icon="mdi-pencil"
        @click="emit('edit', category)"
      >
        {{ t("message.edit") }}
      </v-btn>
      <v-btn
        variant="text"
        color="error"
        prepend-icon="mdi-delete"
        @click="emit('delete', category.id)"
      >
        {{ t("message.delete") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
